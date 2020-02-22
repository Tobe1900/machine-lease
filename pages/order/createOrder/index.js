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
    isAuth: false,
    orderType: '',
    selectedItems: [],
    startTimeText: '请选择',
    startDate: '',
    time: '',
    multiArray: [
      [],
      [],
      []
    ],
    selectedDateIndex: 0,
    selectedHourIndex: 0,
    selectedMinuteIndex: 0,
    sendbackDateText: '请选择', // 还车日期
    sendbackDate: '',
    sendbackDay: '',
    selectedDay: '',
    selectedDate: '',
    selectedTime: '',
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
    this.rentRuleDialog = this.selectComponent("#rentRuleDialog")
    this.authDialog = this.selectComponent("#authDialog");
  },
  onLoad: function (option) {
    const isAuth = wx.getStorageSync("isAuth")
    const selectedItems = JSON.parse(option.selectedItems)
    const orderType = option.orderType
    this.setData({
      selectedItems: selectedItems,
      orderType,
      isAuth
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
  hideRentRuleDialog() {
    this.rentRuleDialog.hide()
  },
  showRentRuleDialog() {
    this.rentRuleDialog.show()
  },
  showAuthDialog() {
    this.authDialog.showDialog();
  },
  confirmEvent() {
    this.authDialog.hideDialog();
    wx.reLaunch({
      url: '/pages/order/order',
    })
  },
  handleAuth() {
    wx.navigateTo({
      url: '../../mine/auth/auth',
    })
  },
  setUseDays(e, arg) {
    let rent = 0
    let sendbackDateInex = 0
    let day = !!e ? e.currentTarget.dataset.day : arg
    let {
      multiArray,
      selectedMinuteIndex,
      selectedHourIndex,
      selectedDateIndex
    } = this.data
    let selectedHour = replaceHourStr(multiArray[1][selectedHourIndex])
    let selectedMinute = replaceMinuteStr(multiArray[2][selectedMinuteIndex])
    let time = Number(selectedHour + selectedMinute)
    if (time < 1500) {
      // 当天用车时间在15:00以前 不计当天
      sendbackDateInex = selectedDateIndex + Number(day) - 1
    } else {
      sendbackDateInex = selectedDateIndex + Number(day)
    }
    // 在这里根据天数计算租金
    let selectedItems = this.data.selectedItems
    if (Number(day) > 30) {
      // 1.超过30天，租金=(月租价÷30)×天数
      for (let p = 0; p < selectedItems.length; p++) {
        rent += (Number(selectedItems[p].mPrice) / 30) * Number(day) * Number(selectedItems[p].num)
      }
    } else {
      // 2.少于30天，租金=天租价×天数(如果超过月租价，只收取月租价)
      for (let p = 0; p < selectedItems.length; p++) {
        if (Number(selectedItems[p].dPrice) * Number(day) >= Number(selectedItems[p].mPrice)) {
          rent += Number(selectedItems[p].mPrice) * Number(selectedItems[p].num)
        } else {
          rent += Number(selectedItems[p].dPrice) * Number(day) * Number(selectedItems[p].num)
        }
      }

    }
    console.log('rent', rent)
    this.setData({
      rent: Math.floor(rent),
      day: day,
      sendbackDateInex: sendbackDateInex,
      sendbackDateText: '正在获取还车日期',
      sendbackDate: handleFormat(multiArray[0][sendbackDateInex]).date,
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
    this.setUseDays(undefined, otherDay)
    this.setData({
      otherDay: ''
    })
  },
  selectAddress() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '无法获取定位,请确认位置授权是否开启！',
            showCancel: false,
            confirmText: '确认',
            success(res) {
              if (res.confirm) {
                // openSetting
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                })
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../selectAddress/index'
          })
        }
      }
    })
  },
  pickerTap: function () {
    // 获取当前时间 让picker选中当前时间的时和分值
    let currentDate = new Date(),
      hourIndex = currentDate.getHours(),
      minuteIndex = currentDate.getMinutes()
    const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    let monthDay = [],
      hours = [],
      minute = [];
    let selectedDateIndex = this.data.selectedDateIndex

    // 月-日
    for (let i = 0; i <= 365; i++) {
      let tmpDate = new Date(currentDate);
      tmpDate.setDate(currentDate.getDate() + i);
      let md = `${(tmpDate.getMonth() + 1)}月${tmpDate.getDate()}日-${weekday[tmpDate.getDay()]}`;
      monthDay.push(md);
    }
    // 时
    if (selectedDateIndex !== 0) {
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
    } else {
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
  bindStartMultiPickerChange(e) { // 点击picker上的“确定”时触发
    this.setData({
      day: 0,
      sendbackDateText: '请选择'
    })
    let {
      multiArray,
      multiIndex
    } = this.data
    let {
      value
    } = e.detail // value: picker每列选中索引值构成的数组
    this.setData({
      selectedDateIndex: value[0], // 获取选中日期的索引值
      selectedHourIndex: value[1], // 获取选择小时的索引值
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
    } else if (data.multiIndex[0] === 0 && e.detail.column === 1 && e.detail.value !== 0) { // 如果选择的日期是今天  调整小时且不选中第一项
      for (let m = 0; m < 60; m++) {
        if (m < 10) {
          minutes.push(`0${m}分`);
        } else {
          minutes.push(`${m}分`);
        }
      }
      data.multiArray[2] = minutes;
      data.multiIndex = [0, e.detail.value, 0]
    } else if (data.multiIndex[0] === 0 && e.detail.column === 1 && e.detail.value === 0) { // 如果选择的日期是今天  调整小时且选中第一项
      for (let m = minuteIndex; m < 60; m++) {
        if (m < 10) {
          minutes.push(`0${m}分`);
        } else {
          minutes.push(`${m}分`);
        }
      }
      data.multiArray[2] = minutes;
      data.multiIndex = [0, e.detail.value, 0]
    }
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data)
    console.log('修改的列为', e.detail.column, ',值为', e.detail.value)
  },
  submitOrder() {
    let _this = this
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
    let {
      rent,
      day,
      isAuth,
      orderType
    } = this.data
    let beginTime = new Date().getFullYear() + '-' + convertDate(this.data.selectedDate) + ' ' + convertTime(this.data.selectedTime)
    if (address == '') {
      return wx.showToast({
        title: '请选择用车地址',
        icon: 'none',
        duration: 2000
      })
    } else if (rent == 0) {
      return wx.showToast({
        title: '请选择用车天数',
        icon: 'none',
        duration: 2000
      })
    }
    let formData = {
      token: wx.getStorageSync('token'),
      rent: rent,
      products: products,
      days: Number(day),
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
          if (orderType == 'cart') {
            let productIDs = _this.data.selectedItems.map(item => item.productID)
            _this.deleteCartProduct(productIDs) // 删除购物车中相应商品
          }
          // if (!isAuth) {
          //   _this.showAuthDialog()
          // } else {
          //   wx.showToast({
          //     title: '订单提交成功',
          //     icon: 'success',
          //     duration: 1000
          //   });
          //   // 跳转到订单页面
          //   wx.switchTab({】 
          //     url: '/pages/order/order',
          //     success: function (e) {
          //       wx.setStorageSync('from', 'createOrder')
          //     }
          //   })
          // }
          wx.showToast({
            title: '订单提交成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/order/order',
              success: function (e) {
                // wx.setStorageSync('targetTab', 'order')
              }
            })
          }, 1500)
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
  },
  deleteCartProduct(productIDs) {
    wx.request({
      url: config.requestUrl + 'delCartProduct',
      data: {
        token: wx.getStorageSync('token'),
        productIDs
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if (!data.errcode) { } else { }
      },
      fail: function (error) {
        console.log('DelCart Error:', error)
      }
    })
  },
})