const app = getApp();
Page({
    data: {
        numList: [{
            name: '待审核'
        }, {
            name: '审核结果'
        }, {
            name: '待评价'
        }, {
            name: '已完成'
        }],
        num: 0,
        info: []
    },
    onLoad: function(options) {
        this.dataInfo(options.id);
    },
    dataInfo(id) {
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'order/my_desc',
            data: {
                id: wx.getStorageSync('token'),
                order_id: id
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {

                console.log(res)
                then.setData({
                    info: res.data.info,
                    num: res.data.info.state
                })
                if (res.data.info.state == 1) {
                    then.setData({
                        pop:1,
                        numList: [{
                            name: '待审核'
                        }, {
                            name: '未通过'
                        }, {
                            name: '待评价'
                        }, {
                            name: '已完成'
                        }],
                    })
                }else{
                    then.setData({
                        numList: [{
                            name: '待审核'
                        }, {
                            name: '已通过'
                        }, {
                            name: '待评价'
                        }, {
                            name: '已完成'
                        }],
                    })
                }

            },
            fail: function(res) {
                wx.showToast({
                    title: '请求失败请稍后再试',
                    icon: 'none',
                    duration: 1000,
                })
            },
        })
    },
    goAssess(event) {
        wx.navigateTo({
            url: '/pages/mine/goAssess/goAssess?id=' + event.currentTarget.dataset.id + '&res=' + event.currentTarget.dataset.res,
        })
    }
})