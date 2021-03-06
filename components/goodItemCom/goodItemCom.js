// components/goodItemCom/goodItemCom.js
Component({
  properties: {
    goodItem: {
      type: Object,
      value: ''
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    // itemImg: '../../icons/slide.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  methods: {
    showGoodDetail: function(e) {
      let itemObj = e.currentTarget.dataset.obj;
      console.log('itemObj', itemObj)
      wx.navigateTo({
        url: '../../pages/goodDetail/goodDetail?item=' + JSON.stringify(itemObj)
      })
    },
    handleAddCart: function(e){
      let productID = e.currentTarget.dataset.id
      this.triggerEvent('addcart',{productID})
    }
  }
})