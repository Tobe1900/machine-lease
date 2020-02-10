import config from '../../../config/index.js'
// canvas 全局配置
var context = null; // 使用 wx.createContext 获取绘图上下文 context
var arrx = []; //所有点的X轴集合
var arry = []; //所有点的Y轴集合
var arrz = []; //标记数组
var canvasw = 0; //画布的宽 
var canvash = 0; //画布的高
var top = 0;
var left = 0;
let app = getApp();
//注册页面
Page({
  canvasIdErrorCallback: function(e) {
    console.error(e.detail.errMsg)
  },
  //绘制之前
  canvasStart: function(event) {
    // arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
    //就算点击之后手指没有移动,那么下次要移动之前还是必定会先触发这个
  },
  //手指移动过程
  canvasMove: function(event) {
    context.moveTo(arrx[arrx.length - 1], arry[arrx.length - 1])
    // arrz.push(1);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
    context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);

    //下面注释的为movo,linoTo方式二，清空一次画一次（上面可以不用刷新每一帧）
    // for (var i = 0; i < arrx.length; i++) {
    //   if (arrz[i] == 0) {
    //     context.moveTo(arrx[i], arry[i])
    //   } else {
    //     context.lineTo(arrx[i], arry[i])
    //   };
    // };
    // context.clearRect(0, 0, canvasw, canvash);//清空上一帧

    context.setLineWidth(4); //设置线条的宽度
    context.setLineCap('round'); //设置结束时 点的样式
    context.stroke(); //画线
    context.draw(true); //设置为true时，会保留上一次画出的图像，false则会清空(方式二设置为false,一为true)
  },
  //手指离开
  canvasEnd: function(event) {

  },
  cleardraw: function() {
    //清除画布
    arrx = [];
    arry = [];
    // arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(false);
    this.setData({
      src: ''
    })
  },
  //导出图片
  getimg: function() {
    if (arrx.length == 0) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    };
    wx.showLoading({
      title: '签名生成中..',
      mask: true
    })
    let _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function(res) {
        _this.setData({
          src: res.tempFilePath,
        })
        wx.uploadFile({
          url: config.requestUrl + 'sign',
          filePath: res.tempFilePath,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: {
            method: 'POST',
            token: wx.getStorageSync('token') || app.globalData.token,
            orderId: _this.data.orderId
          },
          success: function(res) {
            let data = res.data
            if (!!data && !data.errcode) {
              wx.showToast({
                title: '签约成功',
                duration: 3000
              });
            } else {
              wx.showModal({
                title: '提示',
                content: data.errmsg,
              })
            }
          }
        })
        wx.hideLoading()
      }
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    agreementImg: '',
    orderId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let agreementImg = options.agreementimg
    let orderId = options.orderid
    this.setData({
      agreementImg: agreementImg,
      orderId: orderId
    })
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath();

    var query = wx.createSelectorQuery();
    query.select('.handCenter').boundingClientRect(rect => {
      top = rect.top;
      left = rect.left;
      canvasw = rect.width;
      canvash = rect.height;
      wx.hideLoading()
    }).exec();
  }
})