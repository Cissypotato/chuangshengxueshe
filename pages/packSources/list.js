const app = getApp()
Page({
    data: {
        zhen_list: [],
        zhen_list_index:0,
        city_list: ['新都区', '青白江区', '金堂' ],
        city_list_index:0,
        //页面功能标题
        city_id:1,
        page_title:'',
        noTown:false
    },
    onLoad:function(options){
        console.log(options);
        let id=options.id
        this.setData({
            id
        })
        if (options.id==undefined){
            this.dataInfo(1)
        }else{
            this.dataInfo(options.id)
        };
        if (options.t == undefined) {
            this.setData({
                page_title:'功能测试',
            })
        } else {
            this.setData({
                page_title: options.t ,
            })            
        };

        // if (wx.getStorageSync('city_list') == '') {

        // } else {
        //     this.setData({
        //         city_list: wx.getStorageSync('city_list'),
        //     });
        // };

        wx.showLoading({
            title: '加载中',
        });

    },
    dataInfo(id){
        wx.request({
            url: app.globalData.appUrl + 'sort/lists',
            data: {
                id:id
            },
            success:(res)=> {
                console.log(res)   
                let k = res.data.site;
                let d = [];
                let city_list=[]
                for (var i = 0; i < k.length; i++) {
                    city_list.push({ "name": k[i].name, "id": k[i].id});
                };
                for (var i = 0; i < k[0].data.length; i++) {
                    d.push({ "name": k[0].data[i].name, "id": k[0].data[i].id});
                };
                this.setData({
                    site: res.data.site,
                    city_list:city_list,
                    zhen_list:d,
                    data:res.data.data,
                    page: res.data.page
                });
                wx.nextTick(() => {
                    wx.hideLoading();
                });
                
            }
        })
    },
    city_choo(e) {//城市切换
        this.setData({
            city_list_index: e.detail.value,
        });
        let k=this.data.site
        let d = [];
        for (var i = 0; i < k[e.detail.value].data.length; i++) {
            d.push({ "name": k[e.detail.value].data[i].name, "id": k[e.detail.value].data[i].id});
        };
        this.setData({
            zhen_list: d
        });
        let id = this.data.city_list[e.detail.value].id
        //获取新的街镇数据，未完成
        console.log(id)
        console.log(this.data.id)
        wx.request({
            url: 'https://xczyzx.com/index.php/index/Sort/lists',
            data: {
                id:this.data.id,
                ones:id
                },
            success: (res) =>{
               
                let data=res.data.data
                if(data.length==0){
                    this.setData({
                        city_id: id,
                        data:data,
                        noTown:true
                    })
                }else{
                    this.setData({
                        city_id:id,
                        data: res.data.data,
                        noTown: false
                    })
                }
                
            },
        })
    },
    zhen_choo(e) {//街镇切换
        console.log(e.detail.value)
        let zhen_list = this.data.zhen_list
        this.setData({
            zhen_list_index: e.detail.value,
        });
        let id = zhen_list[e.detail.value].id  
        wx.request({
            url: 'https://xczyzx.com/index.php/index/Sort/lists',
            data: {
                id: this.data.id,
                ones:this.data.city_id,
                two:id
                },
            success: (res)=> {
                console.log(res)
                let data = res.data.data
                if (data.length == 0) {
                    this.setData({
                        data,
                        noTown: true
                    })
                } else {
                    this.setData({
                        data,
                        noTown: false
                    })
                }
                
            },
        })
    //     let d1 = this.data.data;
    //     let zhen_list=this.data.zhen_list
    //     let d2 = zhen_list[e.detail.value];
    //     console.log(d2)
    //     let towns=[]
    //     for(let i=0;i<d1.length;i++){
    //         if(d1[i].town==d2){
    //             towns.push(d1[i])
    //         }
    //     }
    //     console.log(towns)
    //    if(towns.length==0){
    //        this.setData({noTown:true})
    //    }else{
    //        this.setData({data:towns})
    //    }
    },
    details(event) {
        wx.navigateTo({
            url: '/pages/packSources/details/details?id=' + event.currentTarget.dataset.id,
        })
    },
    lower: function (e) {//分页下拉刷新
        let current_page=this.data.page.current_page
        let last_page = this.data.page.last_page
        let id=this.data.id
        if(current_page<last_page){
            wx.showLoading({
                title: '加载中',
            })
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Sort/list',
                data: {
                    p: current_page+1,
                    id:id
                },
                success: (res)=> {
                    let data1=this.data.data
                    let data = data1.concat(res.data.data)
                    this.setData({
                        data,
                        page: res.data.page
                    })
                    wx.nextTick(() => {
                        wx.hideLoading();
                    });
                },
            })
        }else{
            app.alert("没有更多数据了")
        }
    },
    toUpdata(){//跳转到上传资源页面
        wx.navigateTo({
            url: '/pages/packSources/packUpData/packUpData',
        })
    }

})