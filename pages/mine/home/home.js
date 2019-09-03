var app = getApp();
Page({
    data: {
        isLogin: false,
        num: 0
    },
    onLoad: function(options) {

    },
    onShow: function() {
        this.dataInfo()
        let then = this
        let token = wx.getStorageSync("token")
        if (token) {
            then.setData({
                isLogin: true
            })
        } else {
            then.setData({
                isLogin: false
            })
        }
    },
    dataInfo() {
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'index/news_num',
            data: {
                id: wx.getStorageSync("token")
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                then.setData({
                    state: res.data.info.state
                });
                if (res.data.info.state == '1') {
                    app.globalData.user_real = true;
                    wx.setStorageSync("user_real", true)
                } else {
                    app.globalData.user_real = false;
                    wx.setStorageSync("user_real", false)
                };

            }
        })
    },
    goLogin(e) {
        wx.navigateTo({
            url: '/pages/mine/login/login',
        })
    },
    handleContact(e) {
        console.log(e.path)
        console.log(e.query)
    },
    out(e) {
        wx.showModal({
            title: '提示',
            content: '确实要退出登录吗？',
            success(res) {
                if (res.confirm) {
                    wx.setStorageSync("token", '');
                    wx.navigateTo({
                        url: '/pages/index/home/home',
                    })
                } else if (res.cancel) {

                }
            }
        });
    },
    real(e) {
        wx.navigateTo({
            url: '/pages/mine/real/real',
        })
    }



})