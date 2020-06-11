import config from '../../../config/index.js'
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
  },
  onLoad: function() {
    // 页面加载时调用
    if (wx.getStorageSync('identifyInfo')) {
      let identifyInfo = JSON.parse(wx.getStorageSync('identifyInfo'))
      let pAuthStatus = identifyInfo.pAuthStatus
      this.setData({
        pAuthStatus
      })
      if (pAuthStatus == 1) {
        this.setData({
          name: identifyInfo.name,
          idCode: identifyInfo.idCode,
          address: identifyInfo.address
        })
      }
    }

  },
  handleName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  formSubmit: function(e) {
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
          console.log('用户点击确定')
          wx.request({
            url: config.requestUrl + 'reqPersonAuth',
            data: params,
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function(res) {
              console.log('res', res)
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
            duration: 3000
          });
          that.setData({
            name: data.name,
            idCode: data.idCode,
            address: data.address
          })
          // wx.setStorageSync("isAuth", true)
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