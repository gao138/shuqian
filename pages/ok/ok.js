//ready.js
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    allNum: 0,
    src: null,
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px'
  },
  onLoad: function(options) {
    const that = this;
    const data = JSON.parse(options.data)
    data.image = decodeURIComponent(data.image)
    this.setData({
      src: 'data:image/png;base64,' + data.image,
      allNum: data.count
    })
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
  }
})