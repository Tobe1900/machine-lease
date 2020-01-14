//app.js
import config from './config/index.js'
const app = getApp()

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        if(res.code){
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: config.requesUrl + 'onLogin',
            data:{
              code: res.code
            },
            header: { 'content-type': 'application/json' },
            method:'POST',
            success:function(res){
              if(!res.errcode){
                app.globalData.token = res.data.token
                wx.setStorageSync('token', res.data.token)
              } else {
                wx.showToast({
                  title: res.errmsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    city:'',
    hasLogin: false,
    token: undefined
  }
})