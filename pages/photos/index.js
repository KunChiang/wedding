//index.js
//获取应用实例
const app = getApp();
const uid = app.globalData.uid;
const zan_id = app.globalData.zan_id;
// var server = app.globalData.server + "/album";
var appid = app.globalData.appid;
const db = wx.cloud.database({env:"*****"}) // 云开发环境id
const comments = db.collection('comments')
const zan = db.collection('zanCount')
const _ = db.command
const MAX = 10000
// const info = app.mainInfo;

Page({
  data: {
    imgAnimation: "",
    userInfo: {},
    slideList: [],
    mainInfo: {},
    count: 0,
    wan: false, // count 是否过万
    zCount: 0
  },
  clickHandler: function() {
    var that = this;
    zan.doc(zan_id).update({
      data: {
        zanNum: _.inc(1)
      },
      success: function(res) {
        var num = res.data.zanNum;
        if (num < MAX){
          that.setData({
            count: num,
            zCount: num,
            wan: false,
          })
        } else {
          that.setData({
            count: num,
            wan: true,
            zCount: (num / MAX).toFixed(2)
          })
        }
      },
      fail: console.error
    })
  },

  onLoad: function() {
    var that = this
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '幸福马上到来',
      icon: 'loading',
    });
    zan.doc(zan_id).watch({
      onChange: function(snapshot) {
        // console.log('snapshot', snapshot)
        // that.setData({
        //   count: snapshot.docs[0].zanNum
        // })
        var num = snapshot.docs[0].zanNum;
        if (num < MAX){
          that.setData({
            count: num,
            zCount: num,
            wan: false,
          })
        } else {
          that.setData({
            count: num,
            wan: true,
            zCount: (num / MAX).toFixed(1)
          })
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
    // zan.doc(zan_id).get({
    //   success: function(res){
    //     console.log("[+] zan count get: ", res.data)
    //     that.setData({
    //       count: res.data.zanNum
    //     })
    //   }
    // })
    db.collection("MainInfo").get({
      success: function(res){
        wx.hideLoading();
        that.setData({
          mainInfo: res.data[0],
          slideList: res.data[0].album
        })
      }
    })
  },
  onReady: function() {
    // 页面渲染完成

  },
  onShow: function() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.mainInfo.he+"&"+that.data.mainInfo.she+"的婚礼邀请函",
      imageUrl: that.data.mainInfo.share,
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

  saveImg(url){
    wx.cloud.downloadFile({
      fileID: url, // 文件 ID
      success: res => {
        // 返回临时文件路径
        // console.log(res.tempFilePath),
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:(res)=> { 
            wx.showToast({
              title: '保存成功',
            })
            // console.log(res);
          },
        })
      },
      fail: console.error
    })
  },
  saveImage: function(e) {
    var that = this;
    let url = e.currentTarget.dataset.imgurl;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:()=> {
              // 同意授权
              that.saveImg(url);
            },
            fail: (res) =>{
              console.log(res);
            }
          })
        }else{
          // 已经授权了
          wx.showModal({
            title: '保存',
            content: '要保存这张照片吗？',
            success (res) {
              if (res.confirm) {
                // console.log('用户点击确定');
                that.saveImg(url);
              } else if (res.cancel) {
                wx.showToast({
                  title: '取消保存',
                })
                // console.log('用户点击取消');
              }
            }
          })  
        }
      },
      fail: (res) =>{
        console.log(res);
      }
    }) 
  },
})
