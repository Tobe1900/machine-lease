const app = getApp()
import QQmap from '../../utils/map.js';
import config from '../../config/index.js'
const qqmapObj = new QQmap()
Page({
  data: {
    city: '',
    slideImg: '../../icons/slide.jpg',
    goods: []
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      city: app.globalData.city !== '' ? app.globalData.city : ''
    })
    this.queryProduct()
  },
  onLoad: function () {
    let _this = this
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
                  _this.getLocation(_this)
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
          _this.getLocation(_this)
        }
      }
    })
  },
  queryProduct(){
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryProduct',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if (!data.errcode) {
          // 获取产品列表
          let tmp = data.map(item => {
            item.img = config.imageUrl + item.id + '/img.jpg'
            item.headImg = config.imageUrl + item.id + '/headImg.jpg'
            item.detailImgs = item.picNames && item.picNames.pics.map(picItem => {
              return config.imageUrl + item.id + '/' + picItem + '.jpg'
            })
            return item
          })
          _this.setData({ goods: tmp })
          // let mokoData = [...Array(6)].map(item => {
          //   return tmp[0]
          // })
          // _this.setData({ goods: mokoData })
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (error) {
        console.log('error', error)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  addCart(event) {
    let {productID} = event.detail
    console.log('productID', productID)
    wx.request({
      url: config.requestUrl + 'addToCart',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token,
        productID
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if (!data.errcode) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (error) {
        console.log('error', error)
      }
    })
  },
  selectCity() {
    wx.navigateTo({
      url: '../cityList/cityList',
    })
  },
  getLocation(target) {
    qqmapObj.getLocateInfo().then(function (res) {
      let val = res
      // if (val.indexOf('市') !== -1) { // 去掉“市”
      //   val = val.slice(0, val.indexOf('市'));
      // }
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
