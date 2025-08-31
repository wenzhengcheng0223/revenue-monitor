# 股票基金收益监控系统

一个基于 Vue 3 + Node.js 的股票基金收益监控平台，支持动态添加持仓、多维度收益分析和可视化展示。

## 功能特性

- 动态持仓管理（添加、编辑、删除）
- 实时收益监控（日、5日、15日、30日等维度）
- 可视化图表展示
- 持仓分组管理
- Excel 批量导入
- 响应式设计（PC/移动端适配）

## 技术栈

### 前端
- Vue 3
- Vite
- Tailwind CSS
- Pinia
- ECharts

### 后端
- Node.js
- Express
- SQLite
- Sequelize
- JWT

## 项目结构

```
revenue-monitor/
├── frontend/     # 前端项目
├── backend/      # 后端项目
└── README.md
```

## 快速开始

### 前提条件
- Node.js 16+
- npm 或 yarn

### 初始化项目

1. 克隆项目（如果需要）
2. 安装依赖：
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

3. 初始化数据库：
```bash
cd backend
node init-database.js
```

4. 启动服务：

**方式一：使用启动脚本**
- Windows: 双击运行 `start.bat`
- Linux/Mac: 运行 `bash start.sh`

**方式二：手动启动**
```bash
# 启动后端服务
cd backend
npm run dev

# 新终端窗口，启动前端服务
cd frontend
npm run dev
```

5. 访问应用：
- 前端地址: http://localhost:3000
- 后端API: http://localhost:8080

### 默认账户
- 管理员账户: admin / admin123
- 测试账户: test / test123

## 开发进度

- [x] 项目初始化
- [ ] 后端API开发
- [ ] 前端页面开发
- [ ] 数据可视化
- [ ] 数据集成
- [ ] 测试与优化