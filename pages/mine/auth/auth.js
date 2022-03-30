import config from "../../../config/index.js";
import { getIdentifyInfo, handleGetPhoneNumber } from "../../../api/index.js";
const app = getApp();

Page({
  data: {
    tabs: [
      {
        title: "拍照识别",
        value: "1",
      },
      {
        title: "手工录入",
        value: "2",
      },
    ],
    navType: "1",
    cWidth: 480,
    cHeight: 640,
    name: "拍照自动识别",
    idCode: "拍照自动识别",
    address: "拍照自动识别",
    access_token: null,
    default_front: "../../../icons/front.png",
    default_back: "../../../icons/back.png",
    front: null,
    back: null,
    formData: "",
    pAuthStatus: 0,
    smsCode: "",
    countdown: 180,
    timer: null,
    agreementItems: [
      {
        value: "hasRead",
        name: "已阅读",
        checked: false,
      },
    ],
    hasReadFlag: 0,
  },
  onReady: function () {
    this.smsCodeDialog = this.selectComponent("#smsCodeDialog"); //获得dialog组件以获得验证码
  },
  onLoad: function () {
    this.phoneDialog = this.selectComponent("#phoneDialog"); //设置dialog组件以获得手机号码
    getIdentifyInfo(this, (identifyInfo) => {
      if (!identifyInfo.mobile) {
        return this.phoneDialog.showDialog();
      }

      if (identifyInfo.pAuthStatus == 1) {
        this.setData({
          name: identifyInfo.name,
          idCode: identifyInfo.idCode,
          address: identifyInfo.address,
        });
      }
    });
  },
  hideSmsCodeDialogDialog() {
    this.smsCodeDialog.hide();
  },
  showSmsCodeDialogDialog() {
    this.smsCodeDialog.show();
  },

  confirmEvent() {
    this.phoneDialog.hideDialog();
    wx.navigateBack({
      delta: 1,
    });
  },
  getPhoneNumber(event) {
    handleGetPhoneNumber(event, this, "phoneDialog");
  },
  openTimer() {
    let _this = this;
    if (_this.timer) {
      clearInterval(this.timer);
      _this.setData({
        timer: null,
        countdown: 180,
      });
    }
    let timer = setInterval(function () {
      let countdown = _this.data.countdown;
      countdown = countdown - 1;
      _this.setData({
        countdown,
      });
      if (countdown == 1) {
        clearInterval(timer);
        _this.setData({
          timer: null,
          countdown: 180,
        });
      }
    }, 1000);
    _this.setData({
      timer,
    });
  },

  // clearTimer() {

  // },
  success: function (e) {
    alert("e:::", e.detail);
  },

  selectTab(e) {
    let { index, status } = e.currentTarget.dataset;
    if (status === "1") {
      this.setData({
        name: "拍照自动识别",
        idCode: "拍照自动识别",
        address: "拍照自动识别",
      });
    }
    if (status === "2") {
      this.setData({
        name: "",
        idCode: "",
        address: "",
      });
    }
    this.setData({
      navType: status,
    });
  },

  resendSms: function () {
    this.openTimer();
    wx.request({
      url: config.requestUrl + "resendSms",
      data: {
        token: wx.getStorageSync("token"),
      },
      header: {
        "content-type": "application/json",
      },
      method: "POST",
      success: function (res) {
        let data = res.data;
        if (!data.errcode) {
          // wx.showToast({
          //   title: '已重发,注意查收',
          //   duration: 1500
          // })
        }
      },
      fail: function (error) {
        console.log("Error:", error);
      },
    });
  },
  handleAuthPerson: function () {
    let _this = this;
    let { smsCode } = this.data;
    if (smsCode == "") {
      return wx.showToast({
        title: "请输入验证码",
        icon: "none",
        duration: 1500,
      });
    }
    wx.request({
      url: config.requestUrl + "authPerson",
      data: {
        token: wx.getStorageSync("token"),
        smsCode,
      },
      header: {
        "content-type": "application/json",
      },
      method: "POST",
      success: function (res) {
        let data = res.data;
        if (!data.errcode) {
          wx.showToast({
            title: "认证成功",
            duration: 1500,
          });
          _this.hideSmsCodeDialogDialog();
          wx.navigateBack({
            delta: 1,
          });
        } else {
          wx.showModal({
            title: "提示",
            content: data.errmsg,
          });
        }
      },
      fail: function (error) {
        console.log("Error:", error);
      },
    });
  },
  bindKeyInput(e) {
    this.setData({
      smsCode: e.detail.value,
    });
  },
  handleName: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },
  handleIdCode: function (e) {
    this.setData({
      idCode: e.detail.value,
    });
  },
  handleAddress: function (e) {
    this.setData({
      address: e.detail.value,
    });
  },
  formSubmit: function (e) {
    let _this = this;
    let { name, idCode, address, navType, agreementItems } = this.data;
    if (navType === "1" && idCode == "拍照自动识别") {
      return wx.showToast({
        title: "请先上传身份证照片",
        icon: "none",
        duration: 1500,
      });
    }
    // let hasReadFlag = (agreementItems.filter(item => item.checked)).length
    // if (hasReadFlag === 0) {
    //   return wx.showToast({
    //     title: '请先确认已阅读《数字证书使用协议》',
    //     icon: 'none',
    //     duration: 1500
    //   });
    // }
    if (navType === "2") {
      if (name.trim() === "")
        return wx.showToast({
          title: "姓名不能为空",
          icon: "none",
          duration: 1500,
        });
      if (idCode.trim() === "")
        return wx.showToast({
          title: "身份证号码不能为空",
          icon: "none",
          duration: 1500,
        });
      if (address.trim() === "")
        return wx.showToast({
          title: "地址不能为空",
          icon: "none",
          duration: 1500,
        });
    }
    let params = {
      token: wx.getStorageSync("token"),
      name,
      idCode,
      address,
    };
    wx.showModal({
      title: "温馨提示",
      content: "请确认身份信息识别无误，如发现姓名识别错误，可手动修改！",
      success(res) {
        if (res.confirm) {
          wx.request({
            url: config.requestUrl + "reqPersonAuth",
            data: params,
            header: {
              "content-type": "application/json",
            },
            method: "POST",
            success: function (res) {
              let data = res.data;
              console.log("res", res);
              if (!data.errcode) {
                _this.showSmsCodeDialogDialog();
                _this.openTimer(); // 开启定时器
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
                  title: "提示",
                  content: data.errmsg,
                });
              }
            },
            fail: function (error) {
              wx.showModal({
                title: "提示",
                content: error,
              });
            },
            complete: function () {
              // wx.hideLoading()
            },
          });
        } else if (res.cancel) {
        }
      },
    });
  },
  upload: function (img_file) {
    console.log("img_file", img_file);
    var that = this;
    wx.uploadFile({
      url: config.requestUrl + "recognIdentity",
      filePath: img_file,
      header: {
        "content-type": "multipart/form-data",
      },
      name: "file",
      formData: {
        method: "POST",
        token: wx.getStorageSync("token"),
      },
      success: function (res) {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if (!!data && !data.errcode) {
          wx.showToast({
            title: "识别成功",
            duration: 1500,
          });
          that.setData({
            name: data.name,
            idCode: data.idCode,
            address: data.address,
          });
          // wx.navigateBack({
          //   delta:1
          // })
        } else {
          wx.showModal({
            title: "提示",
            content: data.errcode + data.errmsg,
          });
        }
      },
    });
  },
  upimg: function (e) {
    let type = e.target.id;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["compressed"], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (photo) {
        wx.showLoading({
          title: "识别中...",
        });
        wx.getImageInfo({
          src: photo.tempFilePaths[0],
          success: function (res) {
            let originHeight = res.height;
            let originWidth = res.width;
            // 压缩比例
            // 最大尺寸限制
            let maxWidth = 480,
              maxHeight = 640;
            // 目标尺寸
            let targetWidth = originWidth,
              targetHeight = originHeight;
            // 等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 要求宽度*(原生图片比例)=新图片尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }
            that.setData({
              cWidth: targetWidth,
              cHeight: targetHeight,
            });
            var ctx = wx.createCanvasContext("canvas");
            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(
              photo.tempFilePaths[0],
              0,
              0,
              targetWidth,
              targetHeight
            );
            ctx.draw(
              false,
              setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: "canvas",
                  destWidth: targetWidth,
                  destHeight: targetHeight,
                  success: function (res) {
                    console.log(res.tempFilePath); //最终图片路径
                    if (type === "front") {
                      that.setData({
                        front: res.tempFilePath,
                      });
                    }
                    if (type === "back") {
                      that.setData({
                        back: res.tempFilePath,
                      });
                    }
                    that.upload(res.tempFilePath);
                  },
                  fail: function (res) {
                    console.log(res.errMsg);
                  },
                });
              }, 100)
            ); //留一定的时间绘制canvas
          },
          fail: function (res) {
            console.log(res.errMsg);
          },
        });
      },
    });
  },
  previewAgreement() {
    wx.navigateTo({
      url: "/pages/agreement/agreement",
    });
  },
  checkboxChange(e) {
    const items = this.data.agreementItems;
    const values = e.detail.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true;
          break;
        }
      }
    }

    let hasReadFlag = items.filter((item) => item.checked).length;
    this.setData({
      agreementItems: items,
      hasReadFlag: hasReadFlag,
    });
  },
});
