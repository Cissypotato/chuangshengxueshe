const app = getApp()
Page({
    data: {
        info:[],
        isInfo:true
    },
    onLoad: function (options) {

    },
    onShow: function () {
        this.dataInfo()
    },
    dataInfo(){
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'order/my_order',
            data: {
                id:wx.getStorageSync('token')
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                console.log(res)
                if(res.data.state){
                    then.setData({
                        info: res.data.info
                    })
                }else{
                    then.setData({
                        isInfo: false
                    })
                }
               
            },
            fail: function(res) {
                wx.showToast({
                    title: '请求失败请稍后再试',
                    icon: 'none',
                    duration:1000,
                })
            },
        })
    },
    orderDetail(event){
        wx.navigateTo({
            url: '/pages/mine/orderDetail/orderDetail?id=' + event.currentTarget.dataset.id,
        })
    }
})