const app = getApp();
Page({
    data: {
        name:'',
        tel:'',
        day:'',
        isSub:false
    },
    onLoad: function (options) {
        //let k = options.id;
        let k = Number('231')
        this.dataInfo(k);
        this.setData({
            id: k
        });
        console.log(options.id);
    },
    dataInfo(id) {
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'resources/resources_desc',
            data: {
                id: id
            },
            success: function (res) {
                console.log(res)
                then.setData({
                    info: res.data.resources
                })
            }
        })
    },
    day(e){
        let then = this
        then.setData({
            day: e.detail.value
        })
    },
    name(e){
        let then = this
        then.setData({
            name: e.detail.value
        })
    },
    tel(e){
        let then = this
        then.setData({
            tel: e.detail.value
        })
    },
    but_sub(event){
        let then = this
        let name = then.data.name
        let tel = then.data.tel
        let day = then.data.day
        let id = then.data.id
        let myreg = app.globalData.myreg
        if (myreg.test(tel)){
            then.setData({
                isSub:true
            })
            wx.request({
                url: app.globalData.appUrl + 'order/add_order',
                data: {
                    resources_id: id,
                    uid: wx.getStorageSync("token"),
                    num: day,
                    name: name,
                    tel: tel
                },
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (res) {
                    wx.reLaunch({
                        url: '/pages/mine/home/home',
                        success: function(res) {
                            wx.showToast({
                                title: '提交成功稍后我们会联系您',
                                icon: 'none',
                                duration: 1000,
                            }) 
                        },
                    })
                },
                fail: function (res) {
                    
                    wx.showToast({
                        title: '请求失败请稍后再试！',
                        icon: 'none',
                        duration: 1000,
                        success:function(res){
                            then.setData({
                                isSub: false
                            })
                        }
                    })
                },
            })
        }else{
            wx.showToast({
                title: '手机号码错误',
                icon: 'none',
                duration: 1000,
            })
        }
    }
})