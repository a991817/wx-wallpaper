// pages/wallpaper/wallpaper.js
import {
  addVisit
} from '../../services/myWallpaper/my_wallpaper';
Component({
  data: {
    wallpaperList: [], // 壁纸列表
    pageNo: 1, // 当前页数
    pageSize: 9, // 每页壁纸数量
    category: 1, // 请求的tab的类型

    wallpaperLoadStatus: 0,
  },


  privateData: {
    tabIndex: 0,
  },

  methods: {
    onClick(event) {
      const imageUrl = event.currentTarget.dataset.url;
      const resourceId = event.currentTarget.dataset.id;
      wx.previewImage({
        current: imageUrl, // 当前显示图片的http链接
        urls: [imageUrl] // 需要预览的图片http链接列表
      })

      addVisit(resourceId)
    },

    onClose(e) {
      const {
        trigger
      } = e.detail;
      console.log(trigger);
      this.setData({
        visible: false,
      });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      this.setData({
        pageLoading: true,
      });
      this.loadWallpaper(1, 9)
      this.setData({
        pageLoading: false
      });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onReachBottom() {
      // 加载中
      if (this.data.wallpaperLoadStatus === 0) {
        this.setData({
          wallpaperLoadStatus: 1
        })
      }
      // 设置页数
      var pageNo = this.data.pageNo + 1
      this.setData({
        pageNo: pageNo
      })
      // 加载数据
      this.loadWallpaper(pageNo, this.data.pageSize)

    },

    onPageScroll(event) {

    },
    onReTry() {
      console.log("onReTry")
    },

    loadMore() {
      console.log("loadMore")
    },

    onLoad(options) {
      const category = options.category;
      const categoryName = options.categoryName;
      wx.setNavigationBarTitle({
        title: '「' + categoryName + '」' + '壁纸'
      })

      this.setData({
        category: category,
      })

    },

    onShow() {},

    getWallpapers(wallpaperUrlList) {
      var result = []
      var row = []
      for (var i = 0; i < wallpaperUrlList.length; i++) {
        row.push(wallpaperUrlList[i])
        if (row.length == 3) {
          result.push(row)
          row = []
        }
      }
      console.log(result)
      return result
    },

    freshPage() {
      this.setData({
        pageNo: 1,
        pageSize: 9
      })
    },

    loadWallpaper(pageNo, pageSize, fresh = false) {
      if (fresh) {
        this.setData({
          wallpaperList: []
        })
      }
      var that = this
      var wallpaperList = that.data.wallpaperList
      console.log(that.data)
      wx.request({
        url: 'https://wallpaper.airui.life/wallpaper/v1/wallpaper/' + that.data.category + '/' + pageNo + '/' + pageSize, // API的URL
        method: 'GET', // 请求方法为GET
        success: function (res) {
          // 请求成功时的回调函数
          var remoteList = res.data.data
          that.setData({
            wallpaperList: wallpaperList.concat(that.getWallpapers(remoteList)),
            wallpaperLoadStatus: 0
          })
        },
        fail: function (err) {
          // 请求失败时的回调函数
          console.error(err);
        }
      });
    },

  },
});