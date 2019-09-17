Page({
    data: {
        info_pack: false,
    },
    onLoad(options){
        let id=options.id
        console.log(id)
        if(id==undefined){
            wx.showLoading();
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Expert/returnExpert',
                success: (res) => {
                    wx.hideLoading();
                    this.setData({
                        list: res.data
                    });
                    console.log(res.data)
                }
            });

        }else{

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
        let info = e.currentTarget.dataset.info.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        this.setData({
            info_pack: true,
            info: info,
        });
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
        
    }
});