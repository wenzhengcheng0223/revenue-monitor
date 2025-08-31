@echo off
echo 正在启动股票基金收益监控系统...

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 请先安装 Node.js
    pause
    exit /b 1
)

REM 创建 .env 文件（如果不存在）
if not exist "backend\.env" (
    echo 创建后端环境配置文件...
    copy "backend\.env.example" "backend\.env"
)

REM 安装依赖
echo 安装前端依赖...
cd frontend && npm install

echo 安装后端依赖...
cd ..\backend && npm install

REM 初始化数据库
echo 初始化数据库...
if not exist "database\revenue_monitor_dev.sqlite" (
    node init-database.js
) else (
    echo 数据库已存在，跳过初始化
)

REM 启动后端服务
echo 启动后端服务...
start "Backend Server" cmd /k npm run dev

REM 等待后端服务启动
timeout /t 3 /nobreak >nul

REM 启动前端服务
echo 启动前端服务...
cd ..\frontend
start "Frontend Server" cmd /k npm run dev

echo 系统启动完成！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8080
echo.
echo 按任意键关闭此窗口...
pause >nul