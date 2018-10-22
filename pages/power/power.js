//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px'
  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      const that = this;
      app.getCode().then(function (value) {
        let code = value.code;
        app.getUserInfo().then(function (value) {
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
            success: function (res) {
              console.log(res);
              if (res.data.error_code === 0) {
                wx.setStorageSync('token', res.data.token);
                wx.reLaunch({
                  url: '../details/details'
                })
                console.log("token是" + res.data.token)
              } else {
                util.showModel('登录失败', res.data.error_code.toString());
              }
            },
            fail: function (err) {
              if (err.errMsg === "request:fail timeout") {
                util.showModel('登录失败', '请求超时,请稍后再试');
              } else {
                util.showModel('登录失败', JSON.stringify(err));
              } 
            }
          })
        })
      })
      
    } else {
      //用户按了拒绝按钮
    }
  }
})