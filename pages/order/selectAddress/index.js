const app = getApp()
import QQmap from '../../../utils/map.js';
import config from '../../../config/index.js'
const qqmapObj = new QQmap()

Page({
  data: {
    centerPointIcon: '../../../icons/location.png',
    mapHeight:0,
    addressObj: {
      name: '',
      latitude: '',
      longitude: '',
      address: ''
    },
    // markers: [{ // 标记点
    //   // iconPath: "../../others.png",
    //   id: 0,
    //   latitude: 29.55537,
    //   longitude: 114.03892,
    //   width: 50,
    //   height: 50
    // }],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    controls: [{
      id: 1,
      iconPath: '../../../icons/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  onLoad: function() {
    let _this = this;
    let addressObj = wx.getStorageSync("addressObj")
    if (!!addressObj) {
      _this.setData({
        addressObj: JSON.parse(addressObj)
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        _this.setData({
          mapHeight: res.windowHeight,
          centerMarginTop: (res.windowHeight / 2) - 16
        });
      }
    });
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext('map') // 获取map组件上下文
  },
  getCenterMap(e) {
    // console.log(this.longitude)
    let _this = this
    if (e.type == 'begin') {
      // _this.setData({
      //   addressObj: {
      //     name: '',
      //     address: '正在获取用车地点.....',
      //     latitude: '',
      //     longitude: ''
      //   }
      // })
    }
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