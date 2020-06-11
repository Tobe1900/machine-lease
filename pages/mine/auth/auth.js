import config from '../../../config/index.js'
const app = getApp()

Page({
  data:{
    name: '拍照自动识别',
    idCode: '拍照自动识别',
    access_token: null,
    default_front:'../../../icons/front.png',
    default_back:'../../../icons/back.png',
    front:null,
    back: null,
    formData: ''
  },
  onLoad:function(){
    // 页面加载时调用
    
  },
  formSubmit: function (e) {
    this.upload()
  },
  upload: function (img_file) {
    var that = this
      wx.uploadFile({
        url: config.requestUrl + 'recognIdentity',
        filePath: img_file,
        header:{
          'content-type':'multipart/form-data'
          },
        name: 'file',
        formData: {
          method: 'POST',
          token: wx.getStorageSync('token'),
        },
        success: function (res) {
          console.log('res', res)
          let data = res.data
          if (!!data && !data.errcode) {
            wx.showToast({
              title: '认证成功',
              duration: 3000
            });
            wx.setStorageSync("isAuth", true)
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
  upimg: function (e) {
    let type = e.target.id
    var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        success: function (res) {
          switch(type){
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