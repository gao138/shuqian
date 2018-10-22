//app.js
var config = require('./config')
var util = require('./utils/util.js')
App({
  onLaunch: function() {
    util.showBusy('加载中');
    const that = this;
    this.getCode().then(function (value) {
      let code = value.code;
      that.getUserInfo().then(function (value) {
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
              wx.hideToast();
              console.log("token是" + res.data.token)
            } else {
              util.showModel('登录失败', res.data.error_code.toString());
            }
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "request:fail timeout"){
              util.showModel('登录失败', '请求超时,请稍后再试');
            }else{
              util.showModel('登录失败', '连接错误，请稍后重试');
            }           
          }
        })
      }).catch(function (err) {
        console.log(err);
        util.showModel('登录失败', '');
      });
    }).catch(function (err) {
      console.log(err);
      util.showModel('登录失败', '');
    });
  },
  onShow: function (options) {
    // Do something when show.
  },
  getCode: function() {
    return new Promise(function(resolve, reject) {
      // 登录
      wx.login({
        success: function(res) {
          resolve(res);
        },
        fail: function(err) {
          reject(err);
        }
      })
    })
  },
  getUserInfo:function(){
    return new Promise(function (resolve, reject) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                resolve(res);
              },
              fail:err => {
                reject(err);
              },
            })
          }else{
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，勾选用户信息并点击确定。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.reLaunch({
                    url: '../power/power'
                  })
                }
              }
            })
          }
        },
        fail:err => {
          reject(err);
        }
      })
    })
  },
  globalData: {
    code: null,
    userInfo: null
  }
})