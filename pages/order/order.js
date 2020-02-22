import config from '../../config/index.js'
import {
  formatTime,
  handleDate
} from '../../utils/util.js'
const queryOrder = (self, page, type) => {
  let params = {
    token: wx.getStorageSync('token'),
    page: page
  }
  if (type !== '') {
    params.type = type
  }
  wx.request({
    url: config.requestUrl + 'queryOrder',
    data: params,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      let {
        data
      } = res
      let orderList = self.data.orderList
      if (Array.isArray(data) && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          let products = data[i].products
          let tmpProducts = products.map(item => {
            return {
              img: config.imageUrl + item.productID + '/img.jpg',
              name: item.name,
              num: item.num,
              dPrice: item.dPrice,
              mPrice: item.mPrice
            }
          })
          orderList.push(
            Object.assign({}, {
              ...data[i]
            }, {
                time: formatTime(data[i].time, 'yyyy-MM-dd hh:mm'),
                beginTime: handleDate(data[i].beginTime),
                products: tmpProducts,
                agreementImg: data[i].agreementImage || self.data.agreementImage
              })
          )
        }
        if (page === 1 && data.length < 10) {
          let noMoreText = {
            noMore: true,
            value: '已经到底'
          }
          orderList.push(noMoreText)
        }
        self.setData({
          orderList: orderList,
          page: page,
          hasRecords: true,
        })
      } else {
        let noMoreText = {
          noMore: true,
          value: '已经到底'
        }
        orderList.push(noMoreText)
        if (page === 1) {
          self.setData({
            hasRecords: false,
            noRecordsText: '暂无相关订单'
          })
        } else {
          self.setData({
            orderList: orderList
          })
        }
      }
      wx.hideLoading()
    },
    fail: function (error) {
      wx.showModal({
        title: '提示',
        content: error,
      })
    },
    complete: function () {
      // wx.hideLoading()
    }
  })
}

Page({
  data: {
    isAuth: false,
    orderList: [],
    page: 1,
    type: '',
    hasRecords: false,
    scrollTop: 0,
    hasScroll:false,
    scrollHeight: 0,
    locked: false,
    bottomInVisiable: true,
    selectedIndex: 0,
    noRecordsText: '',
    noOrderIcon: '../../icons/no_order.png',
    agreementImage: '../../../icons/agreement.png', // 模拟协议图片 后期可删除
    tabs: [{
      title: "全部",
      value: ""
    },
    {
      title: "待审核",
      value: "0"
    },
    {
      title: "待签约",
      value: "1"
    },
    {
      title: "待支付",
      value: "2"
    },
    {
      title: "已支付",
      value: "3"
    },
    {
      title: "已取消",
      value: "4"
    }
    ],
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载数据中...',
    })
    let _this = this;
    const isAuth = wx.getStorageSync("isAuth")
    _this.setData({
      isAuth
    })
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        _this.setData({
          scrollHeight: res.windowHeight - 40,
          scrollWidth: res.windowWidth
        });
      }
    });
    queryOrder(this, this.data.page, this.data.type)
  },
  // onShow: function () {
  //   setTimeout(() => {
  //     let targetTab = wx.getStorageSync('targetTab')
  //     if (targetTab == 'order') {
  //       this.setData({
  //         selectedIndex: 0,
  //         type: '',
  //         noRecordsText: '',
  //         hasRecords: false,
  //         orderList: []
  //       })
  //       // queryOrder(this, 1, '0')
  //     }
  //     wx.removeStorageSync('targetTab')
  //   }, 200)
  // },
  scroll(e){
    if(e.detail.scrollTop > 0){
      this.setData({
        hasScroll: true
      })
    } else {
      this.setData({
        hasScroll: false
      })
    }
  },
  selectTab(e) {
    // wx.showLoading({
    //   title: '加载数据中...',
    // })
    let { index, status } = e.currentTarget.dataset
    let selectedIndex = this.data.selectedIndex
    if (index !== selectedIndex) {
      wx.showLoading({
        title: '加载数据中...',
      })
      this.setData({
        selectedIndex: index,
        type: status,
        noRecordsText: '',
        hasRecords: false,
        orderList: []
      })
      if(this.data.hasScroll){
        return
      }
      queryOrder(this, 1, status)
    }

  },
  getOrderDetail(e) {
    // 订单详情
    let order = e.currentTarget.dataset.obj
    wx.navigateTo({
      url: './orderDetail/orderDetail?order=' + JSON.stringify(order)
    })
  },
  handleAuth() {
    wx.navigateTo({
      url: '../mine/auth/auth',
    })
  },
  refresh(event) {
    if (this.data.locked) {
      console.log("尝试解锁")
      wx.showLoading({
        title: '刷新中...'
      })
    } else {
      let _this = this;
      _this.setData({
        locked: true
      })
      setTimeout(function () {
        _this.setData({
          locked: false,
          orderList: []
        });
        queryOrder(_this, 1, _this.data.type);
      }, 500)
    }
  },
  bindDownLoad() {
    let _this = this;
    let currentPage = this.data.page;
    let orderList = this.data.orderList
    let lastItem = orderList[orderList.length - 1]
    if (_this.data.locked) {
      console.log("尝试解锁")
    } else {
      if (!lastItem.noMore) {
        wx.showLoading({
          title: '加载数据中...',
        })
        currentPage++;
        _this.setData({
          locked: true
        })
        setTimeout(function () {
          queryOrder(_this, currentPage, _this.data.type);
          _this.setData({
            bottomInVisiable: true,
            locked: false
          });
        }, 1500)
      } else {
        wx.hideLoading()
      }
    }
  }
})