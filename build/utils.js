var path = require('path')
var glob = require('glob')
var config = require('../config')
// 提取css样式到一个共同文件
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// 静态资源路径
exports.assetsPath = function (_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

// css loaders
exports.cssLoaders = function (options) {
    options = options || {}

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        var loaders = [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        // 如果是vuejs则使用 fallback: 'vue-style-loader'
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'style-loader'
            })
        } else {
            return ['style-loader'].concat(loaders)
        }
    }

    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    var output = []
    var loaders = exports.cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}



/*
 * @param {Object} globPath 目录路径及文件类型参数
 * { 'module/article': './src/module/article/article.js',
  'module/router.config': './src/module/article/router.config.js',
  'module/index': './src/module/index/index.js' }
  article
[ 'module', 'article', 'article.js' ]
router.config
[ 'module', 'article', 'router.config.js' ]
index
[ 'module', 'index', 'index.js' ]
 */
// 多入口配置,获取入口路径
exports.getEntry = function (globPath) {
    var entries = {},
        basename, tmp, pathname;

    //通过glob.sync方法获取指定的入口文件
    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // 输出js和html的路径
        pathname = tmp.splice(0, 1) + '/' + basename;
        entries[pathname] = entry;
    });
    return entries;
}