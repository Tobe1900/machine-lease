const app = getApp()
import QQmap from '../../../utils/map.js';
import config from '../../../config/index.js'
const qqmapObj = new QQmap()

Page({
  data: {
    latitude: '',
    longitude: '',
    centerPointIcon: '../../../icons/location.png',
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
      iconPath: '/resources/location.png',
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
    let addressObj = wx.getStorageSync("addressObj")
    if (!!addressObj) {
      // let {
      //   latitude,
      //   longitude
      // } = JSON.parse(addressObj)
      this.setData({
        addressObj: JSON.parse(addressObj)
      })
    }
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext('map') // 获取map组件上下文
  },
  getCenterMap1() {
    console.log('自身位置坐标', this.data.longitude, this.data.latitude)
  },
  getCenterMap(e) {
    // console.log(this.longitude)
    let _this = this
    if (e.type == 'begin') {
      // console.log('beigining')
    }
    if (e.type == 'end') {
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
            console.log(err)
          })
        }
      })
    }
  },
  // 点击标记点时触发：
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})