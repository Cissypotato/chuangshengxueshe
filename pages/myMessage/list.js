const app = getApp();
Page({
   data: {
      isLogin: false,
       info_pack: false,
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
       wx.showLoading({
           title: '',
       })
       
       wx.request({
           url: 'https://xczyzx.com/index.php/index/news/del_news',
           data: {id},
           success: (res)=> {
               if (info.length == 0) {
                   setTimeout(() => {
                       this.setData({ info,isNew:false })
                   }, 800)
                }else{
                   setTimeout(() => {
                       this.setData({ info })
                   }, 800)
                }
              
               
           },
           complete:(res)=>{
               console.log(this.data.info)
               setTimeout(() => {
                   wx.hideLoading()
               }, 800)
              
           }
       })
   },
//    newsDetails(e){
//       wx.navigateTo({
//          url: '/pages/mine/newsDetails/newsDetails?id=' + e.currentTarget.dataset.id,
//       })
//    }
    list_click(e) { //打开介绍容器
        let info = e.currentTarget.dataset.info
        this.setData({
            info_pack: true,
            content: info,
        });
    }, 
    close_info() { //关闭介绍容器
        this.setData({
            info_pack: false
        });
    },
    toMyOrder(){
        wx.navigateTo({
            url: './myOrder/order'
        })
    }
})