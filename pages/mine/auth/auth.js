let adds = {}
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
    // this.getAccessToken()
  },
  getAccessToken:function(){
    let that = this
    wx.request({
      url: 'http://nkh.m-th.cn/nkh/api/getAccessToken',
      method: 'GET',
      header:{'content-type':'application/json'},
      success:function(res){
        if(res){
          let data = res.data
          that.setData({
            access_token: data.access_token
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    this.upload()
  },

  upload: function (img_file) {
    var that = this
      wx.uploadFile({
        url: 'http://nkh.m-th.cn/nkh/api/ocrIdCard',
        filePath: img_file,
        header:{
          'content-type':'multipart/form-data'
          },
        name: 'idCodeImg',
        formData: {
          method: 'POST'
        },
        success: function (res) {
          if (!res.errcode) {
            wx.showToast({
              title: '上传成功',
              duration: 3000
            });
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