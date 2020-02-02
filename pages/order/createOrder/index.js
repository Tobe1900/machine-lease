const app = getApp()
import config from '../../../config/index.js'

Page({
  data: {
    selectedItems: [],
    startTimeText: '请选择',
    startDate: '',
    time: '',
    multiArray: [
      [],
      [],
      []
    ],
    multiIndex: [0, 0, 0],
    day: 0,
    rent: 0,
    days: [{
        value: 3
      },
      {
        value: 10
      },
      {
        value: 30
      },
      {
        value: 60
      },
      {
        value: 90
      }
    ],
    otherDay: ''
  },
  onReady: function() {
    //获得dialog组件
    this.useDaysDialog = this.selectComponent("#useDaysDialog");
  },
  testBackCar() {
    this.useDaysDialog.show()
  },
  hideUseDaysDialog() {
    this.useDaysDialog.hide()
  },
  setUseDays(e) {
    let {
      day
    } = e.currentTarget.dataset
    this.setData({
      day: day
    })
    this.useDaysDialog.hide()
  },
  bindKeyInput(e) {
    this.setData({
      otherDay: e.detail.value
    })
  },
  confirmDay() {
    let otherDay = this.data.otherDay
    if (otherDay == '') {
      return this.useDaysDialog.hide()
    }
    this.setData({
      day: otherDay,
      otherDay: ''
    })
    this.useDaysDialog.hide()
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
  bindMultiPickerColumnChange(e) {
    this.setData({
      startTimeText: '正在选择'
    })
    console.log('修改的列为', e.detail.column, ',值为', e.detail.value)
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data)
  }
})