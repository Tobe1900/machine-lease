import qqmap from '../../utils/map.js';
import {cityList,letterList} from '../../data/data.js'
const app = getApp()
Component({
  properties: {
    styles: { //可以自定义最外层的view的样式
      type: String,
      value: '',
      observer: function(newval, oldval) {
        // 监听改变
        console.log('ddd',newval, oldval);
      }
    }
  },
  
  data: {
    letter: letterList,
    cityListId: '',// 用于点击字母索引时做联动
    citylist: cityList,
    locateCity: '',
    scrollHeight:0
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let _this = this
      wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
      this.setData({
        locateCity: app.globalData.city ? app.globalData.city : '无法定位，请选择城市'
      })
    }
  },
  methods: {
    //点击城市
    cityTap(e) {
      const val = e.currentTarget.dataset.val.cityName 
      if (val) {
        this.triggerEvent('citytap', {
          cityname: val
        });
      }
    },
    //点击城市字母
    letterTap(e) {
      const Item = e.currentTarget.dataset.item;
      wx.showToast({
        title: Item,
        icon:'none',
        duration: 500
      })
      this.setData({
        cityListId: Item
      });
      console.log(this.data.cityListId);
    },
    //调用定位
    getLocate() {
      let city = app.globalData.city
      this.setData({locateCity: city})
    }
  },
  // ready() {
  //   let that = this,
  //     cityOrTime = wx.getStorageSync('locatecity') || {},
  //     time = new Date().getTime(),
  //     city = '';
  //   if (!cityOrTime.time || (time - cityOrTime.time > 1800000)) { //每隔30分钟请求一次定位
  //     this.getLocate();
  //   } else { //如果未满30分钟，那么直接从本地缓存里取值
  //     that.setData({
  //       locateCity: cityOrTime.city
  //     })
  //   }
  // }
})