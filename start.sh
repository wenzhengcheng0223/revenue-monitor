#!/bin/bash

# 启动说明
echo "正在启动股票基金收益监控系统..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 请先安装 Node.js"
    exit 1
fi

# 检查 SQLite3 是否安装
if ! command -v sqlite3 &> /dev/null; then
    echo "警告: 未检测到 SQLite3，将使用内置的 SQLite 支持"
fi

# 创建 .env 文件（如果不存在）
if [ ! -f backend/.env ]; then
    echo "创建后端环境配置文件..."
    cp backend/.env.example backend/.env
fi

# 安装依赖
echo "安装前端依赖..."
cd frontend && npm install

echo "安装后端依赖..."
cd ../backend && npm install

# 初始化数据库
echo "初始化数据库..."
if [ ! -f database/revenue_monitor_dev.sqlite ]; then
    node init-database.js
else
    echo "数据库已存在，跳过初始化"
fi

# 启动后端服务
echo "启动后端服务..."
npm run dev &
BACKEND_PID=$!

# 等待后端服务启动
sleep 3

# 启动前端服务
echo "启动前端服务..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "系统启动完成！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待中断信号
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 保持脚本运行
wait