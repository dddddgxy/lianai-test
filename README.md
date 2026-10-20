# 测测你最适合跟哪位历史人物谈恋爱

小红书风格的娱乐向恋爱人格测试：邀请密码门（每码 3 次）+ 结果海报，
后端用 **Supabase**（数据库 + 管理员登录），前端纯静态，可部署到
GitHub Pages / Vercel / Netlify。

## 玩法

- **密码门**：打开即要求输入邀请密码（`LA-XXXX-XXXX-XXX`），数据库验证通过才能进入。
- 首页两个入口：
  - **女生入口**：你适合被哪位古人认真喜欢（匹配男历史人物，41 位 / 9 种人格）
  - **男生入口**：你适合和哪位古人并肩恋爱（匹配女历史人物，23 位 / 8 种人格）
- 每个入口 20 道生活化情景题（单题单屏 + 进度条），不考历史知识；
  四个选项都是「你会怎么做」，不谈感受，四种做法风格不同。
- 结果页输出：恋爱人格标签 → 最匹配历史人物 → 六边形六维雷达图 →
  **恋爱性格分析** → 恋爱场景对话 → 磨合点/雷点 → 相处建议。
- **生成结果海报**：Canvas 手绘 750×1334 PNG，手机长按保存。

## 密码与次数（存 Supabase）

- 每个密码默认可测 **3 次**（生成时可单独指定 1-99）。
- 次数由数据库**原子更新**控制：`UPDATE … WHERE used_count < max_uses`
  在行上加锁，两台设备同时提交也绝不会多发第 4 次。
- 扣次数的时机是**出结果那一刻**；点进测试页前会先查一次剩余次数，
  避免答完 20 题才被告知密码失效。
- 首页会显示「这个密码还能测 N 次」，用完即止。
- 每次出结果会在 `quiz_results` 表记一条匿名数据
  （入口 / 人格 / 人物 / 相似度 / 六维向量），**不记任何身份信息**。

## 部署前必做（5 步，约 5 分钟）

1. 到 [supabase.com](https://supabase.com) 新建项目（免费版够用）。
2. 左侧 **SQL Editor** → New query → 把 `supabase/schema.sql` 全文粘贴 → Run。
   会建好 3 张表、2 个数据库函数和行级权限。
3. **创建管理员账号**：左侧 **Authentication → Users → Add user**，
   填邮箱 + 密码（勾选 Auto Confirm User）。
4. 把该邮箱写进管理员名单：SQL Editor 执行
   ```sql
   insert into public.admins (email) values ('你的邮箱') on conflict do nothing;
   ```
5. **Project Settings → API** 复制 Project URL 和 anon public key，
   填进 `assets/js/config.js`：
   ```js
   var SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
   var SUPABASE_ANON_KEY = 'eyJhbGciOi…';
   ```

完成。前台输密码即可测，后台用管理员邮箱登录。

### 本地测试密码（可选）

schema.sql 第 9 节有注释掉的测试密码，取消注释执行即可，例如 `LA-TEST-TEST-M42`。

## 后台（admin.html）

- 登录方式：Supabase Auth 邮箱 + 密码（第 3 步创建的账号）。
  权限由数据库 RLS 控制：邮箱不在 `admins` 表里，读不到任何数据。
- 功能：
  - 批量生成密码（数量 / 每个可测次数 / 批次备注，生成后自动复制）
  - 密码列表：已用次数 / 上限 / 剩余徽章、停用、启用、删除
  - 复制所有**还有剩余次数**的密码
  - **导出 Excel**（含已用次数、剩余次数、状态、最后使用时间）
  - 最近测试结果（哪个入口、哪个人格、哪位人物最热）
  - 查任意密码的剩余次数

## 文件结构

```
├── index.html                  # 测试站单页（密码门 / 首页 / 测试页 / 结果页）
├── admin.html                  # 密码管理后台
├── supabase/
│   └── schema.sql              # 建库脚本（表 / 函数 / RLS，可重复执行）
├── assets/
│   ├── css/
│   │   ├── style.css           # 主站样式（宣纸 + 墨 + 朱砂）
│   │   └── admin.css           # 后台样式
│   └── js/
│       ├── config.js           # ★ Supabase 地址与 anon key（部署前必填）
│       ├── backend.js          # Supabase 封装（查次数 / 扣次数 / 后台接口）
│       ├── data-figures.js     # 9 + 8 类人格原型 + 64 位人物数据
│       ├── data-questions.js   # 两个入口各 20 道题
│       ├── data-insights.js    # 性格分析文案库
│       ├── codes.js            # 密码格式与生成器（LA + 8 位 + 3 位校验位）
│       ├── xlsx.js             # 极简 XLSX 生成器（手写 zip，零依赖）
│       ├── poster.js           # Canvas 结果海报
│       ├── admin.js            # 后台逻辑
│       └── app.js              # 计分、匹配、雷达、分析、海报、密码门
└── README.md
```

## 数据库设计（schema.sql 摘要）

| 表 | 作用 | 关键字段 |
|---|---|---|
| `admins` | 管理员邮箱名单 | email |
| `invite_codes` | 邀请密码 | code（唯一）、max_uses、used_count、revoked、batch |
| `quiz_results` | 每次测试结果 | code、entry、archetype、figure、match_rate、vector |

| 函数 | 说明 |
|---|---|
| `check_invite_code(code)` | 只查不扣：是否存在 / 剩几次 |
| `consume_invite_code(code, …)` | 原子 +1 并写入结果，第 4 次必然失败 |
| `is_admin()` | 判断当前登录者是否在 admins 表里 |

行级权限：匿名访客**不能直接读密码表**，只能调上面两个函数；
管理员（authenticated 且在 admins 表）可读写。

## 常见问题

- **提示「数据库还没建表」**：schema.sql 没执行，或刚执行完等半分钟（schema cache 刷新）。
- **后台登录提示没有权限**：账号存在但邮箱没写进 `admins` 表（第 4 步）。
- **提示连不上数据库**：检查 `config.js` 的 URL 是否带了 `https://`、有没有多余路径。
- **改了 max_uses 但用户已用完**：后台密码行点「停用/启用」之外，
  可直接在 Supabase Table Editor 里改 `max_uses`（改大即恢复可用）。

## 算法（简述）

1. 每个选项对 6 个维度（主动/陪伴/浪漫/冒险/表达/边界感）有增量；
   每题先做选项中心化，再按可达上限归一化，得到 0-100 的用户向量。
2. 用户向量与 8 个「人格原型」质心算欧氏距离，取最近 → 恋爱人格标签。
3. 同一原型内多位人物：贴合度加权 + 答案哈希**稳定抽签**，同答案永远同结果。
4. 人物库全部为正面人物 / 正面文化符号；匹配只是性格与关系隐喻，不构成历史评价。

## 部署

静态托管即可（GitHub Pages / Vercel / Netlify 均可），`config.js` 填好后整包上传。
注意 Supabase 免费项目会暂停，长期使用请在后台 Keep active 或升级。

## 内容原则

- 所有历史人物均为正面人物或正面文化符号，不含争议人物与敏感近现代人物。
- 结果文案以尊重、平等、共同成长为基调。
- 免责声明固定显示于页面底部：
  「本测试为娱乐内容，人物匹配仅为性格与关系隐喻，不构成历史评价；
  所有关系场景均以尊重、平等、健康为前提。」
