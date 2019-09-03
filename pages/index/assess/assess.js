var app = getApp();
Page({
    data: {
        imgList:[],
        num: 0,
        desc: "综合评分",
    },
    onLoad: function(options) {
        var then = this
        then.dataInfo(options.id)
    },
    dataInfo(id){
        let then = this
        wx.request({
            url: app.globalData.appUrl +'comment/resources_common',
            data: {
                resources_id:id
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                console.log(res)
                var imgList = []

                for (var i = 0; i < res.data.info.length; i++) {
                    for (var j = 0; j < res.data.info[i].img.length; j++) {
                        imgList.push(res.data.info[i].img[j].img)
                    }
                }
                then.setData({
                    num: res.data.comment,
                    info: res.data.info,
                    imgList: imgList

                })
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
    ViewImage(e) {
        console.log(this.data.imgList)
        
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
})