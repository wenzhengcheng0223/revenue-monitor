const sequelize = require('./src/config/database')
const { User } = require('./src/models')
const bcrypt = require('bcryptjs')

async function updatePassword() {
  try {
    // 测试数据库连接
    await sequelize.authenticate()
    console.log('数据库连接成功')

    // 查找用户
    const user = await User.findOne({ where: { email: 'admin@example.com' } })
    if (!user) {
      console.log('用户不存在')
      return
    }

    // 更新密码
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123456', salt)

    await user.update({ password: hashedPassword })
    console.log('密码更新成功')

  } catch (error) {
    console.error('更新密码失败:', error)
  } finally {
    await sequelize.close()
  }
}

updatePassword()