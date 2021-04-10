const app = getApp()
// var server = app.globalData.server + "/info";
var appid = app.globalData.appid;
// const info = app.mainInfo;
// var userinfo = app.userInfo;
const db = wx.cloud.database({env:"*****"}) // 云开发环境id

Page({

  /**
   * 页面的初始数据
   */
  data: {
    painting: {},
    shareImage: '',
    mainInfo: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let userInfo = wx.getStorageSync('userInfo')
    // let userInfo = {"nickName": "anickName"}
    if (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    }

    db.collection("MainInfo").get({
      success: function(res){
        // wx.hideLoading();
        console.log("[+] ", res.data[0])
        that.setData({
          mainInfo: res.data[0]
        })
        that.eventDraw()
      }
    })
  },

  eventDraw() {

    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    var that = this
    // let avatar = that.data.userInfo.avatarUrl
    let nickName = that.data.userInfo.nickName
    that.setData({
      painting: {
        width: 375*2,
        height: 667*2,
        clear: true,
        views: [
          {
            type: 'image',
            url: '/images/poster.jpg',
            top: 0,
            left: 0,
            width: 375*2,
            height: 667*2
          },
          {
            type: 'text',
            content: nickName + ':',
            fontSize: 20*2,
            color: '#B08B51',
            // color: '#aa2f2f',
            textAlign: 'left',
            top: 340*2,
            left: 80*2,
            bolder: true,
            width: 200*2,
            height: 30*2
          },
          {
            type: 'text',
            content: that.data.mainInfo.he + ' ❤️ ' + that.data.mainInfo.she,
            // content: that.data.mainInfo.date,
            fontSize: 12*2,
            color: '#B08B51',
            textAlign: 'right',
            top: 400*2,
            left: 290*2,
            bolder: true,
            width: 375*2,
            height: 30*2
          },
          {
            type: 'text',
            // content: that.data.mainInfo.he + ' ❤️ ' + that.data.mainInfo.she,
            content: that.data.mainInfo.date,
            fontSize: 12*2,
            color: '#B08B51',
            textAlign: 'right',
            top: 415*2,
            left: 290*2,
            bolder: true,
            width: 375*2,
            height: 30*2
          },
          // {
          //     type: 'text',
          //     content: '长按识别二维码',
          //     fontSize: 12*2,
          //     color: '#333',
          //     textAlign: 'left',
          //     top: 578*2,
          //     left: 20,
          //     bolder: true,
          //     width: 100*2,
          //     height: 20*2
          // },
          // 二维码
          {
            type: 'image',
            url: that.data.mainInfo.qrimg,
            top: 430*2,
            left: 138*2,
            width: 100*2,
            height: 100*2
          },
          {
            type: 'image',
            url: that.data.mainInfo.thumb,
            top: 180*2,
            left: 75*2,
            width: 220*2,
            height: 150*2
          }
        ]
      }
    })
    console.log(this.data.painting)
  },
  eventSave() {
    // console.log(this.data.shareImage)
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const {
      tempFilePath
    } = event.detail
    this.setData({
      shareImage: tempFilePath
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})
