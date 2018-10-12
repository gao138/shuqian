/**
 * 小程序配置文件
 */

// 域名
// var host = 'http://47.104.253.129:8888';
var host = 'https://server.shuqianqian.cn:8877';
var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址
    loginUrl: `${host}/numbersign/v1.1/wx/login`,

    // 上传图片接口
    uploadUrl: `${host}/numbersign/v1.1/wx/recognize`,

    // 微信获取数据统计接口
    gethisUrl: `${host}/numbersign/v1.1/wx/statistics`,
    
    //微信获取门店信息
    getstoreUrl: `${host}/numbersign/v1.1/wx/getstore`,

    //微信获取识别次数
    getTimes: `${host}/numbersign/v1.1/wx/recognize/times`,
    
    //微信扫码接口
    scanning: `${host}/numbersign/v1.1/wx/scanning`,

    //微信识别报错接口
    regerror: `${host}/numbersign/v1.1/wx/regerror`,

    //退出接口
    logout: `${host}/numbersign/v1.1/app/logout`,

  }
};

module.exports = config;
