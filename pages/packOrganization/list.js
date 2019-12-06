Page({
    data: {
        info_pack: false,
    },
    onLoad(options) {
        let id = options.id
        console.log(id)
        if (id == undefined) {
            wx.showLoading();
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Society/returnSociety',
                success: (res) => {
                    wx.hideLoading();
                    this.setData({
                        list: res.data
                    });
                    console.log(res.data)
                }
            });

        } else {
            wx.showLoading();
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Society/returnSociety',
                data:{id:id},
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
        
    // },
    list_click(e) { //打开介绍容器
        let info = e.currentTarget.dataset.info.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
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
              content: '您即将进入社会组织资源上传页面，如果您的社会组织已经认证则直接进入项目资源上传页面',
              success(res) {
                  if (res.confirm) {
                      wx.navigateTo({
                          url: '/pages/packOrganization/upData',
                      });
                  } else if (res.cancel) {

                  }
              }
          })
        
    },
    onShareAppMessage: function () {
        return {
            title: "社会组织",
            // desc: '志愿活动分享',
            path: 'pages/packOrganization/list',

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