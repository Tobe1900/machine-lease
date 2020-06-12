//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    isUserLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    default_avatarUrl: '../../icons/default_avatar.jpg',
    // isAuth: false,
    pAuthStatus: 0,
  },
  onLoad: function() {
    let userInfo = wx.getStorageSync('userInfo') || null
    if (userInfo || app.globalData.userInfo) {
      this.setData({
        userInfo: userInfo || app.globalData.userInfo,
        isUserLogin: true
      })
    }
    if (wx.getStorageSync('identifyInfo')) {
      let identifyInfo = JSON.parse(wx.getStorageSync('identifyInfo'))
      let pAuthStatus = identifyInfo.pAuthStatus
      this.setData({
        pAuthStatus
      })
    }

    // let isAuth = wx.getStorageSync("isAuth")


    // this.setData({
    //   isAuth
    // })
  },
  setPersonalAuth: function() {
    // if (!this.data.isUserLogin) {
    //   this.showDialog()
    //   return
    // }
    let pAuthStatus = this.data.pAuthStatus
    if (pAuthStatus == 2) {
      return
    }
    wx.navigateTo({
      url: './auth/auth',
    })
  },
  loginOrRegist() {
    if (!this.data.isUserLogin) {
      this.showDialog()
    }
  },
  getUserInfo: function(e) {
    let that = this;
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                userInfo: res.userInfo,
                isUserLogin: true
              })
              wx.setStorageSync("userInfo", res.userInfo)
            },
            fail(res) {
              // console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.showDialog()
        }
      }
    })
  },
  onReady: function() {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog: function() {
    this.dialog.showDialog();
  },

  confirmEvent: function() {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function() {
    // 用户点击授权后，这里可以做一些操作
    this.getUserInfo();
  },

  // goToSignUrl: function() {
  //   // wx.navigateTo({
  //   //   url: '/pages/signPage/signPage?externalUrl=' + 'https://www.m-th.cn/orchid/test/',
  //   // })
  //   wx.navigateTo({
  //     url: '/pages/transit/transit',
  //   })
  // }
})