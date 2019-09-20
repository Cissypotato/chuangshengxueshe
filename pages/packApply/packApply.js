const app = getApp();
Page({
    data: {
        isLogin: false,
        init_data:{}  ,
        up_data:'',  
        state:false    
    },
    onLoad: function (options) {
       

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
            let id = wx.getStorageSync('token')
            wx.request({
                url: 'https://xczyzx.com/index.php/index/my/returnMyApply',
                data: { id },
                success: (res) => {
                    console.log(res)
                    this.setData({
                        init_data: res.data,
                        isLogin: true
                    })
                },
            })
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
    toUpData(e){
        console.log(e)
        let id =e.currentTarget.dataset.id
        if(id==1){
            wx.navigateTo({
                url: '/pages/packSources/packUpData/packUpData',

            })
        }else if(id==2){
            wx.showModal({
                title: '提示',
                content: '您即将进入社会组织上传页面，如果您的社会组织已经认证则直接进入项目资源上传页面',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/packOrganization/upData',

                        })
                    } else if (res.cancel) {

                    }
                }
            })
            
            
        } else if (id == 3) {
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
        } else if (id == 4) {
            wx.navigateTo({
                url: '/pages/packGoods/upData/upData',

            })
        }
    }
})