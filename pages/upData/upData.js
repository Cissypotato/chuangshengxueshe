// pages/upData/upData.js
Page({
   data: {
      isState: 0,
   },
   onLoad: function(options) {

   },
   onShow: function() {
      let token = wx.getStorageSync("token")
      let user_real = wx.getStorageSync("user_real")
      if (!token){
         this.setData({ isState:1 })
      } else if (!user_real){
         this.setData({ isState: 2 })
      }else{
         this.setData({ isState: 0 })
      }
   },
   toUpData(e) {
      let id = e.currentTarget.dataset.id
      if (id == 1) {
          wx.showModal({
              title: '提示',
              content: '您即将进入专家人才资源上传页面，如果您的专家人才已经认证则直接进入课程资源上传页面',
              success(res) {
                  if (res.confirm) {
                      wx.navigateTo({
                          url: './upExpert/upExpert',
                      })
                  } else if (res.cancel) {

                  }
              }
          })
        
      } else if (id == 2) {

          wx.showModal({
              title: '提示',
              content: '您即将进入社会组织资源上传页面，如果您的社会组织已经认证则直接进入项目资源上传页面',
              success(res) {
                  if (res.confirm) {
                      wx.navigateTo({
                          url: './upSociety/upSociety',
                      })
                  } else if (res.cancel) {

                  }
              }
          })
          
       
      } else if (id == 3) {
         wx.navigateTo({
            url: './packUpData/packUpData?id=' + id,
         })
      } else if (id == 4) {
         wx.navigateTo({
            url: './upProduct/upProduct',
         })
      }

   },
   toLogin() {//跳转到登录页
      wx.navigateTo({
         url: '/pages/mine/login/login',
         success: function (res) { },
         fail: function (res) { },
         complete: function (res) { },
      })
   },
   toUserReal() {
      wx.navigateTo({
         url: '/pages/mine/real/real',
         success: function (res) { },
         fail: function (res) { },
         complete: function (res) { },
      })
   }

})