const app = getApp();
Page({
   data: {
      text: "获取验证码",
      timer: '',
      countDownNum: 60,
      isCode: true,
      tel: '',
      sms: '',
      yzm: '',
      code: '',
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
   },
   onLoad: function(options) {
      let then = this
      wx.login({
         success: function(res) {
            then.setData({
               code: res.code
            })
         },
      })
   },
   getPhoneNumber: function(e) {
      let then = this
      if (e.detail.errMsg == "getPhoneNumber:ok") {
         wx.request({
            url: app.globalData.appUrl + 'user/create_user',
            data: {
               code: then.data.code,
               iv: e.detail.iv,
               encryptedData: e.detail.encryptedData,
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
               wx.setStorageSync("token", res.data.token)
               wx.navigateBack({
                  delta: 1,
                  success: function(res) {
                     wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 1000,
                     })
                  }
               })
            },
            fail: function(res) {
               wx.showToast({
                  title: '请求失败请稍后再试',
                  icon: 'none',
                  duration: 1000,
               })
            },
         })
      } else {
         wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1000,
         })
      }

   },
   tel(e) {
      let then = this
      then.setData({
         tel: e.detail.value
      })
   },
   code(e) {
      let then = this
      then.setData({
         yzm: e.detail.value
      })
   },
   getCode(e) {
      let then = this
      let tel = then.data.tel
      let countDownNum = then.data.countDownNum;
      let myreg = app.globalData.myreg
      let isCode = then.data.isCode
      if (isCode) {
         if (myreg.test(tel)) {
            wx.request({
               url: app.globalData.appUrl + 'sms/sms',
               data: {
                  tel: tel
               },
               method: 'GET',
               dataType: 'json',
               responseType: 'text',
               success: function(res) {
                  wx.showToast({
                     title: '发送成功请注意查收',
                     icon: 'none',
                     duration: 1000,
                     success: function(event) {
                        then.setData({
                           isCode: false,
                           sms: res.data.info,
                           timer: setInterval(function() {
                              countDownNum--;
                              then.setData({
                                 text: countDownNum + "s"
                              })
                              if (countDownNum == 0) {
                                 clearInterval(then.data.timer);
                                 then.setData({
                                    text: "重新发送",
                                    isCode: true,
                                    countDownNum: 60
                                 })
                              }
                           }, 1000)
                        })
                     },
                  })

               },
               fail: function(res) {
                  wx.showToast({
                     title: '请求失败请稍后再试',
                     icon: 'none',
                     duration: 1000,
                  })
               },
            })
         } else {
            wx.showToast({
               title: '请填写正确的手机号',
               icon: 'none',
               duration: 1000,
            })
         }
      } else {
         wx.showToast({
            title: '请勿重复操作',
            icon: 'none',
            duration: 1000,
         })
      }
   },
   but_sub(e) {
      let then = this
      let sms = then.data.sms
      let yzm = then.data.yzm
      if (sms == yzm && sms !== '' && yzm !== '') {
         wx.request({
            url: app.globalData.appUrl + 'user/login_phone',
            data: {
               tel: then.data.tel
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
               console.log(res)
               wx.setStorageSync("token", res.data.token)
               wx.navigateBack({
                  delta: 1,
                  success: function(res) {
                     wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 1000,
                     })
                  }
               })
            },
            fail: function(res) {
               wx.showToast({
                  title: '请求失败请稍后再试',
                  icon: 'none',
                  duration: 1000,
               })
            },
         })
      } else {
         wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 1000,
         })
      }

   }
})