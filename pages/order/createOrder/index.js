const app = getApp()
import config from '../../../config/index.js'

Page({
  data: {
    selectedItems: [],
    startDate: '',
    time: '',
    multiArray: [
      [],
      [],
      []
    ],
    multiIndex: [0, 0, 0]
  },
  onLoad: function(option) {
    let selectedItems = JSON.parse(option.selectedItems)
    this.setData({
      selectedItems: selectedItems
    })
    this.pickerTap()
  },
  selectAddress() {
    wx.navigateTo({
      url: '../selectAddress/index'
    })
  },
  pickerTap: function() {
    let date = new Date();
    let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    let monthDay = ['今天', '明天'];
    let hours = [];
    let minute = [];
    // 月-日
    for (let i = 2; i <= 120; i++) {
      let tmpDate = new Date(date);
      tmpDate.setDate(date.getDate() + i);
      let md = `${(tmpDate.getMonth() + 1)}月${tmpDate.getDate()}日 ${weekday[tmpDate.getDay()]}`;
      monthDay.push(md);
    }
    // 时
    for (let i = 0; i < 24; i++) {
      hours.push(`${i}点`);
    }
    // 分
    for (let i = 0; i < 60; i += 1) {
      minute.push(`${i}分`);
    }
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },
  bindMultiPickerColumnChange(e){
    console.log('修改的列为',e.detail.column,',值为', e.detail.value)
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data)
  }
})