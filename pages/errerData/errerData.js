//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

import * as echarts from '../../ec-canvas/echarts';

var storeAllData = null;

let chart = null;
let xAxisData = null;
let yAxisMax = null;
let seriesData = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  
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
    
  },
  onReady:function(){
    this.getstore();
    
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
          that.changeData(storeAllData);
        } else if (res.data.error_code === 1005) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          util.showModel('失败', '连接错误，请稍后重试');
        }
        console.log(res);
      },
      fail: function(err) {
        console.log(err);
        if (err.errMsg === "request:fail timeout") {
          util.showModel('请求失败', '请求超时,请稍后再试');
        } else {
          util.showModel('请求失败', '连接错误，请稍后重试');
        } 
      }
    })
  },
  changeData: function (data, types) {
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
    this.putDown(chartData, types);
  },
  putDown: function(chartData,types) {
    console.log(types + 'ddddddddddddddddddd');
    xAxisData = chartData.categories;
    seriesData = chartData.data;
    console.log(chartData);
    var option = {
      title: {
        text: ''
      },
      tooltip: {
        
      },
      legend: {
        show: false
      },
      xAxis: {
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#03aaf8',
            width: 3
          }
        },
        axisTick:{
          show:false
        },
        axisLabel: {
          color: 'black',
          interval: 0,
          fontSize:12,
          formatter: function (value) {
            if(types === '0'){
              return value;
            }else{
              if (value.length > 4) {
                return value.slice(0, 3) + '\n' + value.slice(3);
              }
            }
          }
        }
      },
      yAxis: {
        min: 0,
        max: yAxisMax,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#03aaf8',
            width: 3
          }
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 1,
          handleSize: 8
        }
      ],
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
  },
  storeAll: function() {
    this.showitem();
    this.changeData(storeAllData);
    this.setData({
      selected: '全部'
    })
  },
  storeOne: function(event) {
    // console.log(event.currentTarget.dataset.store.store_id);
    this.showitem();
    let storeIdList = event.currentTarget.dataset.store.store_id;
    this.setData({
      selected: event.currentTarget.dataset.store.store_name
    })
    var thisStoreData = [];
    // console.log(storeAllData);
    for (var i = 0; i < storeAllData.length; i++) {
      if (storeIdList === storeAllData[i].store_id) {
        thisStoreData[0] = storeAllData[i];
      }
    }
    this.changeData(thisStoreData,'0');
  },
})