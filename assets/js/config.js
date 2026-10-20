/* =========================================================
   Supabase 配置（部署前必填）
   ---------------------------------------------------------
   1) 打开 https://supabase.com 新建一个项目（免费版够用）
   2) Project Settings → API，复制两个值填到下面
   3) 打开左侧 SQL Editor，把 supabase/schema.sql 全文粘贴执行
   4) 把管理员的邮箱密码写进 admins 表（见 schema.sql 末尾）
   ---------------------------------------------------------
   anon key 是公开的，放在前端是 Supabase 的标准用法；
   真正的权限由数据库 RLS 控制，不要把 service_role key 放进来。
   ========================================================= */

window.LA_CONFIG = (function () {
  'use strict';

  /* ↓↓↓ 只需要改这两行 ↓↓↓ */
  var SUPABASE_URL = 'https://pkaoslpmzitiazxestdz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYW9zbHBteml0aWF6eGVzdGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODIxNTAsImV4cCI6MjEwODA1ODE1MH0.f5XOL5PGmHAl_n2xipMLlRSn_iSF7cJCSGLRqO_KTR0';

  /* 每个密码默认可用次数（后台生成时可以单独指定，这里是批量生成的默认值） */
  var DEFAULT_MAX_USES = 3;

  function isConfigured() {
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(SUPABASE_URL || '') &&
      typeof SUPABASE_ANON_KEY === 'string' &&
      SUPABASE_ANON_KEY.length > 40 &&
      SUPABASE_ANON_KEY.indexOf('YOUR_') !== 0;
  }

  return {
    url: SUPABASE_URL.replace(/\/+$/, ''),
    anonKey: SUPABASE_ANON_KEY,
    defaultMaxUses: DEFAULT_MAX_USES,
    isConfigured: isConfigured
  };
})();
