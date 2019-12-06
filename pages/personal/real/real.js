const app = getApp()
Page({
   data: {

   },
   onLoad: function (options) {

   },
   onShow: function () {

   },
   formSubmit(e){
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let name = e.detail.value.real_name
      let card = e.detail.value.real_number
      if(!regIdNo.test(card)){
          wx.showToast({
              title:"请填写正确的身份证号码",
              icon: 'none',
              duration: 2000,
          })
      }else{
          wx.request({
              url: app.globalData.appUrl + 'index/real_name',
              data: {
                  uid: wx.getStorageSync("token"),
                  name: name,
                  card: card
              },
              success: (res) => {
                //   console.log(res.data.msg)
                  let msg = res.data.msg
                  if (res.data.code) {
                      wx.navigateBack({
                          delta: 1,
                          success: () => {
                              wx.showToast({
                                  title: msg,
                                  icon: 'none',
                                  duration: 1000,
                              })
                          }
                      })
                  } else {
                      wx.showToast({
                          title: msg,
                          icon: 'none',
                          duration: 2000,
                      })
                  }
              },
              fail: function (res) {
                  wx.showToast({
                      title: '请求失败请稍后再试',
                      icon: 'none',
                      duration: 1000,
                  })
              },
          })

      }
    
   }
})