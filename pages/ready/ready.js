//ready.js
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    isok:false
  },
  onLoad: function(options) {
    const ctx = wx.createCanvasContext('cover-preview');
    const that = this;
    console.log(options);
    this.promise1(options.tempImagePath)
      .then(function(res) {
        let query = wx.createSelectorQuery();
        let imageWidth = res.width;
        let imageHeght = res.height;
        query.select('.boxImg').boundingClientRect(function(rect) {
          // console.log(rect.width)
          // console.log(rect.height)
          let scalex = imageWidth / wx.getSystemInfoSync().windowWidth;
          let sx = (imageWidth - rect.width * scalex) / 2;
          let sy = (imageHeght - rect.height * scalex) / 2;
          ctx.drawImage(res.path, sx, sy, rect.width * scalex, rect.height * scalex,0,0,684,684);
          ctx.beginPath();
          // ctx.arc(684 / 2, 684 / 2, rect.width * scalex-32, 0, 2 * Math.PI);
          // ctx.setFillStyle('rgba(0,0,0,0.1)');
          // ctx.fill();
          ctx.draw(false, function(e) {
            wx.canvasToTempFilePath({
              quality: 1,
              canvasId: 'cover-preview',
              fileType:'jpg',
              destWidth: 684,
              destHeight: 684,
              success: function(res) {
                //res.tempFilePath即为生成的图片路径
                console.log(res.tempFilePath)
                const FileSystemManager = wx.getFileSystemManager();
                const base64 = FileSystemManager.readFileSync(res.tempFilePath, 'base64');
                // console.log(base64);
                that.setData({
                  // src: options.tempImagePath
                  src: res.tempFilePath,
                  srcBase64: base64
                })
              }
            })
          })
        }).exec();
      })
  },
  getTimesPromise: function () {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: config.service.getTimes,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': wx.getStorageSync("token")
        },
        success: function (res) {
          console.log(res);   
          resolve(res);    
        },
        fail: function (err) {
          console.log(err);
          reject(err);
        }
      })
    })
  },
  btnYes: function() {
    if(this.data.isok){
        return;
    };
    this.setData({
      isok:true
    });
    this.getTimesPromise().then(res => {
      if (res.data.error_code === 0){
        if (7 - res.data.day_times <= 0) {
          console.log(res)
          this.setData({
            isok: false
          });
          util.showModel('超每日次数', '')
        } else{
          this.up();
        }
      }     
    }).catch(err => {
      console.log(err);
      if (err.errMsg === "request:fail timeout") {
        util.showModel('上传图片失败', '请求超时,请稍后再试');
      } else {
        util.showModel('上传图片失败', JSON.stringify(err));
      } 
      
    })
  },
  up:function(){
    util.showBusy('正在上传')
    var that = this;
    // 上传图片
    wx.request({
      url: config.service.uploadUrl,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      data: {
        start_date: Math.round(new Date().getTime() / 1000),
        image: this.data.srcBase64
      },
      success: function (res) {
        // util.showSuccess('上传图片成功')
        wx.setStorageSync('result', JSON.stringify(res.data));
        if (res.data.error_code === 0) {
          console.log("success");
          console.log(res.data);
          that.setData({
            isok: false
          });
          res.data.image = encodeURIComponent(res.data.image)
          const dataStr = JSON.stringify(res.data);
          wx.navigateTo({
            url: '../ok/ok?data=' + dataStr
          })
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        }
        else if (res.data.error_code === 1007) {
          util.showModel('上传图片失败', '内部错误')
        } else if (res.data.error_code === 1701) {
          util.showModel('上传图片失败', '内部算法错误')
        } else {
          util.showModel('上传图片失败', res.data.error_code.toString())
          console.log("fail");
          console.log(res.data);
        }
      },
      fail: function (err) {
        if (err.errMsg === "request:fail timeout") {
          util.showModel('上传图片失败', '请求超时,请稍后再试');
        } else {
          util.showModel('上传图片失败', JSON.stringify(err));
        } 
        console.log(err);
      }
    })
  },
  promise1: function(src) {
    return new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: decodeURIComponent(src) || '',
        success: function(res) {
          console.log(res)
          resolve(res);
        }
      })
    })
  },
  btnNo: function() {
    console.log("取消");
    wx.navigateBack({
      delta: 1
    })
  }

})