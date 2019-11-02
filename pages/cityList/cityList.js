// pages/cityList/cityList.js
const app = getApp()
Page({
  data: {
    winHeight: 0
  },
  //监听传值
  cityTap(e) {
    const cityName = e.detail.cityname;
    app.globalData.city = cityName
    wx.setStorageSync('city', cityName)
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const win = wx.getSystemInfoSync();
    this.setData({
      winHeight: win.windowHeight
    });
  }
})