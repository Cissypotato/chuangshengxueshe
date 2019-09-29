const app = getApp();
Page({
   data: {
      // title:'',
      // imgs:[],
      item_i: null,
      isLogin: false,
   },
   onLoad: function(options) {
      let id = options.id
      wx.request({
         url: 'https://xczyzx.com/index.php/index/shop/returnDesc?id=' + id,
         data: '',
         header: {},
         method: 'GET',
         dataType: 'json',
         responseType: 'text',
         success: (res) => {
            console.log(res)
            this.setData({
               item_i: res.data,

            })
         },
         fail: function(res) {},
         complete: function(res) {},
      })
      
   },
   onShow: function() {
      let then = this;
      if (wx.getStorageSync("token") == '') {
         then.setData({
            isLogin: false
         });
      } else {
         then.setData({
            isLogin: true
         });
      };
   },
   img_show(e) {
      let now = e.currentTarget.dataset.src;
      let list = [];
      let k = this.data.item_i.img;
      for (var i = 0; i < k.length; i++) {
         list.push(k[i].img);
      };
      wx.previewImage({
         current: now,
         urls: list
      });
   },
   goMake(event) {
      var then = this
      //先判断用户是否登陆
      //然后判断用户是否实名认证
      let isLogin = this.data.isLogin;

      if (isLogin) {
         wx.request({
            url: app.globalData.appUrl + 'index/news_num',
            data: {
               id: wx.getStorageSync("token")
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
               then.setData({
                  state: res.data.info.state
               });
               if (res.data.info.state == '1') {
                  wx.request({
                     url: app.globalData.appUrl + 'order/add_order',
                     data: {
                        uid: wx.getStorageSync("token"),
                        resources_id: event.currentTarget.dataset.id
                     },
                     header: {},
                     method: 'GET',
                     dataType: 'json',
                     responseType: 'text',
                     success: function (res) {
                        app.alert("预订成功")
                     },
                     fail: function (res) { }
                  })
               } else {
                  wx.showModal({
                     title: '提示',
                     content: '未进行实名认证用户无法完成预订，现在就去实名认证吗？',
                     success(res) {
                        if (res.confirm) {
                           wx.navigateTo({
                              url: '/pages/personal/real/real'
                           });
                        } else if (res.cancel) {

                        }
                     }
                  });
               }

            }
         })
      } else {
         wx.showModal({
            title: '提示',
            content: '未登陆进行实名认证用户无法完成预订，现在就去登陆吗？',
            success(res) {
               if (res.confirm) {
                  wx.navigateTo({
                     url: '/pages/personal/login/login'
                  });
               } else if (res.cancel) {

               }
            }
         });
      }
   },
});