-- =========================================================
--  恋爱人格测试 · Supabase 建库脚本
--  用法：Supabase 控制台 → SQL Editor → 新建查询 → 全文粘贴 → Run
--  可重复执行（幂等），不会清掉已有数据。
-- =========================================================

-- ---------------------------------------------------------
-- 1. 管理员名单
--    只有邮箱在表里的人，才能读写密码表和结果表。
-- ---------------------------------------------------------
create table if not exists public.admins (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. 邀请密码
--    code       统一存大写、去掉横线（LAxxxxxxxxxxx），保证唯一
--    max_uses   可用次数，默认 3
--    used_count 已经用掉的次数，只会增，不会超过 max_uses
-- ---------------------------------------------------------
create table if not exists public.invite_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  batch         text,
  note          text,
  max_uses      int  not null default 3 check (max_uses between 1 and 99),
  used_count    int  not null default 0,
  revoked       boolean not null default false,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz,
  constraint invite_codes_used_le_max check (used_count <= max_uses),
  constraint invite_codes_code_len    check (length(code) between 4 and 32)
);

create index if not exists invite_codes_created_idx on public.invite_codes (created_at desc);
create index if not exists invite_codes_batch_idx   on public.invite_codes (batch);

-- ---------------------------------------------------------
-- 3. 测试结果
--    每次成功出结果写一行，用于统计「哪个入口/哪个人格最热」
-- ---------------------------------------------------------
create table if not exists public.quiz_results (
  id          bigint generated always as identity primary key,
  code_id     uuid references public.invite_codes(id) on delete set null,
  code        text not null,
  entry       text not null default 'unknown',
  archetype   text,
  figure      text,
  match_rate  int,
  vector      int[],
  answers     text,
  created_at  timestamptz not null default now()
);

create index if not exists quiz_results_created_idx on public.quiz_results (created_at desc);
create index if not exists quiz_results_code_idx    on public.quiz_results (code);
create index if not exists quiz_results_figure_idx  on public.quiz_results (figure);

-- ---------------------------------------------------------
-- 4. 判断当前登录者是不是管理员
--    用 security definer 读 admins，避免被 RLS 拦死
-- ---------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.admins a
     where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------
-- 5. 查密码（只读，不扣次数）
--    前端在「点入口」时调用，先确认还有没有次数，
--    避免用户答完 20 题才被告知密码失效。
-- ---------------------------------------------------------
create or replace function public.check_invite_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code text;
  r      public.invite_codes%rowtype;
begin
  v_code := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));

  if v_code = '' then
    return jsonb_build_object('ok', false, 'reason', 'empty');
  end if;

  select * into r from public.invite_codes where code = v_code;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if r.revoked then
    return jsonb_build_object('ok', false, 'reason', 'revoked');
  end if;

  if r.used_count >= r.max_uses then
    return jsonb_build_object(
      'ok', false, 'reason', 'exhausted',
      'used', r.used_count, 'max', r.max_uses, 'remaining', 0
    );
  end if;

  return jsonb_build_object(
    'ok', true, 'reason', 'ok',
    'used', r.used_count, 'max', r.max_uses,
    'remaining', r.max_uses - r.used_count
  );
end;
$$;

-- ---------------------------------------------------------
-- 6. 用掉一次（原子操作）
--    UPDATE ... WHERE used_count < max_uses 会在行上加锁，
--    并发同时提交也绝不会超发，第 4 次必然失败。
--    成功后顺手把结果写进 quiz_results。
-- ---------------------------------------------------------
create or replace function public.consume_invite_code(
  p_code       text,
  p_entry      text    default null,
  p_archetype  text    default null,
  p_figure     text    default null,
  p_rate       int     default null,
  p_vector     int[]   default null,
  p_answers    text    default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code  text;
  v_id    uuid;
  v_used  int;
  v_max   int;
  v_entry text;
  v_rev   boolean;
  v_old   int;
begin
  v_code := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));

  v_entry := case when p_entry in ('female', 'male') then p_entry else 'unknown' end;

  update public.invite_codes
     set used_count   = used_count + 1,
         last_used_at = now()
   where code = v_code
     and revoked = false
     and used_count < max_uses
  returning id, used_count, max_uses into v_id, v_used, v_max;

  if v_id is null then
    -- 没更新到：区分「不存在 / 已停用 / 次数用完」
    select id, used_count, max_uses, revoked
      into v_id, v_old, v_max, v_rev
      from public.invite_codes
     where code = v_code;

    if v_id is null then
      return jsonb_build_object('ok', false, 'reason', 'not_found');
    elsif v_rev then
      return jsonb_build_object('ok', false, 'reason', 'revoked');
    else
      return jsonb_build_object(
        'ok', false, 'reason', 'exhausted',
        'used', v_old, 'max', v_max, 'remaining', 0
      );
    end if;
  end if;

  insert into public.quiz_results (code_id, code, entry, archetype, figure, match_rate, vector, answers)
  values (v_id, v_code, v_entry, p_archetype, p_figure, p_rate, p_vector, p_answers);

  return jsonb_build_object(
    'ok', true, 'reason', 'ok',
    'used', v_used, 'max', v_max,
    'remaining', v_max - v_used
  );
end;
$$;

-- ---------------------------------------------------------
-- 7. 行级权限（RLS）
--    - 匿名访客：不能直接读密码表，只能调上面两个函数
--    - 管理员：登录后可读写
-- ---------------------------------------------------------
alter table public.admins       enable row level security;
alter table public.invite_codes enable row level security;
alter table public.quiz_results enable row level security;

drop policy if exists admins_read      on public.admins;
drop policy if exists codes_admin_all  on public.invite_codes;
drop policy if exists results_admin_read on public.quiz_results;

create policy admins_read on public.admins
  for select to authenticated
  using (public.is_admin());

create policy codes_admin_all on public.invite_codes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy results_admin_read on public.quiz_results
  for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------
-- 8. 创建管理员账号
--    ① 先在 Authentication → Users → Add user，建一个邮箱+密码
--       （建议把 "Auto Confirm User" 打开，否则要收验证邮件）
--    ② 再把那个邮箱写进 admins 表，把下面这行改成你的邮箱后执行
-- ---------------------------------------------------------
-- insert into public.admins (email) values ('you@example.com')
--   on conflict (email) do nothing;

-- ---------------------------------------------------------
-- 9. 可选：造几个测试密码，密码是 3 次
-- ---------------------------------------------------------
-- insert into public.invite_codes (code, batch, max_uses) values
--   ('LATESTTESTM42', '测试', 3),
--   ('LADEMO2026UB7', '测试', 3)
-- on conflict (code) do nothing;

-- =========================================================
--  自检：执行完这三句，应该看到 3 张表、4 个函数
-- =========================================================
-- select table_name from information_schema.tables where table_schema = 'public';
-- select routine_name from information_schema.routines where routine_schema = 'public';
