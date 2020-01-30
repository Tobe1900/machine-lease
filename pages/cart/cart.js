import config from '../../config/index.js'
Page({
  data: {
    cartList: [],
    totalCount: 0,
    isEdit: true,
    isCheckAll: false
  },
  onShow: function() {
    this.getCart()
  },
  onHide: function() {
    this.setData({
      totalCount: 0
    })
  },
  getCart() {
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryCart',
      data: {
        token: wx.getStorageSync('token') || app.globalData.token
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        let data = res.data
        // let data = [{
        //   productID: 4,
        //   name: '3米检查',
        //   num: 3,
        //   dPrice: 270,
        //   mPrice: 6500
        // }, {
        //   productID: 5,
        //   name: '5米剪叉',
        //   num: 6,
        //   dPrice: 188,
        //   mPrice: 4500
        // }, {
        //   productID: 6,
        //   name: '6米高台',
        //   num: 2,
        //   dPrice: 190,
        //   mPrice: 6800
        // }, {
        //   productID: 7,
        //   name: '8米高台',
        //   num: 2,
        //   dPrice: 190,
        //   mPrice: 6800
        // }, {
        //   productID: 8,
        //   name: '9米高台',
        //   num: 2,
        //   dPrice: 190,
        //   mPrice: 6800
        // }]

        if (!data.errcode) {
          if (Array.isArray(data) && data.length !== 0) {
            let tmp = data.map(item => {
              item.headImg = config.imageUrl + item.productID + '/headImg.jpg'
              item.selected = false
              return item
            })
            _this.setData({
              cartList: tmp
            })
          }
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(error) {
        console.log('error', error)
      }
    })
  },
  checkItem(e) {
    let _this = this
    let itemDataSet = e.currentTarget.dataset
    let cartList = _this.data.cartList,
      totalCount = Number(_this.data.totalCount),
      itemCount = itemDataSet.num,
      itemIndex = itemDataSet.cartIndex,
      itemSelect = itemDataSet.selected,
      itemChangeSelect = `cartList[${itemIndex}].selected`
    // console.log('itemIndex', itemIndex);
    if (itemSelect) {
      totalCount -= itemCount
    } else {
      totalCount += itemCount
    }
    _this.setData({
      [itemChangeSelect]: !itemSelect,
      totalCount: totalCount
    })
  },
  checkboxChange(e) {
    let _this = this,
      cartList = _this.data.cartList,
      selectItemLength = e.detail.length
    if (cartList.length == selectItemLength) {
      _this.setData({
        isCheckAll: true
      })
    } else {
      _this.setData({
        isCheckAll: false
      })
    }
  },
  handleEdit() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  // 全选
  checkAll(e) {
    let _this = this,
      totalCount = 0,
      cartList = _this.data.cartList
    // console.log(e.detail.value == 'checkAll')
    if (e.detail.value == 'checkAll') {
      _this.setData({
        isCheckAll: true
      })
      cartList.forEach((item, index) => {
        item['selected'] = true
        totalCount += item.num
      })
    } else {
      _this.setData({
        isCheckAll: false
      })
      cartList.forEach((item, index) => {
        item['selected'] = false
      })
      totalCount = 0
    }
    _this.setData({
      cartList: cartList,
      totalCount: totalCount
    })
  },
  // 修改购物车商品数量
  changeCount(e) {
    let _this = this,
      itemDataset = e.currentTarget.dataset
    let cartList = _this.data.cartList,
      totalCount = Number(_this.data.totalCount),
      itemCount = itemDataset.num,
      itemSelect = itemDataset.select,
      itemIndex = itemDataset.cartIndex,
      changeTarget = itemDataset.target,
      cartListCount = `cartList[${itemIndex}].num`;
    changeTarget == 'minus' ? itemCount-- : itemCount++
      if (itemSelect) {
        if (changeTarget == 'minus') {
          totalCount--
        } else {
          totalCount++
        }
        _this.setData({
          totalCount: totalCount
        })
      }
    _this.setData({
      [cartListCount]: itemCount
    })
  },
  deleteCartProduct() {
    let _this = this,
      cartList = _this.data.cartList;
    let selectedItem = cartList.filter(item => {
      return item.selected
    })
    let unselectedItem = cartList.filter(item => {
      return !item.selected
    })
    // console.log('selectedItem', selectedItem)
    if (selectedItem.length === 0) {
      wx.showToast({
        title: '您还没有选择商品哦',
        icon: 'none',
        duration: 1500
      });
    } else {
      let productIDs = selectedItem.map(item => {
        return item.productID
      })
      wx.request({
        url: config.requestUrl + 'delCartProduct',
        data: {
          token: wx.getStorageSync('token') || app.globalData.token,
          productIDs
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          let data = res.data
          if (!data.errcode) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            });
            _this.setData({
              cartList: unselectedItem
            })
          } else {
            wx.showToast({
              title: data.errmsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(error) {
          console.log('error', error)
        }
      })
    }
  },
  createOrder() {
    wx.navigateTo({
      url: '../order/createOrder/index',
    })
  }
})