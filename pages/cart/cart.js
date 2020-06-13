import config from '../../config/index.js'
Page({
  data: {
    cartList: [],
    totalCount: 0,
    isEdit: true,
    isCheckAll: false,
    noRecordsText: '',
    emptyCartIcon: '../../icons/empty_cart.png',
    havePhone: false
  },
  onLoad: function() {
    this.dialog = this.selectComponent("#phone_dialog"); //设置dialog组件以获得手机号码
    let havePhone = wx.getStorageSync("havePhone")
    this.setData({
      havePhone
    })
  },
  onShow: function() {
    this.getCart()
  },
  onHide: function() {
    this.setData({
      isCheckAll: false,
      totalCount: 0,
      isEdit: true,
      noRecordsText: '',
      cartList:[]
    })
  },
  showDialog() {
    this.dialog.showDialog();
  },
  confirmEvent() {
    this.dialog.hideDialog();
  },
  getPhoneNumber(event) {
    let _this = this
    let {
      code
    } = event.detail
    console.log('code get phonenmumber', code)
    if (code.iv && code.encryptedData) {
      // 用户同意授权获取手机号码
      let {
        iv,
        encryptedData
      } = code
      wx.request({
        url: config.requestUrl + 'getPhone',
        data: {
          token: wx.getStorageSync('token'),
          iv,
          encryptedData
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          let data = res.data
          if (!data.errcode) {
            _this.dialog.hideDialog()
            _this.setData({
              havePhone:true
            })
            wx.setStorageSync("havePhone", true)
            wx.showToast({
              title: '手机绑定成功',
              icon: 'success',
              duration: 1000
            });
          } else {
            wx.showToast({
              title: data.errmsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (error) {
          console.log('error', error)
        }
      })
    } else {
      // 用户拒绝授权
      _this.dialog.hideDialog();
    }
  },
  getCart() {
    let _this = this
    wx.request({
      url: config.requestUrl + 'queryCart',
      data: {
        token: wx.getStorageSync('token')
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
        //   productID: 4,
        //   name: '5米剪叉',
        //   num: 6,
        //   dPrice: 188,
        //   mPrice: 4500
        // }, {
        //   productID: 4,
        //   name: '6米高台',
        //   num: 2,
        //   dPrice: 190,
        //   mPrice: 6800
        // }, {
        //   productID: 4,
        //   name: '8米高台',
        //   num: 2,
        //   dPrice: 190,
        //   mPrice: 6800
        // }, {
        //   productID: 4,
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
              cartList: tmp,
              noRecordsText: ''
            })
          } else {
            _this.setData({
              noRecordsText: '您的购物车空空如也，快去首页选购吧！'
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
  handleComplete() {
    let _this = this,
      cartList = _this.data.cartList;
    let selectedItems = cartList.filter(item => {
      return item.selected
    })
    let products = selectedItems.map(item => {
      return {
        id: item.productID,
        num: item.num
      }
    })
    if (products.length !== 0) {
      wx.request({
        url: config.requestUrl + 'editCartProduct',
        data: {
          token: wx.getStorageSync('token'),
          products
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          let data = res.data
          if (!data.errcode) {
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 1000
            });
            _this.setData({
              isEdit: true
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
    } else {
      _this.setData({
        isEdit: true
      })
    }
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
      itemChangeSelect = `cartList[${itemIndex}].selected`,
      cartListCount = `cartList[${itemIndex}].num`;
    // 点击 “- +” 商品时的代码逻辑（加入了定时器）：
    setTimeout(function() {
      let selectedItems = cartList.filter(item => {
        return item.selected
      })
      if (selectedItems.length !== 0) {
        let tmpTotal = 0
        for (let i = 0; i < selectedItems.length; i++) {
          tmpTotal += Number(selectedItems[i].num)
        }
        totalCount = tmpTotal
      }
      // console.log('ses', selectedItems)
      // console.log('totalCount', totalCount)
      _this.setData({
        totalCount: totalCount
      })
    }, 500)


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
      [cartListCount]: itemCount,
      [itemChangeSelect]: true
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
          token: wx.getStorageSync('token'),
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
            if (unselectedItem.length === 0) {
              _this.setData({
                noRecordsText: '您的购物车空空如也，快去首页选购吧！'
              })
            }
            _this.setData({
              cartList: unselectedItem,
              isEdit: true
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
    let {
      cartList,
      havePhone
    } = this.data
    let selectedItems = cartList.filter(item => {
      return item.selected
    })
    if (selectedItems.length === 0) {
      return wx.showToast({
        title: '您还没有选择商品哦',
        icon: 'none',
        duration: 1500
      })
    }

    if (selectedItems.length > 4) {
      return wx.showToast({
        title: '下单时勾选的商品不能超过4种',
        icon: 'none',
        duration: 2000
      })
    }
    

    if (!havePhone) {
      return this.showDialog()
    }
    wx.navigateTo({
      url: '../order/createOrder/index?selectedItems=' + JSON.stringify(selectedItems) + '&orderType=cart'
    })
  }
})