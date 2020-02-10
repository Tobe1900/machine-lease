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
    // 跳转签名
    console.log(e.currentTarget)
    let agreementImg = e.currentTarget.dataset.agreementimg
    let orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../userSign/userSign?agreementimg=' + agreementImg + '&orderid=' + orderid
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
                  duration: 2000
                })
              }
            },
            fail(res) {
              wx.showToast({
                title: 'wx.requestPayment系统错误',
                icon: 'none',
                duration: 2000
              })
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