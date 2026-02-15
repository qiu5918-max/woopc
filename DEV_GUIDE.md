# 邱小亮个人网站 - 开发规范文档

## 一、项目概述

| 项目 | 说明 |
|------|------|
| 项目名称 | 邱小亮双核心个人IP营销型H5网站 |
| 核心定位 | 企业AI智能体实施部署 + 心脑血管健康数字化管理 |
| 技术栈 | Astro 5.x + Tailwind CSS + TinaCMS + Dify API + Formspree |
| 部署平台 | Vercel |

## 二、开发方法论

本项目采用 **"Effective Harnesses for Long-Running Agents"** 方法论：

### 核心原则
1. **增量开发**：每个会话只完成一个功能
2. **端到端测试**：功能完成后必须验证通过才标记 `passes: true`
3. **清晰记录**：每完成一个功能，更新 `claude-progress.txt` 并 git commit
4. **功能列表驱动**：所有功能定义在 `feature_list.json`，不随意增删

### 每次会话流程
```
1. 读取 claude-progress.txt 了解进度
2. 读取 feature_list.json 获取下一个待开发功能
3. 开发功能
4. 端到端测试验证
5. 更新 feature_list.json (passes: true)
6. 更新 claude-progress.txt
7. Git commit
```

## 三、技术规范

### 3.1 目录结构
```
qiu-website/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── BlogList.astro
│   │   ├── Services.astro
│   │   ├── Cases.astro
│   │   ├── AIChat.astro
│   │   └── ContactForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       └── [...slug].astro
│   ├── content/
│   │   ├── blog/            # 博客Markdown文件
│   │   └── config.ts        # 内容集合配置
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   └── favicon.ico
├── tina/                    # TinaCMS配置
├── feature_list.json        # 功能列表
├── claude-progress.txt      # 开发进度日志
├── DEV_GUIDE.md             # 开发规范（本文档）
├── init.sh                  # 开发服务器启动脚本
└── package.json
```

### 3.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `Hero.astro`, `BlogCard.astro` |
| 页面文件 | lowercase/kebab-case | `index.astro`, `about.astro` |
| CSS类 | Tailwind优先，自定义用kebab-case | `class="hero-title"` |
| 变量/函数 | camelCase | `getBlogPosts()` |
| 常量 | UPPER_SNAKE_CASE | `PRIMARY_COLOR` |

### 3.3 响应式断点

```css
/* Tailwind默认断点 */
sm: 640px   /* 小屏手机 */
md: 768px   /* 平板竖屏 */
lg: 1024px  /* 平板横屏/小笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏桌面 */
```

移动优先原则：默认样式为移动端，使用 `md:` `lg:` 逐步增强。

### 3.4 色彩系统

```css
:root {
  --color-primary: #F59E0B;    /* 暖橙色 - 主色调 */
  --color-secondary: #10B981;  /* 浅草绿 - 辅助色 */
  --color-bg: #FFFBF5;         /* 浅米色背景 */
  --color-text: #1F2937;       /* 主文字 */
  --color-text-light: #6B7280; /* 次要文字 */
  --color-border: #E5E7EB;     /* 边框色 */
}
```

### 3.5 字体规范

```css
/* 优先使用系统字体，减少加载时间 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
  "Noto Sans SC", "Source Han Sans SC", sans-serif;
```

行高：1.5-1.8，确保可读性。

## 四、组件开发规范

### 4.1 组件模板

```astro
---
// src/components/Example.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = "" } = Astro.props;
---

<section class="py-12 md:py-16 lg:py-20">
  <div class="container mx-auto px-4">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
      {title}
    </h2>
    {description && <p class="mt-4 text-gray-600">{description}</p>}
  </div>
</section>
```

### 4.2 SEO规范

每个页面必须包含：
```astro
<BaseLayout
  title="页面标题 | 邱小亮"
  description="页面描述，包含核心关键词"
>
```

## 五、API集成规范

### 5.1 Dify AI咨询

```typescript
// 环境变量
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=app-xxxxx

// 请求示例
const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: userMessage,
    user: 'user-' + sessionId,
    conversation_id: conversationId
  })
});
```

### 5.2 Formspree表单

```html
<form action="https://formspree.io/f/{FORM_ID}" method="POST">
  <input type="text" name="name" required />
  <input type="tel" name="phone" required />
  <select name="service_type">
    <option value="ai">企业AI智能体部署</option>
    <option value="health">心脑血管健康管理</option>
    <option value="fusion">AI+大健康融合</option>
    <option value="other">其他</option>
  </select>
  <textarea name="message"></textarea>
  <!-- Honey pot 防刷 -->
  <input type="text" name="_gotcha" style="display:none" />
  <button type="submit">提交预约</button>
</form>
```

## 六、测试规范

### 6.1 功能测试检查清单

每个功能完成后需验证：

- [ ] PC端显示正常
- [ ] 移动端显示正常
- [ ] 交互功能正常（点击、滑动等）
- [ ] 无控制台错误
- [ ] 无明显性能问题

### 6.2 浏览器兼容性

必须测试：
- Chrome (最新版)
- Safari (最新版)
- Firefox (最新版)
- iOS Safari
- Android Chrome

## 七、Git提交规范

### 7.1 提交信息格式

```
<type>: <description>

[optional body]
```

### 7.2 Type类型

| Type | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | feat: 添加Hero组件 |
| fix | 修复bug | fix: 修复移动端导航菜单不关闭 |
| style | 样式调整 | style: 调整按钮间距 |
| refactor | 重构 | refactor: 重构表单验证逻辑 |
| docs | 文档 | docs: 更新开发规范 |
| chore | 杂项 | chore: 更新依赖 |

## 八、环境变量

```env
# .env.local (不提交到git)
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=your-dify-api-key
FORMSPREE_FORM_ID=your-form-id
```

## 九、性能目标

| 指标 | 目标值 |
|------|--------|
| 首屏加载时间 | ≤2秒 |
| Lighthouse性能分 | ≥85 |
| Lighthouse可访问性 | ≥90 |
| Lighthouse SEO | ≥95 |
| 图片格式 | WebP优先 |
| 图片懒加载 | 视口外图片全部懒加载 |

## 十、开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动TinaCMS编辑模式
npm run dev:tina

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码格式化
npm run format

# 类型检查
npm run typecheck
```

---

*最后更新: 2026-02-15*
