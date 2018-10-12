//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px'
  },
  login: function(e) {
    const that = this;
    app.getCode().then(function(value) {
      let code = value.code;
      app.getUserInfo().then(function(value) {
        // console.log('code是'+ code);
        // console.log('encrypt_data是' + value.encryptedData);
        // console.log('iv是' + value.iv);
        wx.setStorageSync('userInfo', value.rawData);
        wx.request({
          url: config.service.loginUrl,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
          data: {
            code: code,
            encrypt_data: value.encryptedData,
            iv: value.iv
          },
          success: function(res) {
            console.log(res);
            if (res.data.error_code === 0) {
              wx.setStorageSync('token', res.data.token);
              wx.reLaunch({
                url: '../details/details'
              })
            } else {
              util.showModel('登录失败', res.data.error_code.toString())
            }
          },
          fail:function(err){
            util.showModel('登录失败', JSON.stringify(err))
          }
        })
      })
    })
  }
})