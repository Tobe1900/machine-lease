const app = getApp()
import config from '../../../config/index.js'
import {
  handleFormat,
  replaceMonth,
  replacePonit
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
  onReady: function() {
    //获得dialog组件
    this.useDaysDialog = this.selectComponent("#useDaysDialog");
  },
  chooseUseDays() {
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
    let monthDay = [];
    let hours = [];
    let minute = [];
    // 月-日
    for (let i = 0; i <= 120; i++) {
      let tmpDate = new Date(date);
      tmpDate.setDate(date.getDate() + i);
      let md = `${(tmpDate.getMonth() + 1)}月${tmpDate.getDate()}日-${weekday[tmpDate.getDay()]}`;
      monthDay.push(md);
    }
    // 时
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        hours.push(`0${i}点`);
      } else {
        hours.push(`${i}点`);
      }
    }
    // 分
    for (let i = 0; i < 60; i += 1) {
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
    setTimeout(() => {
      this.setData({
        selectedDay: handleFormat((this.data.multiArray[0])[this.data.multiIndex[0]]).day,
        selectedDate: handleFormat((this.data.multiArray[0])[this.data.multiIndex[0]]).date,
        selectedTime: (this.data.multiArray[1])[this.data.multiIndex[1]] + (this.data.multiArray[2])[this.data.multiIndex[2]]
      })
    }, 200)
  },
  submitOrder() {
    let products = this.data.selectedItems.map(item => {
      return {
        productID: item.productID,
        num: item.num,
        dPrice: item.dPrice,
        mPrice: item.mPrice
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
    let beginTime = new Date().getFullYear() + '-' + replaceMonth(this.data.selectedDate) + ' ' + replacePonit(this.data.selectedTime)
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
      success: function(res) {
        let data = res.data
        if (!data.errcode) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          });
          // 跳转到订单页面
        } else {
          wx.showToast({
            title: data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(error) {
        console.log('error', error)
      }
    })
  }
})