export function addVisit(resourceId) {
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