import config from '../../config/index.js'
Page({
  data: {
    cartList: []
  },
  onShow: function() {
    this.getCart()
  },
  getCart() {
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryCart',
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
          let tmp = data.map(item => {
            item.headImg = config.imageUrl + item.productID + '/headImg.jpg'
            return item
          })
          _this.setData({
            cartList: tmp
          })
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
  }
})