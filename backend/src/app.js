const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')

// 路由导入
const authRoutes = require('./routes/auth')
const holdingRoutes = require('./routes/holdings')
const analysisRoutes = require('./routes/analysis')
const stockDataRoutes = require('./routes/stockData')

// 中间件
const errorHandler = require('./middleware/errorHandler')

// 服务
const TaskScheduler = require('./services/taskScheduler')
const sequelize = require('./config/database')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件
app.use('/uploads', express.static('uploads'))

// API路由
app.use('/api/auth', authRoutes)
app.use('/api/holdings', holdingRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/stock-data', stockDataRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理中间件
app.use(errorHandler)

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('数据库连接成功')
    
    // 同步数据库模型
    await sequelize.sync({ force: false })
    console.log('数据库模型同步完成')
    
    // 启动定时任务
    TaskScheduler.init()
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`)
    })
  } catch (error) {
    console.error('服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()