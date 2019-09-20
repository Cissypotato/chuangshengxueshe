const app = getApp();
Page({
   data: {
      isLogin: false,
   },
   onShow: function(options) {
      let token = wx.getStorageSync("token")
      if (token == '') {
         wx.showModal({
            title: '提示',
            content: '您尚未登录，无法查看历史消息，现在去登录吗？',
            success(res) {
               if (res.confirm) {
                  wx.navigateTo({
                     url: '/pages/personal/login/login',
                  })
               } else if (res.cancel) {
                  wx.navigateTo({
                     url: '/pages/index/index',
                  })
               }
            }
         });
      } else {
         this.dataInfo(token);
      }
   },
   dataInfo(token) {
      let then = this
      wx.request({
         url: app.globalData.appUrl + 'news/my_news',
         data: {
            id: token
         },
         success: function(res) {
            console.log(res)
            then.setData({
               info: res.data.info,
               isNew: res.data.state
            })
         },
      })
   },
   del(e){
       let id =e.currentTarget.dataset.id
       let idx = e.currentTarget.dataset.idx
       let info=this.data.info
       info.splice(idx,1)
       wx.request({
           url: 'https://xczyzx.com/index.php/index/news/del_news',
           data: {id},
           success: (res)=> {
               this.setData({info})
           },
       })
   }
//    newsDetails(e){
//       wx.navigateTo({
//          url: '/pages/mine/newsDetails/newsDetails?id=' + e.currentTarget.dataset.id,
//       })
//    }
})