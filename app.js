//app.js
import config from './config/index.js'
const app = getApp()

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: config.loginUrl + 'onlogin',
            data: {
              code: res.code
            },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            success: function (res) {
              let data = res.data
              if (!data.errcode) {
                wx.setStorageSync('token', data.token)
              } else {
                wx.showToast({
                  title: data.errmsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function () {
              // 请求失败
              console.log('ee')
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    city: '',
    hasLogin: false,
    token: undefined
  }
})