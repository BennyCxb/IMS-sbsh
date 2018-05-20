'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://tzsgyc.iok.la:47521/api/"'
  // API_ROOT: '"http://tzsgyc.com/api/"'
})
