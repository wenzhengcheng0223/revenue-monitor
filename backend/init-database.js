const sequelize = require('./src/config/database')
const { User, Holding, StockData, RevenueAnalysis, UserConfig } = require('./src/models')
const bcrypt = require('bcryptjs')

async function initDatabase() {
  try {
    console.log('开始初始化数据库...')
    
    // 同步所有模型
    await sequelize.sync({ force: true })
    console.log('数据库表创建成功')
    
    // 创建默认管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    })
    console.log('默认管理员用户创建成功 (用户名: admin, 密码: admin123)')
    
    // 创建测试用户
    const testPassword = await bcrypt.hash('test123', 10)
    const testUser = await User.create({
      username: 'test',
      email: 'test@example.com',
      password: testPassword,
      role: 'user'
    })
    console.log('测试用户创建成功 (用户名: test, 密码: test123)')
    
    // 创建测试持仓数据
    await Holding.bulkCreate([
      {
        userId: testUser.id,
        code: '000001',
        name: '平安银行',
        type: 'stock',
        quantity: 1000,
        costPrice: 12.50,
        currentPrice: 13.20,
        marketValue: 13200,
        profit: 700,
        profitRate: 5.6,
        group: '银行股'
      },
      {
        userId: testUser.id,
        code: '000002',
        name: '万科A',
        type: 'stock',
        quantity: 500,
        costPrice: 28.00,
        currentPrice: 26.50,
        marketValue: 13250,
        profit: -750,
        profitRate: -2.68,
        group: '地产股'
      },
      {
        userId: testUser.id,
        code: '110011',
        name: '易方达中小盘',
        type: 'fund',
        quantity: 10000,
        costPrice: 3.50,
        currentPrice: 3.85,
        marketValue: 38500,
        profit: 3500,
        profitRate: 10,
        group: '基金'
      }
    ])
    console.log('测试持仓数据创建成功')
    
    console.log('数据库初始化完成！')
    process.exit(0)
  } catch (error) {
    console.error('数据库初始化失败:', error)
    process.exit(1)
  }
}

initDatabase()