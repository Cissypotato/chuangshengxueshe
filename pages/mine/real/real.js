const app = getApp()
Page({
   data: {

   },
   onLoad: function (options) {

   },
   onReady: function () {

   },
   onShow: function () {

   },
   formSubmit(e){
      let name = e.detail.value.real_name
      let card = e.detail.value.real_number
      wx.request({
         url: app.globalData.appUrl + 'index/real_name',
         data: {
            uid: wx.getStorageSync("token"),
            name:name,
            card: card
         },
         method: 'GET',
         dataType: 'json',
         responseType: 'text',
         success: function(res) {
            console.log(res)
            if(res.data.code){
               wx.navigateBack({
                  delta: 1,
                  success:function(){
                     wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1000,
                     })
                  }
               })
            }else{
               wx.showToast({
                  title: 'res.data.msg',
                  icon: 'none',
                  duration: 1000,
               })
            }
         },
         fail: function(res) {
            wx.showToast({
               title: '请求失败请稍后再试',
               icon: 'none',
               duration: 1000,
            })
         },
      })
   }
})