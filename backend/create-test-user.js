const sequelize = require('./src/config/database')
const { User } = require('./src/models')
const bcrypt = require('bcryptjs')

async function createTestUser() {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('数据库连接成功')

    // 检查是否已存在用户
    const existingUser = await User.findOne({ where: { email: 'admin@test.com' } })
    if (existingUser) {
      console.log('用户已存在')
      return
    }

    // 创建测试用户
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123456', salt)

    const user = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    })

    console.log('测试用户创建成功:', {
      id: user.id,
      username: user.username,
      email: user.email
    })

  } catch (error) {
    console.error('创建用户失败:', error)
  } finally {
    await sequelize.close()
  }
}

createTestUser()