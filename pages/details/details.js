//details.js
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    flashLamp: 'off',
    flashType: './image/icon_shanguangdengxq@3x.png',
    leftOverNum: 0
  },
  onLoad: function(options) {
    
  },
  onShow: function() {

  },
  toMine: function() {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  error(e) {
    console.log(e.detail)
  },
  // 拍照
  takePhoto() {
    // 打开摄像头
    this.ctx = wx.createCameraContext();
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res);
        wx.navigateTo({
          url: '../ready/ready?tempImagePath=' + encodeURIComponent(res.tempImagePath)
        })
        // this.setData({
        //   src: res.tempImagePath
        // })
      }
    })
  },
  scanCode: function() {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '../ok2/ok2?encrypt_data=' + encodeURIComponent(res.result)
        })
      }
    })
  },
  modalTap: function() {
    util.showModel('照片不符合要求', '');
  },
  flashBtn: function() {
    if (this.data.flashLamp === 'on') {
      this.setData({
        flashLamp: 'off',
        flashType: './image/icon_shanguangdengxq@3x.png'
      })
    } else {
      this.setData({
        flashLamp: 'on',
        flashType: './image/icon_sgdyxq@3x.png'
      })
    }
  }
})