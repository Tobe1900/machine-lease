const wxqqmap = require('../libs/qqmap-wx-jssdk.min.js')
const qqwxmap = new wxqqmap({
  key: 'OISBZ-PV46J-6GHF7-K7UOU-JI6W6-HPFME' // 必填，这里最好填自己申请的的
});
export default class qqmap { //获取定位信息
  getLocateInfo(paramPromise) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      let locationPromise = paramPromise || _this.location()
      locationPromise.then(function(val) {
        //如果通过授权，那么直接使用腾讯的微信小程序sdk获取当前定位城市
        qqwxmap.reverseGeocoder({
          location: {
            latitude: val.latitude,
            longitude: val.longitude
          },
          success: function(res) {
            let {
              result
            } = res
            let tmpResult = {
              city: result.address_component.city,
              addressObj: {
                latitude: result.location.lat,
                longitude: result.location.lng,
                address: result.address + '-' + result.formatted_addresses.recommend,
                name: result.address_reference.landmark_l2.title
              },
            }
            // wx.setStorageSync('city', result.address_component.city)
            resolve(tmpResult); //返回城市 和 经纬度
          },
          fail: function(res) {
            reject(res);
          }
        });

      }, function(error) {
        //如果用户拒绝了授权，那么这里会提醒他，去授权后再定位
        wx.showModal({
          title: '',
          content: '自动定位需要授权地理定位选项',
          confirmText: '去授权',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  _this.getLocateInfo();
                }
              })
            }
          }
        })

      })

    })
  }
  //定位，获取当前经纬度
  location() {
    return new Promise(function(resolve, reject) {
      wx.getLocation({
        altitude: true,
        success: function(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        }
      })
    });
  }
}