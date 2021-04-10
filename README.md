# 婚礼请柬小程序

Fork from [wedding](https://gitee.com/roberthuang123/wedding). 可参考原作者文章食用。

本项目一些修改：

- 修改了页面，原本5个页面，本项目改为4个，页面内容也稍作修改
- 新增了点赞计数动画（相册页面）

## 食用方法

本项目需要配合云开发食用。

将云开发id配置到代码里：

```js
const db = wx.cloud.database({env:"*****"}) // 云开发环境id
```

### 数据库

1. 创建集合`MainInfo`，数据结构如下：

```json
{
    "_id": "*****",
    "he": "男方姓名",
    "she": "女方姓名",
    "date": "2021.01.01",
    "lunar": "庚子年冬月十八",
    "hotel": "xx国际酒店",
    "address": "某省某市xx国际酒店x楼",
    "she_tel": "188****1234",
    "he_tel": "177****4567",
    "share": "cloud://****/cover.jpg", # 云开发存储路径
    "qrimg": "/images/qrimg.jpg", # 小程序二维码图片
    "thumb": "/images/thumb.jpg", # 分享海报封面图片（好看的双人大头结婚照
    "cover": "cloud://****/cover.jpg", # 云开发存储路径
    "music_url": "cloud://****/咱们结婚吧.mp3", # 背景音乐文件路径，云开发存储路径
    "album": [ # 相册图片列表
        "cloud://****/album/001.jpg", # 云开发存储路径
        "cloud://****/album/002.jpg",
        "cloud://****/album/003.jpg",
    	# ...可以随意增减图片
    ]
}
```

2. 创建集合`comments`，用于保存亲友发表的祝福语句
3. 创建集合`guests`，用于保存登记的访客信息
4. 创建集合`zanCount`，用于保存赞的数量，数据结构为：`{"zanFrom":"blessZan", "zanNum":0}`

其他设置：酒店经纬度在`app.js`文件中设置（其实也可以改到数据库`MainInfo`里

```
  globalData: {
    userInfo: null,

    // 下面填写酒店经纬度
    lat: 30.6789,
    lon: 108.01234,

    appid: '******', //小程序appid
    uid: 1,
  }
```

### 存储

这里将相册和背景音乐都上传到云存储，然后只需要在数据库`MainInfo`里配置相册和背景音乐文件路径即可。

## 参考

- [wedding](https://gitee.com/roberthuang123/wedding)
- [like](https://github.com/392736970/likeFix)