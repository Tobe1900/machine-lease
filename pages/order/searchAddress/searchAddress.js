// pages/order/searchAddress/searchAddress.js
import QQmap from '../../../utils/map.js';
import {
  throttle
} from '../../../utils/util.js'
const qqmapObj = new QQmap()
Page({
  data: {
    city: '',
    // 展示列表
    locationList: [],
    // 默认当前坐标附近的列表
    poiList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  selectCity() {
    wx.navigateTo({
      url: '../../cityList/cityList',
    })
  },
  bindSearch: throttle(function(that, e) {
    // let that = this;
    let searchVal = e.detail.value;
    console.log(searchVal)
    qqmapObj.search({
      region: that.data.city,
      keyword: searchVal,
      success: function(res) {
        console.log(res)
        var data = res.data;
        if (data.length > 0) {
          that.setData({
            locationList: data
          })
        } else {
          wx.showLoading({
            title: '搜索结果为空',
            duration: 1000
          })
        }
      },
      fail: function(res) {
        if (res.status == 120) {
          wx.showLoading({
            title: '搜索频率过快',
            duration: 1000
          })
          that.setData({
            locationList: that.data.poiList
          })
        }
        that.setData({
          locationList: that.data.poiList
        })
      }
    });
  }, 2000),
  selectLocation(e){
    const location = e.currentTarget.dataset.location 
    let addressObj = {
      name: location.title,
      address:location.address,
      latitude:location.location.lat,
      longitude: location.location.lng
    } 
    wx.setStorageSync('addressObj', JSON.stringify(addressObj))
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let city = wx.getStorageSync('city')
    this.setData({
      city
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})