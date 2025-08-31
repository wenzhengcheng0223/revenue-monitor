const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const StockData = sequelize.define('StockData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '股票/基金代码'
  },
  name: {
    type: DataTypes.STRING(100),
    comment: '股票/基金名称'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '交易日期'
  },
  open: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '开盘价'
  },
  high: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '最高价'
  },
  low: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '最低价'
  },
  close: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '收盘价'
  },
  volume: {
    type: DataTypes.BIGINT,
    comment: '成交量'
  },
  amount: {
    type: DataTypes.DECIMAL(20, 2),
    comment: '成交额'
  },
  changePercent: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '涨跌幅'
  },
  changeAmount: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '涨跌额'
  },
  turnoverRate: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '换手率'
  },
  pe: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '市盈率'
  },
  pb: {
    type: DataTypes.DECIMAL(10, 4),
    comment: '市净率'
  }
}, {
  tableName: 'stock_data',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code', 'date']
    },
    {
      fields: ['code']
    },
    {
      fields: ['date']
    }
  ]
})

module.exports = StockData