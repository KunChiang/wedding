// app.js
App({
  onLaunch: function() {
    var that = this;
    wx.cloud.init()
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.login({
          success: function () {
              wx.getUserInfo({
                  success: function (res) {
                      //console.info(res);
                      that.globalData.userInfo = res.userInfo;
                      typeof cb == "function" && cb(that.globalData.userInfo)
                  }
              })
          }
      });
    }
  },
  onHide: function() {
    // wx.pauseBackgroundAudio();
  },
  onShow: function() {
    // wx.playBackgroundAudio()
  },
  globalData: {
    userInfo: null,

    // 下面填写酒店相关信息
    lat: 30.6789,
    lon: 108.01234,

    appid: '******', //小程序appid
    uid: 1,
  }
});
