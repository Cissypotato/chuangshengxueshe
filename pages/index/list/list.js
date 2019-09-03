const app = getApp()
Page({
    data: {
        zhen_list: [],
        zhen_list_index:0,
        //
        city_list:['新都区','青白江','金堂'],
        city_list_index:0,
        //页面功能标题
        page_title:'',
    },
    onLoad:function(options){
        console.log(options);
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

        if (wx.getStorageSync('city_list') == '') {

        } else {
            this.setData({
                city_list: wx.getStorageSync('city_list'),
            });
        };

        wx.showLoading({
            title: '加载中',
        });

    },
    dataInfo(id){
        let then = this
        wx.request({
            url: app.globalData.appUrl + 'sort/list',
            data: {
                id:id
            },
            success: function(res) {
                console.log(res)
                
                let k = res.data.site;
                let d = ['全部街镇'];
                for (var i = 0; i < k.length; i++) {
                    d.push(k[i].name);
                };
                then.setData({
                    zhen_list:d,
                    data:res.data.data
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
            url: '/pages/index/details/details?id=' + event.currentTarget.dataset.id,
        })
    }
})