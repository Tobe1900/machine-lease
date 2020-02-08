const app = getApp()
import QQmap from '../../utils/map.js';
import config from '../../config/index.js'
const qqmapObj = new QQmap()
Page({
  data: {
    city: '',
    isUserLogin: false,
    slideImg: '../../icons/slide.jpg',
    goods: [],
    isAuth: false,
    message: '为了您的账号安全，请尽快完成实名认证！',
    havePhone: false
  },
  onShow() {
    wx.showLoading({
      title: '获取数据中...',
      mask: true
    })
    this.setData({
      city: app.globalData.city !== '' ? app.globalData.city : ''
    })
    let token = wx.getStorageSync("token")
    if (!token) {
      app.userLogin().then(res => {
        if (!res.errcode) {
          this.queryProduct()
          this.setData({
            havePhone: wx.getStorageSync("havePhone") || app.globalData.havePhone,
            isAuth: wx.getStorageSync("isAuth") || app.globalData.isAuth
          })
        }
      })
    } else {
      this.queryProduct()
      this.setData({
        havePhone: wx.getStorageSync("havePhone") || app.globalData.havePhone,
        isAuth: wx.getStorageSync("isAuth") || app.globalData.isAuth
      })
    }
  },
  onLoad: function() {
    this.dialog = this.selectComponent("#phone_dialog"); //设置dialog组件以获得手机号码
    this.setUserLocation() // 授权获取地理位置
  },
  handleAuth() {
    wx.navigateTo({
      url: '../mine/auth/auth',
    })
  },
  showDialog() {
    this.dialog.showDialog();
  },
  confirmEvent() {
    this.dialog.hideDialog();
  },
  setUserLocation() {
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
                success: function(res) {
                  _this.getLocation(_this)
                }
              })
            },
            fail: function() {
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
  queryProduct() {
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryProduct',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
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
          _this.setData({
            goods: tmp
          })

          // 弹出获取手机号码弹框
          let havePhone = wx.getStorageSync("havePhone") || app.globalData.havePhone
          if (!havePhone) {
            setTimeout(() => {
              _this.showDialog()
            }, 500)
          }

          // 模拟数据：
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
      fail: function(error) {
        console.log('error', error)
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  addCart(event) {
    let {
      productID
    } = event.detail
    console.log('productID', productID)
    wx.request({
      url: config.requestUrl + 'addToCart',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token,
        productID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
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
      fail: function(error) {
        console.log('error', error)
      }
    })
  },
  selectCity() {
    wx.navigateTo({
      url: '../cityList/cityList',
    })
  },
  getLocation(self) {
    qqmapObj.getLocateInfo().then(function(res) {
      let {
        city,
        addressObj
      } = res
      // if (city.indexOf('市') !== -1) { // 去掉“市”
      //   city = city.slice(0, city.indexOf('市'));
      // }
      self.setData({
        city
      })
      app.globalData.city = city
      wx.setStorageSync('city', city)
      wx.setStorageSync('addressObj', JSON.stringify(addressObj))
    }, function(err) {
      console.log(err)
    })
  },
  getPhoneNumber(event) {
    let _this = this
    let {
      code
    } = event.detail
    console.log('code get phonenmumber', code)
    if (code.iv && code.encryptedData) {
      // 用户同意授权获取手机号码
      let {
        iv,
        encryptedData
      } = code
      wx.request({
        url: config.requestUrl + 'getPhone',
        data: {
          token: wx.getStorageSync('token') || app.globalData.token,
          iv,
          encryptedData
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          let data = res.data
          if (!data.errcode) {
            _this.dialog.hideDialog()
            wx.showToast({
              title: '绑定成功',
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
        fail: function(error) {
          console.log('error', error)
        }
      })
    } else {
      // 用户拒绝授权
      _this.dialog.hideDialog();
    }
  }
})