//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
var wxCharts = require('../../utils/wx-chart.js')
import * as echarts from '../../ec-canvas/echarts';

var lineChart = null;
var storeAllData = null;

let chart = null;
let legendData = null;
let xAxisData = null;
let yAxisMax = null;
let seriesData = null;
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: ''
    },
    tooltip: {},
    legend: {
      data: legendData
    },
    xAxis: {
      data: xAxisData,
    },
    yAxis: {
      min:0,
      max: yAxisMax,
      splitLine: {
        show: false
      },
    },
    series: [{
      name: '',
      type: 'bar',
      barWidth: 20,
      data: seriesData,
      itemStyle: {
        normal: {
          barBorderRadius: [10, 10, 0, 0],
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: { //数值样式
              color: '#2f2f2f',
              fontSize: 16
            }
          },
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1, [{
                offset: 0,
              color: '#07aaeb'
              },
              {
                offset: 1,
                color: '#21ce98'
              }
            ]
          )
        },
        emphasis: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1, [{
                offset: 0,
                color: '#2FDECA'
              },
              {
                offset: 1,
                color: '#2FDE80'
              }
            ]
          )
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}
Page({
  data: {
    marginTop: wx.getSystemInfoSync().statusBarHeight + 'px',
    open: false,
    selected: '全部',
    down_up: './image/icon_mofenxq@3x.png',
    storeArr: [],
    allNum: 0,
    ec: {
      onInit: initChart
    }
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
        if (res.data.error_code === 0) {
          that.setData({
            storeArr: res.data.list,
          })
          storeAllData = res.data.list;
          // that.changeData(storeAllData);
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          util.showModel('失败', res.data.toString());
        }
        console.log(res);
      },
      fail: function(err) {
        console.log(err);
        util.showModel('失败', JSON.stringify(err));
      }
    })
  },
  changeData: function(data) {
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
  putDown: function(chartData) {
    xAxisData = chartData.categories;
    yAxisMax = chartData.max * 3 /2;
    seriesData = chartData.data;
    this.setData({
      ec: {
        onInit: initChart
      }
    })
    console.log(chartData);
  },
  storeAll: function() {

  },
  storeOne: function(event) {
    // console.log(event.currentTarget.dataset.store.store_id);
    this.showitem();
    let storeIdList = event.currentTarget.dataset.store.store_id;
    var thisStoreData = [];
    // console.log(storeAllData);
    for (var i = 0; i < storeAllData.length; i++) {
      if (storeIdList === storeAllData[i].store_id) {
        thisStoreData[0] = storeAllData[i];
      }
    }
    this.changeData(thisStoreData);
  },
})