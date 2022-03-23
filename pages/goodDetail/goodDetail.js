import { debounce } from "../../utils/util.js";
import {
  requestAddCart,
  handleGetPhoneNumber,
  getIdentifyInfo,
} from "../../api/index.js";

import config from "../../config/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailImags: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duraion: 500,
    item: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dialog = this.selectComponent("#phone_dialog"); //设置dialog组件以获得手机号码
    let itemObj = JSON.parse(options.item);
    this.setData({
      item: itemObj,
      detailImags: itemObj.detailImgs,
    });
  },
  showDialog() {
    this.dialog.showDialog();
  },
  confirmEvent() {
    this.dialog.hideDialog();
  },
  navToCart() {
    wx.reLaunch({
      url: "/pages/cart/cart",
    });
  },
  bindAddCart: debounce(function (that, e) {
    let productID = e.currentTarget.dataset.id;
    // console.log('11', productID)
    requestAddCart(productID);
  }),

  getPhoneNumber(event) {
    handleGetPhoneNumber(event, this, "dialog");
  },
  createOrder() {
    let { cartList, item } = this.data;
    let selectedItems = [
      {
        productID: item.id,
        name: item.name,
        dPrice: item.dPrice,
        mPrice: item.mPrice,
        headImg: config.imageUrl + item.id + "/headImg.jpg",
        num: 1,
      },
    ];

    getIdentifyInfo(this, (identifyInfo) => {
      if (!identifyInfo.mobile) {
        return this.showDialog();
      }
      wx.navigateTo({
        url:
          "../order/createOrder/index?selectedItems=" +
          JSON.stringify(selectedItems) +
          "&orderType=direct",
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
