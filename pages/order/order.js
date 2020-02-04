import config from '../../config/index.js'
Page({
  data:{
    orderList:[],
    page:1,
    type: 0
  },
  onLoad:function(){

  },
  onShow:function(){
   this.queryOrder()
  },
  queryOrder(){
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryOrder',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token,
        page: _this.data.page,
        type: _this.data.type
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success:function(res){
        let {data} = res.data
        console.log('order', data)
      },
      fail:function(error){
        console.log('error', error)
      }
    })
  }
})