const User = require('./User')
const Holding = require('./Holding')
const StockData = require('./StockData')
const RevenueAnalysis = require('./RevenueAnalysis')
const UserConfig = require('./UserConfig')

// 定义模型关联关系
User.hasMany(Holding, { foreignKey: 'userId' })
Holding.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(RevenueAnalysis, { foreignKey: 'userId' })
RevenueAnalysis.belongsTo(User, { foreignKey: 'userId' })

Holding.hasMany(RevenueAnalysis, { foreignKey: 'holdingId' })
RevenueAnalysis.belongsTo(Holding, { foreignKey: 'holdingId' })

StockData.hasMany(RevenueAnalysis, { 
  foreignKey: 'code',
  sourceKey: 'code',
  constraints: false
})

User.hasMany(UserConfig, { foreignKey: 'userId' })
UserConfig.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
  User,
  Holding,
  StockData,
  RevenueAnalysis,
  UserConfig
}