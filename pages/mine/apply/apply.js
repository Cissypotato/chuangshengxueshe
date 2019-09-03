const app = getApp()
Page({
    data: {
        imgList: [],
        type: "",
        uname: "",
        tel: "",
        remarks: ""
    },
    onLoad: function(options) {

    },
    type(e) {
        let then = this
        then.setData({
            type: e.detail.value
        })
    },
    uname(e) {
        let then = this
        then.setData({
            uname: e.detail.value
        })
    },
    tel(e) {
        let then = this
        then.setData({
            tel: e.detail.value
        })
    },
    remarks(e) {
        let then = this
        then.setData({
            remarks: e.detail.value
        })
    },
    submission(e) {
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'apply/add_apply',
            data: {
                uid: wx.getStorageSync("token"),
                name: then.data.uname,
                tel: then.data.tel,
                type: then.data.type,
                remark: then.data.remark
            },
            header: {},
            method: 'get',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                if (res.data.state == true) {
                    wx.navigateBack({
                        delta: 1,
                        success: function(e) {
                            wx.showToast({
                                title: '提交成功稍后我们工作人员会跟您练习',
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '请求失败请稍后再试',
                        icon: 'none',
                        duration: 1000,
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
    }
})