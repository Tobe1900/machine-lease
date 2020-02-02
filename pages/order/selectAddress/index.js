const app = getApp()
import QQmap from '../../../utils/map.js';
import config from '../../../config/index.js'
const qqmapObj = new QQmap()

Page({
  data: {
    latitude: 29.55537,
    longitude: 114.03892,
    centerPointIcon: '../../../icons/location.png',
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
  onLoad:function(){
    
  },
  getCenterMap1(){
    console.log('自身位置坐标', this.data.longitude, this.data.latitude)
  },
  regionchange(e) {
    console.log(e.type)
  },
  // 点击标记点时触发：
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})