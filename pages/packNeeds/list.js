const app = getApp();
Page({
    data: {
        list: [],
        place: [],
        card_list: [],
        type: [],
        type_index: 0,
        s: false,
        multiIndex:[0,0]

    },
    onLoad: function(options) {
       wx.showLoading({
          title: '加载中...',
          mask: true,
       })
        wx.request({
            url: 'https://xczyzx.com/index.php/index/dbs/returnDb',
            success: (res) => {
                console.log(res)             
                let type = res.data.type
                let list = res.data.sort
                let card_list = res.data.data
                let list_1 = []
                let list_2 = []
                let place = []
                for (let i = 0; i < card_list.length; i++) {
                    card_list[i]["s"] = false
                };
                console.log(list)
                for (let i = 0; i < list.length; i++) {
                    list_1.push({
                        "id": list[i].id,
                        "title": list[i].title
                    });
    
                    for (let a = 0; a < list[i].two.length; a++) {
                       
                        if(i===0){
                            list_2.push({
                                "id": list[i].two[a].id,
                                "title": list[i].two[a].title
                            });
                        }
                    };
                };

                console.log(list_2)
                this.setData({
                    list,
                    type,
                    card_list,
                    card_list_c: card_list,
                    place: [list_1, list_2]
                });

            },
            fail: function(res) {},
            complete: function(res) {
               wx.hideLoading()
            },
        })

    },
    onShow: function() {
       
        // wx.request({
        //     url: 'https://xczyzx.com//index.php/index/user/getAccessToken',
        //     success: (res) => {
        //         console.log('233')
        //         let access_token=res.data.access_token
        //         this.getQrcode(access_token)  
        //     },
        // })
    },
    list_click(e) {
        let i = e.currentTarget.dataset.id;
        let t = this.data.card_list;
        t[i].s = !t[i].s;
        this.setData({
            card_list: t
        });
    },
    type_choo(e) {
        let type=this.data.type
        let id = type[e.detail.value].id
        // console.log(type)
        // console.log(id)
        this.setData({
            type_index: e.detail.value
        })
        let type_item = type[e.detail.value]
        let card_list_2 = [...this.data.card_list_c]
        console.log(card_list_2)
        let card_list_1=[...this.data.card_list_c]
        let card_list=[]
        if (type_item.title == "全部") {
            
            card_list = card_list_2
            this.setData({
                card_list
            })
            
        }else{
            for (let i = 0; i < card_list_1.length; i++) {
                if (card_list_1[i]["class"] == type_item.title) {
                    card_list.push(card_list_1[i])
                }
            }
            this.setData({
                card_list
            })
            
        }

        this.setData({
            card_list
        })
        // wx.request({
        //     url: 'https://xczyzx.com/index.php/index/dbs/returnDb',
        //     data: {
        //         type_id: id
        //     },
        //     header: {},
        //     method: 'GET',
        //     dataType: 'json',
        //     responseType: 'text',
        //     success: (res) => {
        //         console.log(res)
        //         let card_list = res.data.data
        //         for (let i = 0; i < card_list.length; i++) {
        //             card_list[i]["s"] = false
        //         }
        //         this.setData({
        //             card_list
        //         })
        //     },
        //     fail: function(res) {},
        //     complete: function(res) {},
        // })

    },

    place_choo(e) {
        var data = {
            place: this.data.place,
            multiIndex: this.data.multiIndex
        };
        var list = this.data.list;
        data.multiIndex[e.detail.column] = e.detail.value;
        if(e.detail.column===0) {
                var arr = [];
                for (let j = 0; j < list[e.detail.value].two.length; j++) {
                    arr.push({
                        'id': list[e.detail.value].two[j].id,
                        'title': list[e.detail.value].two[j].title
                    })
                }
                data.place[1] = arr;
        } else if (e.detail.column ===1){
                data.multiIndex[1] = e.detail.value;       
        }
        this.setData(data)
    },
    city_choo(e){
       let street=this.data.place[0]
       let id=e.currentTarget.dataset.id
       let id_1=street[e.detail.value[0]].id
       console.log(e)
        wx.request({
                url: 'https://xczyzx.com/index.php/index/dbs/returnDb',
                data: {
                    one:id_1,
                    two:id
                },
                success: (res)=> {
                    console.log(res)
                    let card_list = res.data.data
                    console.log(card_list)
                    for (let i = 0; i < card_list.length; i++) {
                        card_list[i]["s"] = false
                    }
                    this.setData({
                        card_list,
                        card_list_c: card_list,
                    })
                },
            })
    },
    onShareAppMessage: function () {
        return {
            title: "项目公示",
            // desc: '志愿活动分享',
            path: 'pages/packNeeds/list',

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
    // getQrcode(access_token) {
    //     console.log(access_token)
    //     wx.request({
    //         url: "https://xczyzx.com//index.php/index/user/getImg",//域名省略
    //         data: {
    //             access_token: access_token,
    //             path: "pages/packNeeds/list",
    //             // scene: this.data.id,
    //             // width: 300
    //         },
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //         },
    //         method: 'POST',
    //         dataType: 'json',
    //         success: (res) => {
    //             console.log(res)
    //             let qrcodeUrl = res.data;//服务器小程序码地址
    //         },
    //         fail: function () { },
    //         // complete: options.complete || function () { }
    //     })
    // }
    //https://xczyzx.com/index.php/index/user/getAccessToken?path=pages/packNeeds/list  //获得二维码接口
});