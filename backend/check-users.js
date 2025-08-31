const sequelize = require('./src/config/database')
const { User } = require('./src/models')

async function checkUsers() {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('数据库连接成功')

    // 查询所有用户
    const users = await User.findAll()
    console.log('现有用户:', users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role
    })))

  } catch (error) {
    console.error('查询用户失败:', error)
  } finally {
    await sequelize.close()
  }
}

checkUsers()