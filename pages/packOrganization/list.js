Page({
    data: {
        info_pack: false,
    },
    onShow: function() { //数据加载
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
    },
    list_click(e) { //打开介绍容器
        let info = e.currentTarget.dataset.info;
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
        
    }
});