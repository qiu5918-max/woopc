#!/bin/bash

# 邱小亮个人网站 - 开发服务器启动脚本

echo "🚀 启动邱小亮个人网站开发服务器..."

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动Astro开发服务器..."
npm run dev
