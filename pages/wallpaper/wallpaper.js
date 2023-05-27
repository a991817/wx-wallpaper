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
    stickyStyle: '', // 初始置顶内容的样式
    tabTop: 0,

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
    // 轮播图设置
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'aspectFill'
    },
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
      this.loadTabs(1)
      this.loadBanners()
      this.setData({
        pageLoading: false
      });

      // 创建选择器查询对象
      // const query = wx.createSelectorQuery();

      // query.select('.wallpaper-page-tabs').boundingClientRect(); // 选择目标元素
      // var that = this
      // query.exec(function (res) {
      //   that.setData({
      //     tabTop: res[0].top
      //   })
      // })
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
      var threshold = 992; // 获取置顶的阈值
      var scrollTop = event.scrollTop;
      var stickyStyle = '';

      // const query = wx.createSelectorQuery();
      // query.select('.wallpaper-page-tabs').boundingClientRect(); // 选择目标元素
      // var that = this
      // query.exec(function (res) {
      //   const targetTop = res[0].top; // 目标元素的上边界距离视口顶部的距离 
      //   if (targetTop <= 0) {
      //     stickyStyle = 'position: fixed; top: 32px; left: 0; width: 100%;';
      //     that.setData({
      //       stickyStyle: stickyStyle
      //     });
      //   } else if (targetTop > 0 && scrollTop < that.data.tabTop) {
      //     stickyStyle = '';
      //     that.setData({
      //       stickyStyle: stickyStyle
      //     });
      //   }
      // });

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

    getBanners() {
      return [
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner1.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner2.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner3.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner4.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png',
        'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner6.png',
      ]
    },
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
      return result
    },

    tabChange(e) {
      this.setData({
        category: e.detail.value
      })
      this.freshPage()
      this.loadWallpaper(this.data.pageNo, this.data.pageSize, true)
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

    loadTabs(resourceType) {
      var that = this
      wx.request({
        url: 'https://wallpaper.airui.life/wallpaper/v1/tabs/' + resourceType, // API的URL
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
    },

    onClickCategories() {
      wx.navigateTo({
        url: '/pages/categories/categories',
      });
    },

    onClickLatest() {
      wx.navigateTo({
        url: '/pages/innerWallpaper/innerWallpaper?category=99&categoryName=最新',
      });
    },
    onClickHot() {
      wx.navigateTo({
        url: '/pages/innerWallpaper/innerWallpaper?category=98&categoryName=最热',
      });
    },

    loadBanners() {
      var that = this
      wx.request({
        url: 'https://wallpaper.airui.life/wallpaper/v1/banners', // API的URL
        method: 'GET', // 请求方法为GET
        success: function (res) {
          var remoteList = res.data.data
          console.log(res.data)
          that.setData({
            imgSrcs: remoteList
          })
        },
        fail: function (err) {
          // 请求失败时的回调函数
          console.error(err);
        }
      });
    },
    async addVisit(resourceId) {
      wx.request({
        url: 'https://wallpaper.airui.life/wallpaper/v1/resource/visit', // 请求的 URL
        method: 'POST', // 请求方法为 POST
        data: {
          resource_id: resourceId,
        },
        success: function (res) {
          console.log(res.data); // 输出响应数据
          // 处理请求成功的逻辑
        },
      });
    }

  },
});