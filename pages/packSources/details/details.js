const app = getApp();
Page({
    data: {
        isLogin:false,
        markers: [],
        info:[]
    },
    onLoad: function (options){
		let k = options.id;
        this.setData({
            id:k
        })
        this.detaInfo(k);
       
    },
    onShow: function() {
        let then = this;
        if (wx.getStorageSync("token")=='') {
            then.setData({
                isLogin:false
            });
        }else{
            then.setData({
                isLogin: true
            });
        };
    },
    detaInfo(id){
        var then = this
        wx.request({
            url: app.globalData.appUrl + 'resources/resources_desc',
            data: {
                id: id
            },
            success: function(res) {
                console.log(res)
                then.setData({
                    info:res.data,
                    markers: [{
                        latitude: res.data.resources.lat,
                        longitude: res.data.resources.lng,
                    }],
                })
            }
        })
    },
    goMake(event) {
        var then = this
        //先判断用户是否登陆
        //然后判断用户是否实名认证
        let isLogin = this.data.isLogin;
        if (this.data.info.resources.types==1){
            app.alert('该资源已出租，不能进行预约')
        
    }else if (isLogin) {
            wx.request({
                url: app.globalData.appUrl + 'index/news_num',
                data: {
                    id: wx.getStorageSync("token")
                },
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
                            success: function (res) {
                                app.alert("预约成功")
                            },
                            fail: function (res) { }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '未进行实名认证用户无法完成预约，现在就去实名认证吗？',
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
            //无需进入下一页面处理逻辑，直接在本页完成
            /*
            wx.navigateTo({
            url: '/pages/index/make/make?id=' + event.currentTarget.dataset.id,
            });
            */
            // wx.showToast({
            // title: '预约成功',
            // icon: 'success',
            // duration: 2000
            // });
            //预约成功后，锁定预约按钮
        } else {
            wx.showModal({
                title: '提示',
                content: '未登陆进行实名认证用户无法完成预约，现在就去登陆吗？',
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
    handleContact(e) {
        console.log(e.path)
        console.log(e.query)
    },
    img_show(e){
        let now = e.currentTarget.dataset.src;
        let list = [];
        let k = this.data.info.resources.img;
        for (var i = 0; i < k.length; i++) {
            list.push(k[i].img);
        };  
        wx.previewImage({
            current: now,
            urls: list
        });
    },
	details(event) {
		wx.redirectTo({
			url: '/pages/packSources/details/details?id=' + event.currentTarget.dataset.id,
		});
		console.log(event.currentTarget.dataset.id)
	},
    onShareAppMessage: function () {
        return {
            title: this.data.info.resources.title,
            // desc: '志愿活动分享',
            path: 'pages/packSources/details/details?id=' + this.data.id,

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
    
})