//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    errList: [{
      id: '000',
      cont: '识别多了'
    }, {
      id: '001',
      cont: '识别少了'
    }, {
      id: '002',
      cont: '其他'
    }],
    submitCont:null,
    
  },
  onLoad: function (options){
    this.setData({
      unique_id: JSON.parse(wx.getStorageSync("result")).request_id || ''
    })
  },
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  errTypeClick:function(event){
    this.setData({
      submitCont: event.currentTarget.dataset.errcont.cont
    })
  },
  changInput:function(evevt){
    console.log(evevt.detail.value);
  },
  regerror: function() {
    if (!this.data.submitCont){
      util.showModel('请选择出现的错误');
      return;
    }
    wx.request({
      url: config.service.regerror,
      method: 'POST',
      data: {
        error_msg: this.data.submitCont,
        unique_id: this.data.unique_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      success: function(res) {
        console.log(res);
        if (res.data.error_code === 0){
          wx.reLaunch({
            url: '../details/details'
          })
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        }else{
          util.showModel('提交失败', res.data.error_code.toString());
        }
      },
      fail: function(err) {
        console.log(err);
        if (err.errMsg === "request:fail timeout") {
          util.showModel('提交失败', '请求超时,请稍后再试');
        } else {
          util.showModel('提交失败', JSON.stringify(err));
        } 
      }
    })
  }
})