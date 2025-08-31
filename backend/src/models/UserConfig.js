const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const UserConfig = sequelize.define('UserConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '配置键'
  },
  value: {
    type: DataTypes.TEXT,
    comment: '配置值'
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
    defaultValue: 'string'
  },
  description: {
    type: DataTypes.STRING(255),
    comment: '配置描述'
  }
}, {
  tableName: 'user_configs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'key']
    }
  ]
})

module.exports = UserConfig