import config from '../../../config/index.js'
import {
  getIdentifyInfo
} from '../../../api/index.js'
const app = getApp()

Page({
  data: {
    name: '拍照自动识别',
    idCode: '拍照自动识别',
    address: '拍照自动识别',
    access_token: null,
    default_front: '../../../icons/front.png',
    default_back: '../../../icons/back.png',
    front: null,
    back: null,
    formData: '',
    pAuthStatus: 0,
    smsCode: '',
    countdown: 60,
    timer: null
  },
  onReady: function() {
    //获得dialog组件
    this.smsCodeDialog = this.selectComponent("#smsCodeDialog");
  },
  onLoad: function() {
    let _this = this
    // 页面加载时调用
    getIdentifyInfo(_this, identifyInfo => {
      if (identifyInfo.pAuthStatus == 1) {
        _this.setData({
          name: identifyInfo.name,
          idCode: identifyInfo.idCode,
          address: identifyInfo.address
        })
      }
    })
  },
  hideSmsCodeDialogDialog() {
    this.smsCodeDialog.hide()
  },
  showSmsCodeDialogDialog() {
    this.smsCodeDialog.show()
  },

  openTimer() {
    let _this = this
    if (_this.timer) {
      clearInterval(this.timer)
      _this.setData({
        timer: null,
        countdown: 60
      })
    }
    let timer = setInterval(function() {
      let countdown = _this.data.countdown
      countdown = countdown - 1
      _this.setData({
        countdown
      })
      if (countdown == 1) {
        clearInterval(timer)
        _this.setData({
          timer: null,
          countdown: 60
        })
      }
    }, 1000)
    _this.setData({
      timer
    })

  },

  // clearTimer() {

  // },

  resendSms: function() {
    this.openTimer()
    wx.request({
      url: config.requestUrl + 'resendSms',
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        let data = res.data
        if (!data.errcode) {
          // wx.showToast({
          //   title: '已重发,注意查收',
          //   duration: 1500
          // })
        }
      },
      fail: function(error) {
        console.log('Error:', error)
      }
    })
  },
  handleAuthPerson: function() {
    let _this = this
    let {
      smsCode
    } = this.data
    if (smsCode == '') {
      return wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1500
      });
    }
    wx.request({
      url: config.requestUrl + 'authPerson',
      data: {
        token: wx.getStorageSync('token'),
        smsCode
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        let data = res.data
        if (!data.errcode) {
          wx.showToast({
            title: '认证成功',
            duration: 1500
          })
          _this.hideSmsCodeDialogDialog()
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showModal({
            title: '提示',
            content: data.errmsg,
          })
        }
      },
      fail: function(error) {
        console.log('Error:', error)
      }
    })
  },
  bindKeyInput(e) {
    this.setData({
      smsCode: e.detail.value
    })
  },
  handleName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  formSubmit: function(e) {
    let _this = this
    let {
      name,
      idCode,
      address
    } = this.data
    if (idCode == '拍照自动识别') {
      return wx.showToast({
        title: '请先上传身份证照片',
        icon: 'none',
        duration: 1500
      });
    }
    let params = {
      token: wx.getStorageSync('token'),
      name,
      idCode,
      address
    }

    wx.showModal({
      title: '温馨提示',
      content: '请确认身份信息识别无误，如发现姓名识别错误，可手动修改！',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: config.requestUrl + 'reqPersonAuth',
            data: params,
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function(res) {
              let data = res.data
              console.log('res', res)
              if (!data.errcode) {
                _this.showSmsCodeDialogDialog()
                _this.openTimer() // 开启定时器
                // let counter = setInterval(function () {
                //   let countdown = _this.data.countdown
                //   countdown = countdown - 1
                //   _this.setData({
                //     countdown
                //   })
                //   if (countdown == 0) {
                //     clearInterval(counter)
                //     counter = null
                //   }
                // }, 1000)


              } else {
                wx.showModal({
                  title: '提示',
                  content: data.errmsg,
                })
              }
            },
            fail: function(error) {
              wx.showModal({
                title: '提示',
                content: error,
              })
            },
            complete: function() {
              // wx.hideLoading()
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  upload: function(img_file) {
    var that = this
    wx.uploadFile({
      url: config.requestUrl + 'recognIdentity',
      filePath: img_file,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',
      formData: {
        method: 'POST',
        token: wx.getStorageSync('token'),
      },
      success: function(res) {
        let data = JSON.parse(res.data)
        if (!!data && !data.errcode) {
          wx.showToast({
            title: '识别成功',
            duration: 1500
          });
          that.setData({
            name: data.name,
            idCode: data.idCode,
            address: data.address
          })
          // wx.navigateBack({
          //   delta:1
          // })
        } else {
          wx.showModal({
            title: '提示',
            content: data.errmsg,
          })
        }
      }
    })
  },
  upimg: function(e) {
    let type = e.target.id
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: function(res) {
        switch (type) {
          case 'front':
            console.log('heeeh front')
            wx.showLoading({
              title: '正在上传'
            })
            that.setData({
              front: res.tempFilePaths[0]
            })
            that.upload(res.tempFilePaths[0])
            break
          case 'back':
            that.setData({
              back: res.tempFilePaths[0]
            })
            that.upload(res.tempFilePaths[0])
            break
          default:
            break
        }
      }
    })
  }
})