var app = getApp();
Page({
   data: {
      page_show: false,
   },
   onLoad: function(options) {
      let k = options.id;
      this.dataInfo(k);
      wx.showLoading({
         title: '加载中',
      });
   },
   dataInfo: function(id) {
      var then = this
      wx.request({
         url: app.globalData.appUrl + 'notice/notice_desc',
         data: {
            id: id
         },
         success: function(res) {
            wx.hideLoading();
            then.setData({
               page_show: true,
               info: res.data,
               content: res.data.content.replace(/\<img/gi, '< img style="max-width:100%;height:auto;display:block;margin:0 auto;"')

            });
         }
      })
   }
})