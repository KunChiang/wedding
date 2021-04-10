// pages/invitation/index.js
const app = getApp()
// var server = app.globalData.server + "/info";
var appid = app.globalData.appid;
const uid = app.globalData.uid;
// var music_url = app.globalData.music_url;
// var music_url = "tmp"
var touchDot = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录 
const db = wx.cloud.database({env:"*****"}) // 云开发环境id

var BAM = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "",
    coverAnimation: "",
    userInfo: {},
    // music_url: music_url,
    isPlayingMusic: true,
    mainInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '幸福马上到来',
      icon: 'loading',
    });
    // var BAM = wx.getBackgroundAudioManager()

    db.collection("MainInfo").get({
      success: function(res){
        wx.hideLoading();
        that.setData({
          mainInfo: res.data[0]
        })
        BAM.src = that.data.mainInfo.music_url,
        BAM.title = '背景音乐'
        BAM.coverImgUrl = '',
        BAM.onEnded(function() {
          BAM.src = that.data.mainInfo.music_url
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    BAM.play()
    // wx.playBackgroundAudio({
    //   dataUrl: this.data.music_url,
    //   title: '',
    //   coverImgUrl: ''
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 创建动画
    var animation = wx.createAnimation({

      duration: 3600,
      timingFunction: "ease",
      delay: 600,
      transformOrigin: "50% 50%",

    })
    animation.scale(0.88).translate(10, 10).step(); //边旋转边放大
    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
      // mainInfo: info,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // var that = this;
    //console.log(that.data);
    return {
      title: this.data.mainInfo.he+"&"+this.data.mainInfo.she+"的婚礼邀请函",
      imageUrl: this.data.mainInfo.share,
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  play: function(event) {
    if (this.data.isPlayingMusic) {
      BAM.pause()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      BAM.play()
      this.setData({
        isPlayingMusic: true
      })
    }
  },
})
