const app = getApp()
import QQmap from '../../../utils/map.js';
import config from '../../../config/index.js'
const qqmapObj = new QQmap()

Page({
  data: {
    mapHeight: 0,
    mapWidth: 0,
    addressObj: {
      name: '',
      latitude: '',
      longitude: '',
      address: ''
    }
  },
  onShow: function() {
    let _this = this;
    let addressObj = wx.getStorageSync("addressObj")
    if (!!addressObj) {
      _this.setData({
        addressObj: JSON.parse(addressObj)
      })
    } else {
      // 调用qqmapsdk 获取位置信息
      qqmapObj.getLocateInfo().then(function(res) {
        let {
          city,
          addressObj
        } = res
        // if (city.indexOf('市') !== -1) { // 去掉“市”
        //   city = city.slice(0, city.indexOf('市'));
        // }
        _this.setData({
          addressObj: addressObj
        })
        wx.setStorageSync('city', city)
        wx.setStorageSync('addressObj', JSON.stringify(addressObj))
      }, function(err) {
        console.log(err)
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        console.info(res.windowHeight);
        _this.setData({
          mapHeight: res.windowHeight,
          mapWidth: res.windowWidth,
          centerMarginTop: (res.windowHeight / 2) - 16
        });
      }
    });
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext('map') // 获取map组件上下文
  },
  searchAddress() {
    wx.navigateTo({
      url: '../searchAddress/searchAddress',
    })
  },
  locateCurrent() {
    let _this = this
    qqmapObj.getLocateInfo().then(res => {
      _this.setData({
        addressObj: res.addressObj
      })
      wx.setStorageSync('addressObj', JSON.stringify(res.addressObj))
    }, err => {
      console.log('error', err)
    })
  },
  getCenterMap(e) {
    // console.log(this.longitude)
    let _this = this
    if (e.type == 'end') {
      if (e.causedBy == 'scale' || e.causedBy == 'drag') {
        _this.setData({
          addressObj: {
            name: '',
            address: '正在获取用车地点.....',
            latitude: '',
            longitude: ''
          }
        })
        _this.mapCtx.getCenterLocation({
          success: function(res) {
            let paramPromise = Promise.resolve({
              latitude: res.latitude,
              longitude: res.longitude
            })
            qqmapObj.getLocateInfo(paramPromise).then(res => {
              _this.setData({
                addressObj: res.addressObj
              })
            }, err => {
              console.log('error', err)
            })
          }
        })
      } else {
        // 其余事件不执行逻辑
      }
    }
  },
  // 确定地址:
  confirmAddress() {
    let _this = this
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    prePage.setData({
      addressObj: { ..._this.data.addressObj,
        isSetAddress: true
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 点击标记点时触发：
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})