// W3C compliant EventSource client for Node.js and browser (polyfill)
require('eventsource-polyfill')

// 热重载中间件
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})