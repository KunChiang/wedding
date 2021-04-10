// pages/chat/index.js
const app = getApp();
const uid = app.globalData.uid;
// var server = app.globalData.server + "/comment";
var appid = app.globalData.appid;
// const info = app.mainInfo;
const db = wx.cloud.database({env:"*****"}) // 云开发环境id
const comments = db.collection('comments')
const guests = db.collection('guests')
// const bless = db.collection('bless')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // user: {},
    userInfo: {},
    inputValue: '',
    auth: false,
    msgSta: false,
    signSta: false,
    mainInfo: {},
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
    let userInfo = wx.getStorageSync('userInfo')
    // let user=wx.getStorageSync('user')
    if (userInfo) {
      this.setData({
        // auth: true,
        userInfo: userInfo,
        // user: user
      })
    }
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '幸福马上到来',
      icon: 'loading',
    });
    comments.count({
      success: function(res) {
        that.setData({
          chatNum: res.total
        })
      },
      fail: console.error
    })
    comments.orderBy('date', 'desc').get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        var num = that.data.chatNum
        var list = res.data
        var for_num = (num / 20).toFixed()
        for(var i=1; i<for_num; i++){
          comments.orderBy('date', 'desc').skip(20*i).get().then(res => {
            // console.log("[1] ", res.data)
            list.push.apply(list, res.data)
            // console.log(num, list)
            console.log("[+]", i)
            that.setData({
              // chatNum: num,
              chatList: list
            })
          })
          .catch(console.error)
        }
        // console.log(num, list)
        that.setData({
          // chatNum: num,
          chatList: list
        })
      }
    })
    comments.watch({
      onChange: function(snapshot) {
        // console.log('snapshot', snapshot)
        comments.orderBy('date', 'desc').get({
          success: function(res) {
            // wx.hideLoading();
            // res.data 是包含以上定义的两条记录的数组
            // console.log("----", res)
            var num = that.data.chatNum
            var list = res.data
            var for_num = (num / 20).toFixed()
            for(var i=1; i<for_num; i++){
              comments.orderBy('date', 'desc').skip(20*i).get().then(res => {
                list.push.apply(list, res.data)
                // console.log(num, list)
                console.log("[-]", i)
                that.setData({
                  // chatNum: num,
                  chatList: list
                })
              })
              .catch(console.error)
            }
          }
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
    db.collection("MainInfo").get({
      success: function(res){
        wx.hideLoading();
        that.setData({
          mainInfo: res.data[0]
        })
      }
    })
  },
  leaveMsg: function() {
    this.setData({
      msgSta: true,
      signSta: false
    })
  },
  signIn: function() {
    this.setData({
      signSta: true,
      msgSta: false
    })
  },
  cancelMsg: function() {
    this.setData({
      signSta: false,
      msgSta: false
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // var that = this;
    // console.log(that.data);
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
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })

  },
  bindgetuserinfo: function(e) {
    console.log("Get user info")
    var that = this;
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo,
        auth: true
      })
      // console.log(1, e.detail.userInfo)
      that.foo()
    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },
  foo: function() {
    var that = this
    // console.log("Comment...", that.data.auth)
    // console.log(2, that.data.inputValue)
    if (that.data.inputValue) {
      //留言内容不是空值

      var userInfo = that.data.userInfo;
      var name = userInfo.nickName;
      var face = userInfo.avatarUrl;
      var words = that.data.inputValue;
      comments.add({
        // data 字段表示需新增的 JSON 数据
        data: {
      // wx.request({
      //   url: server,
      //   data: {
          'uid': uid,
          // 'appid': appid,
          'date': new Date(),
          'nickname': name,
          'face': face,
          'words': words
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          // wx.showModal({
          //   title: '提示',
          //   content: "提交成功！感谢你的留言！",
          //   showCancel: false
          // })
          wx.showToast({
            title: '留言成功啦！',
          })
          comments.orderBy('date', 'desc').get({
            success: function(res) {
              // res.data 是包含以上定义的两条记录的数组
              that.setData({
                chatNum: res.data.length,
                chatList: res.data
              })
            }
          })
          this.cancelMsg
        },
        fail: console.error,
        complete: console.log
      })
    } else {
      //Catch Error
      wx.showToast({
        title: '您还没有填写内容',
        icon: 'none'
      })
      return;
    }
    console.log("reset data...")
    that.setData({
      inputValue: '' //将data的inputValue清空
    });
    return;
  },
})
