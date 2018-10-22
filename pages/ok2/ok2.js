//ready.js
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    allNum: '',
    src: null,
    storeName:'',
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px'
  },
  onLoad: function(options) {
    const that = this;
    console.log(options);
    this.scanning(options.encrypt_data);
  },
  btnYes: function() {
    wx.reLaunch({
      url: '../details/details'
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  err:function(){
    wx.navigateTo({
      url: '../errer/errer'
    })
  },
  scanning: function (data) {  
    const that = this;
    wx.request({
      url: config.service.scanning,
      method: 'POST',
      data: {
        encrypt_data: decodeURIComponent(data)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res);
        wx.setStorageSync('result',JSON.stringify(res.data));
        if (res.data.error_code === 0){
          util.showModel('累计成功');
          that.setData({
            storeName: res.data.store_name,
            allNum: res.data.count + '根',
            src: 'data:image/png;base64,' + res.data.image
          })
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else if (res.data.error_code === 2001) {
          util.showModel('失败', '此二维码已被扫描');
        }else{
          util.showModel('失败', res.data.error_code.toString()); 
        }
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "request:fail timeout") {
          util.showModel('失败', '请求超时,请稍后再试');
        } else {
          util.showModel('失败', JSON.stringify(err));
        } 
      }
    })
  }
})