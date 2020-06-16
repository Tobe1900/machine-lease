//app.js
import config from './config/index.js'
const app = getApp()

App({
  onLaunch: function() {
    console.log('onLaunch')
    // let _this = this
    // // 登录
    // wx.login({
    //   success: res => {
    //     if (res.code) {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       wx.request({
    //         url: config.loginUrl + 'onlogin',
    //         data: {
    //           code: res.code
    //         },
    //         header: {
    //           'content-type': 'application/json'
    //         },
    //         method: 'POST',
    //         success: function(res) {
    //           let data = res.data
    //           if (!data.errcode) {
    //             _this.globalData.token = data.token
    //             _this.globalData.havePhone = data.havePhone
    //             wx.setStorageSync('token', data.token)
    //             wx.setStorageSync('havePhone', data.havePhone)
    //           } else {
    //             wx.showToast({
    //               title: data.errmsg,
    //               icon: 'none',
    //               duration: 2000
    //             })
    //           }
    //         },
    //         fail: function() {
    //           // 请求失败
    //           console.log('ee')
    //         }
    //       })
    //     }
    //   }
    // })
  },
  userLogin(){
   let _this = this
   return new Promise((resolve,reject) => {
     wx.login({
       success: res => {
         if (res.code) {
           // 发送 res.code 到后台换取 openId, sessionKey, unionId
           wx.request({
             url: config.loginUrl + 'onlogin',
             data: {
               code: res.code
             },
             header: {
               'content-type': 'application/json'
             },
             method: 'POST',
             success: function (res) {
               let data = res.data
               if (!data.errcode) {
                 _this.globalData.token = data.token
                 wx.setStorageSync('token', data.token)
                 resolve(data)
               } else {
                 wx.showToast({
                   title: data.errmsg,
                   icon: 'none',
                   duration: 2000
                 })
               }
             },
             fail: function (res) {
               // 请求失败
               reject(res)
               wx.showToast({
                 title: '系统错误',
                 icon: 'none',
                 duration: 2000
               })
             }
           })
         } else {
           reject('error')
         }
       }
     })
   })
  },
  globalData: {
    userInfo: null,
    city: '',
    hasLogin: false
  }
})
