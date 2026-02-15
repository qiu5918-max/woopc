import { defineConfig } from 'tinacms';

export default defineConfig({
  clientId: process.env.TINA_CLIENT_ID || '',
  branch: process.env.TINA_BRANCH || 'main',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: '博客文章',
        path: 'src/content/blog',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: '标题',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: '摘要',
            required: true,
          },
          {
            type: 'datetime',
            name: 'pubDate',
            label: '发布日期',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: '分类',
            options: [
              { value: 'ai-enterprise', label: '企业AI智能体实施落地' },
              { value: 'health-cardiovascular', label: '心脑血管健康数字化管理' },
              { value: 'ai-health-fusion', label: 'AI+心脑血管健康融合实践' },
            ],
            required: true,
          },
          {
            type: 'image',
            name: 'image',
            label: '封面图',
          },
          {
            type: 'string',
            name: 'tags',
            label: '标签',
            list: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: '正文',
            isBody: true,
          },
        ],
      },
      {
        name: 'cases',
        label: '案例成果',
        path: 'src/content/cases',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: '案例标题',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: '分类',
            options: [
              { value: 'ai-enterprise', label: '企业AI智能体实施落地' },
              { value: 'health-cardiovascular', label: '心脑血管健康数字化管理' },
              { value: 'ai-health-fusion', label: 'AI+心脑血管健康融合实践' },
            ],
            required: true,
          },
          {
            type: 'string',
            name: 'background',
            label: '项目背景',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'approach',
            label: '核心做法',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'result',
            label: '落地结果',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: '详细内容',
            isBody: true,
          },
        ],
      },
      {
        name: 'services',
        label: '服务',
        path: 'src/content/services',
        format: 'mdx',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: '服务名称',
            required: true,
          },
          {
            type: 'string',
            name: 'target',
            label: '服务对象',
          },
          {
            type: 'string',
            name: 'value',
            label: '核心价值',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: '详细内容',
            isBody: true,
          },
        ],
      },
    ],
  },
});
