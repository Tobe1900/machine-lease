import config from '../../config/index.js'
import {
  formatTime,
  handleDate
} from '../../utils/util.js'
const queryOrder = (self, page, type) => {
  wx.request({
    url: config.requestUrl + 'queryOrder',
    data: {
      token: wx.getStorageSync('token'),
      page: page,
      type: type
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function(res) {
      let {
        data
      } = res
      let orderList = self.data.orderList
      wx.hideLoading()
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
    },
    fail: function(error) {
      console.log('error', error)
    }
  })
}

Page({
  data: {
    isAuth:false,
    orderList: [],
    page: 1,
    type: '0',
    hasRecords: false,
    scrollTop: 0,
    scrollHeight: 0,
    locked: false,
    bottomInVisiable: true,
    selectedIndex: 0,
    noRecordsText: '',
    noOrderIcon: '../../icons/no_order.png',
    agreementImage: '../../../icons/agreement.png', // 模拟协议图片 后期可删除
    tabs: [{
        title: "已下单未审核",
        value: "0"
      },
      {
        title: "已审核可签约",
        value: "1"
      },
      {
        title: "已签约未支付",
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
  onLoad: function(options) {
    let _this = this;
    const isAuth = wx.getStorageSync("isAuth")
    _this.setData({
      isAuth
    })
    wx.getSystemInfo({
      success: function(res) {
        console.info(res.windowHeight);
        _this.setData({
          scrollHeight: res.windowHeight - 40,
          scrollWidth: res.windowWidth
        });
      }
    });
    wx.showLoading({
      title: '获取数据中...',
    })
    queryOrder(this, this.data.page, this.data.type)
  },
  onShow:function(){
    setTimeout(() => {
      let from = wx.getStorageSync("from")
      if (from == 'createOrder') {
        this.setData({
          selectedIndex: 0,
          type: '0',
          noRecordsText: '',
          hasRecords: false,
          orderList: []
        })
        queryOrder(this, 1, '0')
      }
      wx.removeStorageSync('from')
    }, 200)
  },
  selectTab(e) {
    wx.showLoading({
      title: '获取数据中...',
    })
    let {
      index,
      status
    } = e.currentTarget.dataset
    this.setData({
      selectedIndex: index,
      type: status,
      noRecordsText: '',
      hasRecords: false
    })
    this.setData({
      orderList: []
    })
    queryOrder(this, 1, status)
  },
  getOrderDetail(e) {
    // 订单详情
    let order = e.currentTarget.dataset.obj
    wx.navigateTo({
      url: './orderDetail/orderDetail?order=' + JSON.stringify(order)
    })
  },
  handleAuth(){
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
      setTimeout(function() {
        _this.setData({
          locked: false,
          orderList: []
        });
        queryOrder(_this, 1, _this.data.type);
        wx.hideLoading();
      }, 1000)
    }
  },
  bindDownLoad(e) {
    let _this = this;
    let currentPage = this.data.page;
    let orderList = this.data.orderList
    let lastItem = orderList[orderList.length - 1]
    if (_this.data.locked) {
      console.log("尝试解锁");
    } else {
      if (!lastItem.noMore) {
        currentPage++;
        _this.setData({
          locked: true
        });
        wx.showLoading({
          title: "获取数据中..."
        });
        setTimeout(function() {
          queryOrder(_this, currentPage, _this.data.type);
          _this.setData({
            bottomInVisiable: true,
            locked: false,
            scrolltop: e.detail.scrollTop
          });
          wx.hideLoading();
        }, 1500)
      } else {

      }
    }
  },
})