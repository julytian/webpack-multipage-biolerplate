# webpack3-multipage-biolerplate

> A webpack3-multipage-biolerplate project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 修改配置文件
 如果修改 `src` 的 `module` 名字 需要修改以下配置

 build/utils.js  getEntry()
 build/webpack.base.js  设置入口js文件
 build/webpack.conf.js  多入口配置
 build/webpack.prod.js  多入口配置

```