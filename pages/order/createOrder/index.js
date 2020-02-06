const app = getApp()
import config from '../../../config/index.js'
import {
  handleFormat,
  convertDate,
  convertTime,
  replaceMinuteStr,
  replaceHourStr
} from '../../../utils/util.js'

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
    selectedDateIndex:0,
    selectedHourIndex:0,
    selectedMinuteIndex:0,
    sendbackDateText:'请选择', // 还车日期
    sendbackDate:'',
    sendbackDay:'',
    selectedDay: '',
    selectedDate: '',
    selectedTime: '',
    multiIndex: [0, 0, 0],
    day: 0,
    rent: 24530,
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
    otherDay: '',
    addressObj: {
      name: '',
      latitude: '',
      longitude: '',
      address: '',
      isSetAddress: false
    }
  },
  onReady: function () {
    //获得dialog组件
    this.useDaysDialog = this.selectComponent("#useDaysDialog");
  },
  onLoad: function (option) {
    let selectedItems = JSON.parse(option.selectedItems)
    this.setData({
      selectedItems: selectedItems
    })
    this.pickerTap()
  },
  chooseUseDays() {
    let {
      startTimeText
    } = this.data
    if (startTimeText == '请选择') {
      wx.showToast({
        title: '请选择用车时间',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.useDaysDialog.show()
  },
  hideUseDaysDialog() {
    this.useDaysDialog.hide()
  },
  setUseDays(e, arg) {
    let sendbackDateInex = 0
    let day = !!e ? e.currentTarget.dataset.day : arg
    let {multiArray,selectedMinuteIndex,selectedHourIndex,selectedDateIndex} = this.data
    let selectedHour = replaceHourStr(multiArray[1][selectedHourIndex])
    let selectedMinute = replaceMinuteStr(multiArray[2][selectedMinuteIndex])
    let time = Number(selectedHour + selectedMinute)
    if (time < 1500){
      // 当天用车时间在15:00以前 不计当天
      sendbackDateInex = selectedDateIndex + Number(day) - 1
    } else {
      sendbackDateInex = selectedDateIndex + Number(day)
    }
    console.log('sendbackDateInex', sendbackDateInex)
    // 在这里根据天数计算租金
    // code here ..........
    this.setData({
      day: day,
      sendbackDateInex: sendbackDateInex,
      sendbackDateText:'正在获取还车日期',
      sendbackDate:handleFormat(multiArray[0][sendbackDateInex]).date,
      sendbackDay: handleFormat(multiArray[0][sendbackDateInex]).day
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
    this.setUseDays(undefined,otherDay)
    this.setData({
      otherDay:''
    })
  },
  selectAddress() {
    wx.navigateTo({
      url: '../selectAddress/index'
    })
  },
  pickerTap: function () {
    // 获取当前时间 让picker选中当前时间的时和分值
    let currentDate = new Date(),
      hourIndex = currentDate.getHours(),
      minuteIndex = currentDate.getMinutes()
    const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    let monthDay = [];
    let hours = [];
    let minute = [];
    // 月-日
    for (let i = 0; i <= 365; i++) {
      let tmpDate = new Date(currentDate);
      tmpDate.setDate(currentDate.getDate() + i);
      let md = `${(tmpDate.getMonth() + 1)}月${tmpDate.getDate()}日-${weekday[tmpDate.getDay()]}`;
      monthDay.push(md);
    }
    // 时
    for (let i = hourIndex; i < 24; i++) {
      if (i < 10) {
        hours.push(`0${i}点`);
      } else {
        hours.push(`${i}点`);
      }
    }
    // 分
    for (let i = minuteIndex; i < 60; i += 1) {
      if (i < 10) {
        minute.push(`0${i}分`);
      } else {
        minute.push(`${i}分`);
      }
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
  bindStartMultiPickerChange(e) {  // 点击picker上的“确定”时触发
    this.setData({
      day:0,
      sendbackDateText:'请选择'
    })
    let { multiArray, multiIndex } = this.data
    let {value} = e.detail   // value: picker每列选中索引值构成的数组
    this.setData({
      selectedDateIndex: value[0],  // 获取选中日期的索引值
      selectedHourIndex: value[1],  // 获取选择小时的索引值
      selectedMinuteIndex: value[2], // 获取选择分钟的索引值
      startTimeText: '正在获取用车日期',
      selectedDay: handleFormat((multiArray[0])[multiIndex[0]]).day,
      selectedDate: handleFormat((multiArray[0])[multiIndex[0]]).date,
      selectedTime: (multiArray[1])[multiIndex[1]] + (multiArray[2])[multiIndex[2]]
    })
  },
  bindMultiPickerColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    let currentDate = new Date(),
      hourIndex = currentDate.getHours(),
      minuteIndex = currentDate.getMinutes(),
      hours = [],
      minutes = []
    if (e.detail.column === 0 && e.detail.value === 0) { // 如果选择的日期是今天
      console.log('today')
      for (let h = hourIndex; h < 24; h++) {
        if (h < 10) {
          hours.push(`0${h}点`);
        } else {
          hours.push(`${h}点`);
        }
      }
      for (let m = minuteIndex; m < 60; m++) {
        if (m < 10) {
          minutes.push(`0${m}分`);
        } else {
          minutes.push(`${m}分`);
        }
      }
      data.multiArray[1] = hours;
      data.multiArray[2] = minutes;
      data.multiIndex = [e.detail.value, 0, 0]
      this.setData(data)
    } else if (e.detail.column === 0 && e.detail.value !== 0) { // 如果选择的日期不是今天
      for (let h = 0; h < 24; h++) {
        if (h < 10) {
          hours.push(`0${h}点`);
        } else {
          hours.push(`${h}点`);
        }
      }
      for (let m = 0; m < 60; m++) {
        if (m < 10) {
          minutes.push(`0${m}分`);
        } else {
          minutes.push(`${m}分`);
        }
      }
      data.multiArray[1] = hours;
      data.multiArray[2] = minutes;
      data.multiIndex = [e.detail.value, 0, 0]
      this.setData(data)
    }
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data)
    console.log('修改的列为', e.detail.column, ',值为', e.detail.value)
  },
  submitOrder() {
    let products = this.data.selectedItems.map(item => {
      let {
        productID,
        num,
        dPrice,
        mPrice
      } = item
      return {
        productID,
        num,
        dPrice,
        mPrice
      }
    })
    let {
      name,
      address,
      latitude,
      longitude
    } = this.data.addressObj
    let addressDesc = {
      name,
      address,
      latitude,
      longitude
    }
    let beginTime = new Date().getFullYear() + '-' + convertDate(this.data.selectedDate) + ' ' + convertTime(this.data.selectedTime)
    let formData = {
      token: wx.getStorageSync('token') || app.globalData.token,
      rent: this.data.rent,
      products: products,
      days: this.data.day,
      addressDesc,
      beginTime
    }
    wx.request({
      url: config.requestUrl + 'createOrder',
      data: formData,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if (!data.errcode) {
          wx.showToast({
            title: '订单提交成功',
            icon: 'success',
            duration: 1000
          });
          wx.switchTab({
            url: '/pages/order/order',
          })
          // 跳转到订单页面
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (error) {
        console.log('error', error)
      }
    })
  }
})