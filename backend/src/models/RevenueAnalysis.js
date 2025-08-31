const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const RevenueAnalysis = sequelize.define('RevenueAnalysis', {
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
  holdingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'holdings',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '分析日期'
  },
  dailyReturn: {
    type: DataTypes.DECIMAL(10, 6),
    comment: '日收益率'
  },
  cumulativeReturn: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '累计收益率'
  },
  maxDrawdown: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '最大回撤'
  },
  volatility: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '波动率'
  },
  sharpeRatio: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '夏普比率'
  },
  totalValue: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '总市值'
  },
  totalProfit: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '总盈亏'
  },
  totalCost: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '总成本'
  }
}, {
  tableName: 'revenue_analysis',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'date']
    },
    {
      fields: ['holdingId']
    },
    {
      fields: ['date']
    }
  ]
})

module.exports = RevenueAnalysis