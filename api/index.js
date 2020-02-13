import config from '../config/index.js'

const requestAddCart = (productID) => {
  wx.request({
    url: config.requestUrl + 'addToCart',
    data: {
      token: wx.getStorageSync('token'),
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
}

module.exports = {
  requestAddCart
}