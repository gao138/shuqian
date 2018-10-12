//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
var wxCharts = require('../../utils/wx-chart.js')

var lineChart = null;
var storeAllData = null;
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    open: false,
    selected: '全部',
    down_up: './image/icon_mofenxq@3x.png',
    storeArr:[],
    allNum:0
  },
  onLoad: function() {
    this.getstore();
    // this.gethisList();
  },
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  showitem: function() {
    this.setData({
      open: !this.data.open
    })
    if (this.data.open) {
      this.setData({
        down_up: './image/icon_xialaxq@3x.png'
      })
    } else {
      this.setData({
        down_up: './image/icon_mofenxq@3x.png'
      })
    }
  },
  getstore: function(data) {
    const that = this;
    wx.request({
      url: config.service.getstoreUrl,
      method: 'GET',
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("token")
      },
      success: function(res) {
        if (res.data.error_code === 0){
          that.setData({
            storeArr:res.data.list,
          })
          storeAllData = res.data.list;
          that.changeData(storeAllData);
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        }else{
          util.showModel('失败',res.data.toString());
        }
        console.log(res);
      },
      fail: function(err) {
        console.log(err);
        util.showModel('失败', JSON.stringify(err));
      }
    })
  },
  changeData:function(data){
    // console.log(data);
    var chartData = {};
    var severData = [];
    var categories = [];
    var allNum = 0;
    for (var i = 0; i < data.length; i++) {
      severData[i] = data[i].times;
      categories[i] = data[i].store_name;
      allNum += data[i].times;
    }
    this.setData({
      allNum: allNum
    });
    chartData.data = severData;
    chartData.allNum = allNum;
    chartData.categories = categories;
    chartData.max = Math.max.apply(null, severData);
    this.putDown(chartData);
  },
  putDown: function (chartData){
    var windowWidth = '',
      windowHeight = ''; //定义宽高
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#myCanvas').boundingClientRect().exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      windowWidth = res[0].width;
      windowHeight = res[0].height;
      lineChart = new wxCharts({ //定义一个wxCharts图表实例
        canvasId: 'lineCanvas', //输入wxml中canvas的id
        type: 'column', //图标展示的类型有:'line','pie','column','area','ring','radar'
        categories: chartData.categories, //模拟的x轴横坐标参数
        animation: true, //是否开启动画
        legend: false,
        series: [{
          name: '数量',
          color: '#fff',
          data: chartData.data,
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: { //是否隐藏x轴分割线
          // ddisableGrid: false,
          type: 'calibration',
          gridColor: '#7cb5ec'
        },
        yAxis: { //y轴数据
          // title: '数值', //标题
          disabled: true, //不绘制Y轴
          format: function (val) { //返回数值
            return val.toFixed(2);
          },
          min: 0, //最小值
          max: chartData.max * 3 / 2, //最大值
          gridColor: '#6fc4fb', //Y轴网格颜色                 
        },
        width: windowWidth, //图表展示内容宽度
        height: windowHeight, //图表展示内容高度
        dataLabel: true, //是否在图表上直接显示数据
        dataPointShape: true, //是否在图标上显示数据点标志
      });
      lineChart.config.padding = 7;
      lineChart.config.dataPointShape = ["circle", "diamond", "triangle", "rect"];
    });
  },
  storeAll:function(){
    this.showitem();
    this.changeData(storeAllData);
  },
  storeOne: function (event){
    // console.log(event.currentTarget.dataset.store.store_id);
    this.showitem();
    let storeIdList = event.currentTarget.dataset.store.store_id;
    var thisStoreData = [];
    // console.log(storeAllData);
    for (var i = 0; i < storeAllData.length; i++) {
      if (storeIdList === storeAllData[i].store_id){
        thisStoreData[0] = storeAllData[i];
      }
    }
    this.changeData(thisStoreData);
  },
})