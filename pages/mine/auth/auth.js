let adds = {}
Page({
  data:{
    name: '',
    idCode: '',
    access_token: null,
    img_arr:[],
    formData: ''
  },
  onLoad:function(){
    this.getAccessToken()
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
    var id = e.target.id
    adds = e.detail.value;
    this.upload()
  },

  upload: function () {
    var that = this
      wx.uploadFile({
        url: 'http://nkh.m-th.cn/nkh/api/ocrIdCard?access_token='+that.data.access_token,
        filePath: that.data.img_arr[0],
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
  upimg: function () {
    var that = this;
    if (this.data.img_arr.length < 3) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  }
})