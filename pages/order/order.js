import config from '../../config/index.js'
import {
  formatTime
} from '../../utils/util.js'
const queryOrder = (self, page, type) => {
  wx.request({
    url: config.requestUrl + 'queryOrder',
    data: {
      token: wx.getStorageSync('token') || app.globalData.token,
      page: page,
      type: type
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
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
              num: item.num
            }
          })
          orderList.push(
            Object.assign({}, {
              ...data[i]
            }, {
                time: formatTime(data[i].time, 'yyyy-MM-dd hh:mm'),
                beginTime: formatTime(data[i].beginTime, 'yyyy-MM-dd hh:mm'),
                products: tmpProducts
              })
          )
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
    fail: function (error) {
      console.log('error', error)
    }
  })
}

Page({
  data: {
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
  onLoad: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        _this.setData({
          scrollHeight: res.windowHeight - 40,
          scrollWidth: res.windowWidth
        });
      }
    });
  },
  onHide: function () {
    this.setData({
      page: 1,
      type: 0,
      selectedIndex: 0,
      orderList: [],
      noRecordsText: '',
      hasRecords: false
    })
  },
  onShow: function () {
    wx.showLoading({
      title: '获取数据中...',
    })
    queryOrder(this, this.data.page, this.data.type)
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
  getOrderDetail() {
    // 订单详情
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
        setTimeout(function () {
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