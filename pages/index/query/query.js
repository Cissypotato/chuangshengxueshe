const app = getApp()
Page({
    data: {
        infoState:true,
        info:"",
        con:"",
		page_title :'搜索',
    },
    onLoad: function (options) {

    },
    content(e){
        let then = this
        then.setData({
            con: e.detail.value
        })
    },
    query(e){
        let then = this 
        wx.showLoading({
           title: '加载中',
           mask: true,
        })
        wx.request({
            url: app.globalData.appUrl + 'Resources/index',
            data: {
                key: then.data.con
            },
            success: function(res) {

                console.log(res);
                if (res.data.resources.length != 0){
                    then.setData({
                        info: res.data.resources,
                        infoState:true
                    })
                }else{
                    then.setData({
                        info: res.data.resources,
                        infoState: false
                    })
                }
                
            },
            fail: function(res) {
                wx.showToast({
                    title: '请求失败请稍后再试！',
                    icon: 'none',
                    duration: 1000,
                })
            },
            complete:function(res){
               wx.hideLoading();
            }
        })
    },
    details(event) {
        wx.navigateTo({
            url: '/pages/index/details/details?id=' + event.currentTarget.dataset.id,
        })
    },
})