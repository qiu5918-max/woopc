# Qiu Website 项目说明

## 项目概述

邱小亮个人营销型网站，基于 Astro 框架构建，通过 API 从管理后台获取数据。

---

## 服务器信息

| 项目 | 值 |
|------|-----|
| 服务器 IP | `101.42.36.114` |
| SSH 账号 | `root` |
| SSH 密码 | `ai123456AI` |
| SSH 密钥 | `~/.ssh/id_ed25519` |
| SSH 连接命令 | `sshpass -p 'ai123456AI' ssh root@101.42.36.114` |

---

## 服务状态

| 服务名称 | 端口 | 目录 | PM2 名称 |
|----------|------|------|----------|
| 前端网站 | 5918 | `/var/www/qiu-website` | `qiu-website` |
| 管理后台 | 5919 | `/var/www/qiu-admin` | `qiu-admin` |

---

## 访问地址

| 服务 | URL |
|------|-----|
| 前端展示 | http://101.42.36.114:5918 |
| 管理后台 | http://101.42.36.114:5919 |
| GitHub | https://github.com/qiu5918-max/woopc |

### 管理后台登录

- 邮箱: `admin@qiuxiaoliang.com`
- 密码: `admin123456`

---

## API 信息

### 公开 API 端点

```
基础地址: http://101.42.36.114:5919/api/v1/public/www
```

| 资源 | 端点 |
|------|------|
| 服务 | `/services` |
| 案例 | `/cases` |
| 博客 | `/blogs` |
| 荣誉 | `/honors` |
| 站点配置 | `/config` |

### 示例

```bash
# 获取服务列表
curl http://101.42.36.114:5919/api/v1/public/www/services

# 获取案例列表
curl http://101.42.36.114:5919/api/v1/public/www/cases

# 获取博客列表
curl http://101.42.36.114:5919/api/v1/public/www/blogs

# 获取荣誉列表
curl http://101.42.36.114:5919/api/v1/public/www/honors
```

---

## 部署流程

### 本地构建

```bash
cd /Users/mr.qiu/qiu-website
npm run build
```

构建产物位于 `dist/` 目录。

### 部署到服务器

```bash
# 1. 清空服务器旧文件
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "rm -rf /var/www/qiu-website/*"

# 2. 上传新文件
sshpass -p 'ai123456AI' scp -r /Users/mr.qiu/qiu-website/dist/* root@101.42.36.114:/var/www/qiu-website/

# 3. 重启服务（如需要）
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "pm2 restart qiu-website"
```

### 一键部署命令

```bash
cd /Users/mr.qiu/qiu-website && npm run build && sshpass -p 'ai123456AI' ssh root@101.42.36.114 "rm -rf /var/www/qiu-website/*" && sshpass -p 'ai123456AI' scp -r dist/* root@101.42.36.114:/var/www/qiu-website/
```

---

## 服务器常用命令

```bash
# SSH 连接
sshpass -p 'ai123456AI' ssh root@101.42.36.114

# 查看 PM2 状态
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "pm2 list"

# 查看日志
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "pm2 logs qiu-website"

# 重启服务
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "pm2 restart qiu-website"

# 查看文件
sshpass -p 'ai123456AI' ssh root@101.42.36.114 "ls -la /var/www/qiu-website/"
```

---

## 数据库信息

| 项目 | 值 |
|------|-----|
| 数据库类型 | PostgreSQL (Neon) |
| 连接地址 | `postgresql://neondb_owner:npg_QKOba0Fsqmr2@ep-mute-wildflower-a10moxuu-pooler.ap-southeast-1.aws.neon.tech/neondb` |

---

## GitHub 仓库

| 项目 | 值 |
|------|-----|
| 仓库地址 | https://github.com/qiu5918-max/woopc |
| Git Clone | `git@github.com:qiu5918-max/woopc.git` |

### 推送代码

```bash
cd /Users/mr.qiu/qiu-website
git add .
git commit -m "your message"
git push
```

---

## 项目结构

```
qiu-website/
├── src/
│   ├── components/       # Astro 组件
│   │   ├── About.astro   # 关于我（荣誉从API获取）
│   │   ├── Blog.astro    # 博客（从API获取）
│   │   ├── Cases.astro   # 案例（从API获取）
│   │   ├── Services.astro# 服务（从API获取）
│   │   └── ...
│   ├── layouts/          # 布局模板
│   ├── pages/            # 页面
│   └── styles/           # 样式
├── public/               # 静态资源
├── dist/                 # 构建产物
└── package.json
```

---

## 技术栈

- **框架**: Astro 5.x
- **样式**: Tailwind CSS
- **部署**: PM2 + serve
- **API**: qiu-admin (Next.js)

---

*最后更新: 2026-02-24*
