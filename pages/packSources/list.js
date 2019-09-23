const app = getApp()
Page({
    data: {
        zhen_list: [],
        zhen_list_index:0,
        city_list:['新都区'],
        city_list_index:0,
        //页面功能标题
        page_title:'',
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
            url: app.globalData.appUrl + 'sort/list',
            data: {
                id:id
            },
            success:(res)=> {
                console.log(res)   
                let k = res.data.site;
                let d = ['全部街镇'];
                for (var i = 0; i < k.length; i++) {
                    d.push(k[i].name);
                };
                this.setData({
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
        //获取新的街镇数据，未完成
    },
    zhen_choo(e) {//街镇切换
        this.setData({
            zhen_list_index: e.detail.value,
        });

        let d1 = this.data.data;
        let d2 = d1[e.detail.value].town;

        console.log(e);
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