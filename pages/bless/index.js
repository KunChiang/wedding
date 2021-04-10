// pages/bless/index.js

const app = getApp();
// var server = app.globalData.server + "/bless";
var appid = app.globalData.appid;
const uid = app.globalData.uid;
// const info = app.mainInfo;
const db = wx.cloud.database({env:"*****"}) // 云开发环境id
const bless = db.collection('bless')

// db.collection("MainInfo").get({
//   success: function(res){
//     info = res.data[0]
//   }
// })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // user: {},
    userInfo: {},
    actionSheetHidden: true,
    painting: {},
    shareImage: '',
    qrcode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    // let user=wx.getStorageSync('user')
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo) {
      that.setData({
        userInfo: userInfo,
        // user: user
      })
    }
    // console.log("[--] openid: ", user.openid)

    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '幸福马上到来',
      icon: 'loading',
    });
    bless.count({
      success: function(res) {
        that.setData({
          zanNum: res.total
        })
        console.log(res.total)
      },
      fail: console.error
    })
    bless.get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        wx.hideLoading();
        that.setData({
          zanLog: res.data
        })
        console.log(res.data)
      }
    })
  },
  openActionsheet: function() {
    var self = this;
    self.setData({
      actionSheetHidden: !self.data.actionSheetHidden
    });
  },
  listenerActionSheet: function() {
    var self = this;
    self.setData({
      actionSheetHidden: !self.data.actionSheetHidden
    })
  },
  createPoster: function() {

    wx.navigateTo({
      url: '/pages/poster/index',
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
    console.log("[+] refresh")
    var that = this;
    bless.count({
      success: function(res) {
        that.setData({
          zanNum: res.total
        })
        // console.log(res.total)
      },
      fail: console.error
    })
    bless.get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        that.setData({
          zanLog: res.data
        })
        // console.log(res.data)
      }
    })
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
    var that = this;
    // console.log(that.data);
    return {
      title: "婚礼邀请",
      // imageUrl: "",
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
  bindgetuserinfo: function(e) {
    // console.log("User info:", e.detail.userInfo)
    var that = this;
    // var alreadyZan = false;
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      // let user=wx.getStorageSync('user')
      that.setData({
        userInfo: e.detail.userInfo,
        authBtn: false
      })
      var userInfo = e.detail.userInfo;
      // console.log("[-] openid: ", user.openid)
      bless.where({nickName: userInfo.nickName}).count({ //_openid: user.openid
        success: function(res) {
          if (res.total > 0){
            wx.showToast({
              title: '已经收到啦！',
            })
            // wx.showModal({
            //   title: '感谢您的祝福！',
            //   content: '已经收到过您的祝福啦！',
            //   showCancel: false
            // })
            // alreadyZan = true
          }else{
            bless.add({
              // data 字段表示需新增的 JSON 数据
              data: {
                // 'uid': 1,
                'uid': uid,
                'date': new Date(),
                'nickName': userInfo.nickName,
                'gender': userInfo.gender,
                'language': userInfo.language,
                'city': userInfo.city,
                'province': userInfo.province,
                'country': userInfo.country,
                'avatarUrl': userInfo.avatarUrl,
              },
              success: function(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                wx.showToast({
                  title: '感谢您的祝福！',
                })
                // wx.showModal({
                //   title: '点赞成功',
                //   content: '感谢您的祝福！',
                //   showCancel: false
                // })
                // console.log(res)
                bless.count({
                  success: function(res) {
                    that.setData({
                      zanNum: res.total
                    })
                    console.log(res.total)
                  },
                  fail: console.error
                })
                bless.get({
                  success: function(res) {
                    // res.data 是包含以上定义的两条记录的数组
                    that.setData({
                      zanLog: res.data
                    })
                    console.log(res.data)
                  }
                })
                this.cancelMsg
                wx.startPullDownRefresh()
                wx.stopPullDownRefresh()
              },
              fail: console.error,
              complete: console.log
            })
          }
          console.log(res.total)
        },
        fail: console.error
      })
      // if (alreadyZan){
      //   console.log("[+] Already Zan!")
      // }else{
      //   console.log("[+] First Zan!")
      // }
    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },
/*
  // 送上祝福
  zan: function(event) {
    console.log("Send zan..", event)
    var that = this;

    var userInfo = that.data.userInfo;
    // let user=wx.getStorageSync('user')
    console.log(userInfo)
    var name = userInfo.nickName;
    var face = userInfo.avatarUrl;
    var language = userInfo.language;
    var city = userInfo.city;
    var alreadyZan = false;
    // wx.request({
    bless.count({
      success: function(res) {
        if (res.total > 0){
          console.log("[+] 已经收到过您的祝福啦！", res.total),
          wx.showModal({
            title: '感谢您的再次祝福！',
            content: '已经收到过您的祝福啦！',
            showCancel: false
          })
          alreadyZan = true
        }
        console.log(res.total)
      },
      fail: console.error
    })
    if (alreadyZan){

    }else{
    bless.add({
      // url: server,
      data: {
        'uid': uid,
        'date': new Date(),
        'nickName': userInfo.nickName,
        'gender': userInfo.gender,
        'language': userInfo.language,
        'city': userInfo.city,
        'province': userInfo.province,
        'country': userInfo.country,
        'avatarUrl': userInfo.avatarUrl,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        wx.showModal({
          title: '谢谢',
          content: '收到您的祝福啦！',
          showCancel: false
        })
        console.log(res)
        bless.count({
          success: function(res) {
            that.setData({
              zanNum: res.total
            })
            console.log(res.total)
          },
          fail: console.error
        })
        bless.get({
          success: function(res) {
            // res.data 是包含以上定义的两条记录的数组
            that.setData({
              zanLog: res.data
            })
            console.log(res.data)
          }
        })
        wx.startPullDownRefresh()
        this.cancelMsg
      },
      fail: console.error,
      complete: console.log,
    })
  }
  }
  */
})
