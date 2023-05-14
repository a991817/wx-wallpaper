// pages/wallpaper/wallpaper.js
import Toast from 'tdesign-miniprogram/toast/index';
Component({
  data: {
    headimgList: [], // 壁纸列表
    pageNo: 1, // 当前页数
    pageSize: 21, // 每页壁纸数量
    category: 1, // 请求的tab的类型
    stickyStyle: '', // 初始置顶内容的样式
    imageSize: "", // 图片样式

    visible: false,
    showIndex: false,
    closeBtn: false,
    deleteBtn: false,
    images: [],
    // page
    imgSrcs: [],
    tabList: [],
    wallpaperLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },
  },


  privateData: {
    tabIndex: 0,
  },

  methods: {
    onClick(event) {
      const imageUrl = event.currentTarget.dataset.url;
      wx.previewImage({
        current: imageUrl, // 当前显示图片的http链接
        urls: [imageUrl] // 需要预览的图片http链接列表
      })
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
      this.loadHeadImg(1, 15)
      this.loadTabs(2)
      this.setData({
        pageLoading: true,
        imgSrcs: this.getHeadbanner(),
      });
      this.setData({
        pageLoading: false
      });
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
      this.loadHeadImg(pageNo, this.data.pageSize)

    },

    onPageScroll(event) {
      var threshold = 0; // 获取置顶的阈值
      var scrollTop = event.scrollTop;
      var stickyStyle = '';

      if (scrollTop >= threshold) {
        stickyStyle = 'position: fixed; top: 0; left: 0; width: 100%;';
      }

      this.setData({
        stickyStyle: stickyStyle
      });
    },
    onReTry() {
      console.log("onReTry")
    },

    loadMore() {
      console.log("loadMore")
    },

    onShow() {
      this.getTabBar().init();
    },

    getHeadbanner() {
      return [
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner1.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner2.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner3.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner4.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner6.png',
      ]
    },
    getHeadImg(wallpaperUrlList) {
      console.log("getHeadImg")
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

    getWallpaperTitle() {
      return [{
        text: '精选推荐',
        key: 0,
      }, {
        text: '风景',
        key: 1,
      }, {
        text: '插画',
        key: 2,
      }, {
        text: '人气榜',
        key: 3,
      }, {
        text: '好评榜',
        key: 4,
      }, {
        text: 'RTX 30',
        key: 5,
      }, {
        text: '手机也疯狂',
        key: 6,
      }]
    },

    tabChange(e) {
      this.setData({
        category: e.detail.value
      })
      this.freshPage()
      this.loadHeadImg(this.data.pageNo, this.data.pageSize, true)
    },

    freshPage() {
      this.setData({
        pageNo: 1,
        pageSize: 12
      })
    },

    loadHeadImg(pageNo, pageSize, fresh = false) {
      if (fresh) {
        this.setData({
          headimgList: []
        })
      }
      console.log(pageNo + "-" + pageSize)
      var that = this
      var headimgList = that.data.headimgList
      wx.request({
        url: 'http://106.52.82.169:8090/wallpaper/v1/headImg/' + that.data.category + '/' + pageNo + '/' + pageSize, // API的URL
        method: 'GET', // 请求方法为GET
        success: function (res) {
          // 请求成功时的回调函数
          console.log(res.data); // 打印API的响应数据
          var remoteList = res.data.data
          that.setData({
            headimgList: headimgList.concat(that.getHeadImg(remoteList)),
            wallpaperLoadStatus: 0
          })
        },
        fail: function (err) {
          // 请求失败时的回调函数
          console.error(err);
        }
      });
    },

    loadTabs(resourceType) {
      var that = this
      wx.request({
        url: 'http://106.52.82.169:8090/wallpaper/v1/tabs/' + resourceType, // API的URL
        method: 'GET', // 请求方法为GET
        success: function (res) {
          var remoteList = res.data.data
          console.log(res.data)
          that.setData({
            tabList: remoteList
          })
        },
        fail: function (err) {
          // 请求失败时的回调函数
          console.error(err);
        }
      });
    }
  },
});