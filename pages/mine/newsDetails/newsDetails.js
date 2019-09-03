const app = getApp();
Page({
   data: {
      cont:''
   },
   onLoad: function (options) {
      this.getInfo(options.id)
   },
   getInfo(id){
      wx.request({
         url: 'https://xczyzx.com/index.php/index/news/news_desc',
         data: {
            id:id
         },
         success: res=> {
            console.log(res)
            this.setData({
               cont:res.data
            })
         },
         fail: function(res) {
            app.alert("请求失败请稍后再试")
         }
      })
   }
})