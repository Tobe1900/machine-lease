import config from '../../../config/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = JSON.parse(options.order)
    this.setData({order})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  navigateToSign(e) {
    let orderid = e.currentTarget.dataset.orderid
    wx.request({
      url: config.requestUrl + 'sign',
      data: {
        token: wx.getStorageSync('token'),
        orderId: orderid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res) {
         console.log('res', res)
         if(res.statusCode == 200) {
           let data = res.data
           if(data.url) {
             let signUrl = encodeURIComponent(data.url)
               wx.navigateTo({
                 url: '/pages/signPage/signPage?externalUrl=' + signUrl,
               })
           } else {
             if (data.errcode && data.errmsg) {
                wx.showToast({
                  title: data.errmsg,
                  icon: 'none',
                  duration: 2000
                })
              }
           }
         }
      },
      fail:function(error){
        console.log('sign error', error)
      }
    })

  },
  payOrder(e) {
    let orderId = e.currentTarget.dataset.orderid
    wx.request({
      url: config.requestUrl + 'payOrder',
      data: {
        token: wx.getStorageSync('token'),
        orderId: orderId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log('ressssss', res)
        if (res.errMsg == "request:ok") {
          let nonceStr = res.data.nonceStr,
            _package = res.data.package,
            paySign = res.data.paySign,
            signType = res.data.signType,
            timeStamp = res.data.timeStamp


          wx.requestPayment({
            nonceStr: nonceStr,
            package: _package,
            paySign: paySign,
            signType: signType,
            timeStamp: timeStamp,
            success(res) {
              if (res && res.errMsg === 'requestPayment:ok') {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(() => {
                  wx.reLaunch({ url: '/pages/order/order' })
                }, 1500)
              }
            },
            fail(res) {
              wx.showToast({
                title: '支付失败或已取消支付',
                icon: 'none',
                duration: 2000
              })
              wx.navigateBack()
            }
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: '系统错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})