const app = getApp()
import QQmap from '../../utils/map.js';
const qqmapObj = new QQmap()
Page({
  data:{
    city:''
  },
  onShow(){
    this.setData({
      city: app.globalData.city !== '' ? app.globalData.city : ''
    })
  },
  onLoad: function(){
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用位置功能，后续调用 wx.getLocation不会调弹窗询问
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  that.getLocation(that)
                }
              })
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '未取得授权，无法匹配到城市信息，请选择所在城市',
                showCancel: false,
                confirmText: '选择城市',
                success(res) {
                  if (res.confirm) {
                    // 选择城市
                    wx.navigateTo({
                      url: '../cityList/cityList',
                    })
                  }
                }
              })
            }
          })
        } else {
          that.getLocation(that)
        }
      }
    })

  },
  selectCity(){
    wx.navigateTo({
      url: '../cityList/cityList',
    })
  },
  getLocation(target){
    qqmapObj.getLocateInfo().then(function (res) {
      let val = res
      if (val.indexOf('市') !== -1) { // 去掉“市”
        val = val.slice(0, val.indexOf('市'));
      }
      target.setData({
        city: val
      })
      app.globalData.city = val
      wx.setStorageSync('city', val)
    }, function (err) {
      console.log(err)
    })
  }
})
