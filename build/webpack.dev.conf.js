var glob = require('glob')
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    // 配置样式文件的处理规则，使用styleLoaders
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
})


// 多入口配置
var pages = utils.getEntry('./src/module/**/*.html');
for (var pathname in pages) {
    var conf = {
            filename: pathname.substr(pathname.lastIndexOf('/') + 1) + '.html',
            template: 'html-withimg-loader!' + pages[pathname], // html中直接使用img标签src加载图片,模板路径
            minify: { //传递 html-minifier 选项给 minify 输出
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            inject: true, // js插入位置
            // 每个html引用的js模块，也可以在这里加上vendor等公用模块
            chunks: [pathname, "vendor", "manifest"]
        }
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}