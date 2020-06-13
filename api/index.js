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


const getIdentifyInfo = (self, callback) => {
  let _this = self
  wx.request({
    url: config.requestUrl + 'getIdentifyInfo',
    data: {
      token: wx.getStorageSync('token')
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function(res) {
      if (res.statusCode == 200) {
        let identifyInfo = res.data
        _this.setData({
          pAuthStatus: identifyInfo.pAuthStatus
        })
        if (callback) callback(identifyInfo)
      }
    },
    fail: function(error) {
      console.log('error', error)
    }
  })
}


module.exports = {
  requestAddCart,
  getIdentifyInfo
}