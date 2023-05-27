// pages/categories/categories.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // var categoryList = [
    //   [{
    //     "categoryName": "美女",
    //     "category": 2,
    //     "imgUrl": "https://mmbiz.qpic.cn/mmbiz_jpg/XOIemPYpuC58YVOJaMjyT7qmwtqQp4Y51vStIhm1ggq9hKWzwA0Xdp2BIBKLRfWVy2AxnDRWWRC5giar0bMy2dQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1"
    //   }, {
    //     "categoryName": "帅哥",
    //     "category": 1,
    //     "imgUrl": "https://mmbiz.qpic.cn/mmbiz_jpg/XOIemPYpuC58YVOJaMjyT7qmwtqQp4Y51vStIhm1ggq9hKWzwA0Xdp2BIBKLRfWVy2AxnDRWWRC5giar0bMy2dQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1"
    //   }, {
    //     "categoryName": "情侣",
    //     "category": 4,
    //     "imgUrl": "https://mmbiz.qpic.cn/mmbiz_jpg/XOIemPYpuC58YVOJaMjyT7qmwtqQp4Y51vStIhm1ggq9hKWzwA0Xdp2BIBKLRfWVy2AxnDRWWRC5giar0bMy2dQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1"
    //   }, ]
    // ]
    this.loadCategory()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onClickcategory(event) {
    const category = event.currentTarget.dataset.category;
    const categoryName = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/innerWallpaper/innerWallpaper?category=' + category + "&categoryName=" + categoryName,
      fail: function (err) {
        console.error(err);
      }
    })
  },

  getCategoryList(categoryList) {
    var result = []
    var row = []
    for (var i = 0; i < categoryList.length; i++) {
      row.push(categoryList[i])
      if (row.length == 3) {
        result.push(row)
        row = []
      }
    }
    return result
  },

  loadCategory() {
    var that = this
    var categoryList = this.data.categoryList
    wx.request({
      url: 'https://wallpaper.airui.life/wallpaper/v1/categories/1', // API的URL
      method: 'GET', // 请求方法为GET
      success: function (res) {
        var remoteList = res.data.data
        that.setData({
          categoryList: categoryList.concat(that.getCategoryList(remoteList))
        })
      },
      fail: function (err) {
        // 请求失败时的回调函数
        console.error(err);
      }
    });
  },

})