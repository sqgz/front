
const { defineConfig } = require('@vue/cli-service')
const {post, get} = require("axios");
module.exports = defineConfig({
      transpileDependencies: true,
      lintOnSave: false,// �ر��﷨���
      // ���ÿ���֧��
      devServer:{
        proxy: {
          '/api':{
            target:'http://localhost:8443',//����֧�ֵĶ˿�
            changeOrihin: true,
            pathRewrite:{
              '^/api':''
            }
          }
        },
      }

    },

)
