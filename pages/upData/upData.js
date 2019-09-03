// pages/upData/upData.js
Page({
    data: {

    },
    onLoad: function (options) {

    },
    toUpData(e){
        let id =e.currentTarget.dataset.id
        if(id==1){
            // wx.request({
            //     url: '',
            //     data: '',
            //     header: {},
            //     method: 'GET',
            //     dataType: 'json',
            //     responseType: 'text',
            //     success: function(res) {
            //         wx.navigateTo({
            //             url: './upExpert/upExpert',
            //             // success: function(res) {},
            //             // fail: function(res) {},
            //             // complete: function(res) {},
            //         })
            //     },
            //     fail: function(res) {},
            //     complete: function(res) {},
            // })
            wx.navigateTo({
                        url: './upExpert/upExpert',
                        // success: function(res) {},
                        // fail: function(res) {},
                        // complete: function(res) {},
                    })


        } else if (id ==2) {
            wx.navigateTo({
                url: './upSociety/upSociety',
            })
        } else if (id ==3) {
            wx.navigateTo({
                url: './packUpData/packUpData?id='+id,
            })
        } else if (id ==4) {
            wx.navigateTo({
                url: './upProduct/upProduct',
            })
        }

    }
   
})