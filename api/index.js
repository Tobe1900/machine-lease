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


const handleGetPhoneNumber = (event, self, dialogName) => {
  let {code} = event.detail
  console.log('code get phonenmumber', code)
  if (code.iv && code.encryptedData) {
    // 用户同意授权获取手机号码
    let {iv,encryptedData} = code
    wx.request({
      url: config.requestUrl + 'getPhone',
      data: {
        token: wx.getStorageSync('token'),
        iv,
        encryptedData
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if (!data.errcode) {
          self[dialogName].hideDialog()
          wx.showToast({
            title: '手机绑定成功',
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
  } else {
    // 用户拒绝授权
    self[dialogName].hideDialog();
  }
}


module.exports = {
  requestAddCart,
  getIdentifyInfo,
  handleGetPhoneNumber
}