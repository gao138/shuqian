//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    hisList:null
  },
  onLoad:function(){
    this.gethisList();
  },
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  gethisList:function(){
    const that = this;
    wx.request({
      url: config.service.gethisUrl,
      method:'GET',
      data:{
        start_date: Math.round(new Date().getTime() / 1000)
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      success:function(res){
        console.log(res);
        if (res.data.error_code === 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].updated = res.data.list[i].updated.substring(0, 16);
          };
          that.setData({
            hisList: res.data.list
          })
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          util.showModel('失败', res.data.error_code.toString());
        }    
      },
      fail:function(err){
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