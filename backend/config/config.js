require('dotenv').config()
const path = require('path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/revenue_monitor_dev.sqlite'),
    logging: console.log
  },
  test: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/revenue_monitor_test.sqlite'),
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/revenue_monitor.sqlite'),
    logging: false
  }
}