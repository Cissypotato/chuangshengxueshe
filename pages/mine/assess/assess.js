const app = getApp()
Page({
    data: {
        isInfo:true
    },
    onShow: function (options) {
        let token = wx.getStorageSync("token")
        if (token == '') {
            wx.showModal({
                title: '提示',
                content: '您尚未登录，现在去登录吗？',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/mine/login/login',
                        })
                    } else if (res.cancel) {
                        wx.navigateTo({
                            url: '/pages/index/home/home',
                        })
                    }
                }
            });
        } else {
            this.dataInfo(token);
        };
    },    
    dataInfo(token){
        let then = this
        wx.request({
            url: app.globalData.appUrl +'comment/my_common',
            data:{
                id: token
            },
            success: function(res) {
                console.log(res)
                if (res.data.state) {
                    then.setData({
                        info: res.data.info
                    })
                } else {
                    then.setData({
                        isInfo: false
                    })
                }
            }
        })
    }
})