const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Holding = sequelize.define('Holding', {
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
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '股票/基金代码'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '股票/基金名称'
  },
  type: {
    type: DataTypes.ENUM('stock', 'fund'),
    allowNull: false,
    defaultValue: 'stock'
  },
  quantity: {
    type: DataTypes.DECIMAL(20, 4),
    allowNull: false,
    comment: '持有数量'
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    comment: '成本价'
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '当前价格'
  },
  marketValue: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '市值'
  },
  profit: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '盈亏金额'
  },
  profitRate: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '盈亏比例'
  },
  group: {
    type: DataTypes.STRING(50),
    comment: '分组名称'
  },
  note: {
    type: DataTypes.TEXT,
    comment: '备注'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'holdings',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['code']
    }
  ]
})

module.exports = Holding