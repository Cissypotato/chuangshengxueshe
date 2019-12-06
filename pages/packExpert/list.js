Page({
    data: {
        isLogin:false,
        info_pack: false,
    },
    onLoad(options){
        let id=options.id 
        // console.log(id)
        let token = wx.getStorageSync("token")
        console.log(id)
        if(id){
            wx.showLoading();
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Expert/returnExpert',
                data: { id: id },
                success: (res) => {
                    wx.hideLoading();
                    this.setData({
                        list: res.data,
                        eid: id
                    });
                    console.log(res.data)
                }
            });

        }else{
            wx.showLoading();
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Expert/returnExpert',
                // data:{id:id},
                success: (res) => {
                    wx.hideLoading();
                    this.setData({
                        list: res.data
                    });
                    console.log(res.data)
                }
            });

        }
    },
    // onShow: function() { //数据加载
    //     wx.showLoading();
    //     wx.request({
    //         url: 'https://xczyzx.com/index.php/index/Expert/returnExpert',
    //         success: (res) => {
    //             wx.hideLoading();
    //             this.setData({
    //                 list: res.data
    //             });
    //             console.log(res.data)
    //         }
    //     });
    // },
    list_click(e) { //打开介绍容器
        // let info = e.currentTarget.dataset.info.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        // let img = e.currentTarget.dataset.img
        let id = e.currentTarget.dataset.id
        // console.log(id)
        // this.setData({
        //     info_pack: true,
        //     info: info,
        //     expert_img:img,
        //     expert_id:id
        // });
        wx.navigateTo({
            url: './list-detail?id='+id,

        })
    },
    close_info() { //关闭介绍容器
        this.setData({
            info_pack: false
        });
    },
    up_data() { //打开数据上传页面
        wx.showModal({
              title: '提示',
              content: '您即将进入专家人才上传页面，如果您的专家人才已经认证则直接进入课程资源上传页面',
              success(res) {
                  if (res.confirm) {
                      wx.navigateTo({
                          url: '/pages/packExpert/upData',
                      });
                  } else if (res.cancel) {

                  }
              }
          })
        
    },
    goMake(event) {
        var then = this
        //先判断用户是否登陆
        //然后判断用户是否实名认证
        // let isLogin = this.data.isLogin;
        // console.log(isLogin)
        let id=event.currentTarget.dataset.id
        if (wx.getStorageSync("token")){
            wx.request({
                url: 'https://xczyzx.com/index.php/index/about/about_expert',
                data:{
                    uid: wx.getStorageSync("token"),
                    expert_id: id
                },
                success:(res)=>{
                    // console.log(res)
                    // console.log(res.data.info)
                    wx.showToast({
                    title: res.data.info,
                    icon: 'success',
                    duration: 2000,
                    complete:()=>{
                        if(res.data.state){
                            setTimeout(() => {
                                this.onLoad({id:this.data.eid})
                            }, 2000)
                        }  
                    }
                    });
                }
            })
        }else {
            wx.showModal({
                title: '提示',
                content: '未进行登录，现在就去登录吗？',
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
    onShareAppMessage: function () {
        return {
            title: "专家人才",
            // desc: '志愿活动分享',
            path: 'pages/packExpert/list',

            success: (res) => {
                // 转发成功
                console.log('分享成功')
                // this.shareClick();
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
});