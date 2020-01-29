const app = getApp()
import config from '../../../config/index.js'

Page({
  data: {
   
  },
  selectAddress(){
    wx.navigateTo({
      url: '../selectAddress/index'
    })
  }
})