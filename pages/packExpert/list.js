// pages/packExpert/list.js
Page({
    data: {
        list:[],
        isList:false
    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    onShow: function () {

      wx.request({
        url: 'https://xczyzx.com/index.php/index/expert/returnExpert',
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          console.log(res.data)
          this.setData({
            list: res.data
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })


    },
    praise_click(e){
        let id = e.currentTarget.dataset.id;
        //这里要先判断用户是否登录
        if (wx.getStorageSync("token") == '') {
            wx.showModal({
                title: '提示',
                content: '未登陆用户无法完成此操作，现在就去登陆吗？',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/mine/login/login'
                        });
                    } else if (res.cancel) {

                    }
                }
            });
        } else {
            //这里发起点赞的AJAX请求
            
            console.log(e.currentTarget.dataset.id);
        };
    },
    info_click(e){
        //跳转到指定ID的的文章介绍页

      console.log(e.currentTarget.dataset.id)  
      let id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/packExpert/article/article?id='+id
      });

    },
    yuyue_click(e){
        //发送ID到后台请求业务逻辑
        getApp().alert('ok')
    },
})