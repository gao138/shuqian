//ready.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    leftOverNum:0,
    mineTopImg:null
  },
  onLoad: function(options) {
    this.getUserInfo();
    this.getTimes();
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  getUserInfo:function(){
    const userInfo = JSON.parse(wx.getStorageSync('userInfo'));
    console.log(userInfo);
    this.setData({
      mineTopImg: userInfo.avatarUrl,
      mineName: userInfo.nickName
    })
  },
  getTimes: function () {
    const that = this;
    wx.request({
      url: config.service.getTimes,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res);
        if (res.data.error_code === 0) {
          that.setData({
            leftOverNum: 7 - res.data.day_times <= 0 ? 0 : 7 - res.data.day_times
          })
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else{
          util.showModel('失败', res.data.error_code.toString());
        }      
      },
      fail: function (err) {
        util.showModel('失败', JSON.stringify(err));
      }
    })
  },
  onShareAppMessage() {
    return {
      title: 'AI数签',
      path: 'pages/details/details',
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },
  handleTapShareButton() {
    if (!((typeof wx.canIUse === 'function') && wx.canIUse('button.open-type.share'))) {
      wx.showModal({
        title: '当前版本不支持转发按钮',
        content: '请升级至最新版本微信客户端',
        showCancel: false
      })
    }
  }
})