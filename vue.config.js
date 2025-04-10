
const { defineConfig } = require('@vue/cli-service')
const {post, get} = require("axios");
module.exports = defineConfig({
      transpileDependencies: true,
      lintOnSave: false,// 关闭语法检查
      // 配置跨域支持
      devServer:{
        proxy: {
          '/api':{
            target:'http://localhost:8443',//跨域支持的端口
            changeOrihin: true,
            pathRewrite:{
              '^/api':''
            }
          }
        },
      }

    },

)
