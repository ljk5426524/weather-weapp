// pages/weather/weather.js

const amapFile = require('../../libs/amap-wx.js');

const myAmapFun = new amapFile.AMapWX({key:'21545c3ef6110dd12201ffe256ed92c0'});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationData:{},
    weatherList:[],
    userRefuse:false,
    sentence:'',
    who:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        const userLocation = res.authSetting["scope.userLocation"]
        _this.setData({
          userRefuse:!userLocation
        })
      }
    })
    this.getRadomSentence()
    console.log(myAmapFun )
    myAmapFun.getWeather({
      type:'forecast',
      success:(data)=>{
        let list = data.forecast.casts
        list.forEach((item,index)=>{
          item.week = `周${this.weekFilter(item.week)}`
          if(index === 0){
            item.day = '今日'
          }
          if(index === 1){
            item.day = '明天'
          }
          if(index === 2){
            item.day = '后天'
          }
          if(index === 3){
            item.day = '大后天'
          }
        })
        this.setData({
          userRefuse:false,
          locationData:data.forecast,
          weatherList: list
        })
      },
      fail:(error)=>{
        console.log(error)
        if(error.errMsg === 'getLocation:fail auth deny'){
          this.setData({
            userRefuse:true
          })
        }
      }
    })
  },
  weekFilter(week){
    const objMap = {
      1:'一',
      2:'二',
      3:'三',
      4:'四',
      5:'五',
      6:'六',
      7:'日',
    }
    return objMap[week]
  },
  getRadomSentence(){
    const _this = this
    wx.request({
      url: 'https://v1.hitokoto.cn/',
      data:{
        c:"i",
        encode:"json",
        charset:"utf-8"
      },
      method:'GET',
      success(res){
        console.log(res)
        _this.setData({
          sentence:res.data.hitokoto,
          who:res.data.from_who
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})