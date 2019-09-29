const app = getApp();
Page({
    data: {
        isLogin: false,  
        up_data:'',      
    },
    onLoad: function (options) {

    },
    onReady: function () {

    },
    onShow: function () {
        if (wx.getStorageSync("token") == '') {
            this.setData({
                isLogin: false
            });
            wx.showModal({
                title: '提示',
                content: '您尚未登录，现在去登录吗？',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/personal/login/login',
                        })
                    } else if (res.cancel) {
                        wx.reLaunch({
                            url: '/pages/index/index',
                        })
                    }
                }
            });
        } else {
            this.setData({
                isLogin: true
            });
        };
    },
    
    bindTextAreaBlur: function (e) {
        let k = e.detail.value;
        this.setData({
            up_data: k
        });
    },
    formSubmit:function(e){//表单数据提交
        let k = this.data.up_data;
        wx.navigateBack({
            delta: 1,
            success: function () {
                wx.showToast({
                    title: '数据提交成功',
                    icon: 'none',
                    duration: 1000,
                })
            }
        })        

    },
})