var path = require('path')
var glob = require('glob')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var ImageminPlugin = require('imagemin-webpack-plugin').default


var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        // 编译输出目录
        path: config.build.assetsRoot,
        // 编译输出文件名格式
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // 没有指定输出名的文件输出的文件名格式
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // 丑化压缩代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        //  抽离css文件
        // 用于从webpack生成的bundle中提取文本到特定文件中的插件
        // 可以抽取出css，js文件将其与webpack输出的bundle分离
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }]),
        // 压缩图片
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production', // Disable during development 
            pngquant: {
                quality: '80-90'
            }
        })
    ]
})

// gzip模式下需要引入compression插件进行压缩
if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

// 配置查看文件大小树状图
if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

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
        chunksSortMode: 'dependency', // 按顺序插入
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [pathname, "vendor", "manifest"],
        // chunks: [pathname, "vendor", "manifest"],
        // Allows you to skip some chunks (e.g. don't add the unit-test chunk)
        // excludeChunks: Object.keys(pages).filter(function(name) {
        //     return name != pathname
        // })
    }

    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackConfig