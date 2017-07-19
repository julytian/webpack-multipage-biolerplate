var path = require('path')
var utils = require('./utils')
var config = require('../config')
var glob = require('glob')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// 获得入口js文件
var entries = utils.getEntry('./src/module/**/*.js');

module.exports = {
    entry: entries,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': resolve('src')
        }
    },
    module: {
        rules: [{ // 对src和test文件夹下的.js文件使用babel-loader
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        },
        { // 对图片资源文件使用url-loader，query.name指明了输出的命名规则
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        },
        {
            test: /\.html$/,
            use: [{
                loader: 'html-loader?attrs[]=img:src&attrs[]=img:data-src'
            }]
        }
        ]
    }
}