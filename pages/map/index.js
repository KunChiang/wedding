// pages/map/index.js
let plugin = requirePlugin("myPlugin");
const app = getApp();
const uid = app.globalData.uid;
// var server = app.globalData.server + "/map";
var appid = app.globalData.appid;
// const info = app.mainInfo;
const db = wx.cloud.database({env:"*****"}) // 云开发环境id
const guests = db.collection('guests')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    auth: true,
    msgSta: false,
    signSta: false,
    userInfo: {},
    mainInfo: {},
    actionSheetHidden: true,
  },
  markertap(e) {
    // console.log(e)
    var lng = app.globalData.lon
    var lat = app.globalData.lat
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      scale: 18,
      name: this.data.mainInfo.hotel,
      address: this.data.mainInfo.address,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    var lng = app.globalData.lon
    var lat = app.globalData.lat

    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '幸福马上出现',
      icon: 'loading',
    });
    db.collection("MainInfo").get({
      success: function(res){
        wx.hideLoading();
        that.setData({
          mainInfo: res.data[0],
          lng: lng, // 全局属性，用来取定位坐标
          lat: lat,
          markers: [{
            iconPath: "/images/nav.png",
            id: 0,
            latitude: lat, // 页面初始化 options为页面跳转所带来的参数 
            longitude: lng,
            width: 50,
            height: 50
          }],
        });
      }
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
  callhe: function(event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.he_tel
    })
  },
  callshe: function(event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.she_tel
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })

  },
  bindgetuserinfo: function(e) {
    // console.log(e.detail.userInfo)
    var that = this;
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        userInfo: e.detail.userInfo,
        auth: true
      })
      // console.log(1, e.detail.userInfo)
      //that.foo()
      // that.formSubmit(e)

    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
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

  formSubmit(event) {
    // console.log("submit...", event)
    var that = this

    var userInfo = that.data.userInfo;
    var nickname = userInfo.nickName;
    var face = userInfo.avatarUrl;

    var name = event.detail.value.name;
    if (name == '') {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none'
      })
      return;
    }
    var tel = event.detail.value.tel;
    if (tel == '') {
      wx.showToast({
        title: '请填写您的电话',
        icon: 'none'
      })
      return;
    }
    var reg_tel = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    if (!reg_tel.test(tel)) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
      return;
    }
    var plan = event.detail.value.plan;
    var extra = event.detail.value.extra;
    guests.where({nickname:nickname, face:face}).get({
      success: function(res) {
        // 重复提交，更新提交内容
        if (res.data.length > 0){
          wx.showModal({
            title: '您已经提交过啦',
            content: '要更新出席信息吗？',
            success (yes) {
              if (yes.confirm) {
                guests.doc({_id:res.data._id}).update({
                  data: {
                    'uid': uid,
                    // 'appid': appid,
                    'date': new Date(),
                    'nickname': nickname,
                    'face': face,
                    'name': name,
                    'tel': tel,
                    'plan': plan,
                    'extra': extra
                  },
                  success: function(sub) {
                    wx.showToast({
                      title: '提交成功',
                    })
                  }
                })
              } else if (yes.cancel) {
                wx.showToast({
                  title: '已取消提交',
                })
              }
            }
          })
        }
      
      else {
        // }else{
          guests.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              'uid': uid,
              // 'appid': appid,
              'date': new Date(),
              'nickname': nickname,
              'face': face,
              'name': name,
              'tel': tel,
              'plan': plan,
              'extra': extra
            },
            success: function(res) {
              console.log("提交成功！")
              wx.showToast({
                title: '提交成功',
              })
              wx.startPullDownRefresh()
              wx.stopPullDownRefresh()
              // console.log(res)
              this.cancelMsg
            },
            fail: console.error,
            complete: console.log
          })
        }
      }
    })
  },
})
