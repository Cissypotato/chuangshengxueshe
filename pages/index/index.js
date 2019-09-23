const app = getApp();
Page({
    data: {
        //用户状态
        isLogin: false,
        user_real: false,
        news_state:false,
        //ajax数据
        d: [],

        //地区数据
        user_district: '',
        city_list_index: 0,
        city_list: [],

        //新闻信息
        banner_list: [],
        news_title_now: 0,
        news_title_list: [],
        news_list: [],

        //资源信息
        resource_list: [],

        //城市 动画
        city_animate: {},
        city_img_animate: {},

        //banner 动画
        news_banner_scroll_left: 0,
        sw_width: '',

        //mod_alert
        alert_box: {},


    },
    // onLoad: function (options) {
    //     // if (wx.getStorageSync('user_district') == '') {
    //     //     this.get_lat();
    //     // } else {
    //     //     //console.log('读取到用户地区')
    //     //     this.data_play(wx.getStorageSync('user_district'));
    //     // };
    //     // wx.showLoading({
    //     //     title: '加载中',
    //     // });
    // },
    onShow: function () {
        if (wx.getStorageSync('user_district') == '') {
            this.get_lat();
        } else {
            //console.log('读取到用户地区')
            this.data_play(wx.getStorageSync('user_district'));
        };
        wx.showLoading({
            title: '加载中',
        });
        if (wx.getStorageSync('user_real')) {
            this.setData({
                user_real: true
            });
        } else {
            this.setData({
                user_real: false
            });
        };
        if (wx.getStorageSync("token") == '') {
            this.setData({
                isLogin: false
            });
        } else {
            this.setData({
                isLogin: true
            });
        };
        //console.log(wx.getStorageSync("token"))
        this.choo_anima();
        this.icon_anima();
    },
    get_lat() { //获取用户经纬度   
        let then = this;
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                then.get_city(res.latitude, res.longitude);
            }
        });
    },
    get_city(lat, lng) { //聚合数据 -  经纬度地址解析 - APPKEY - 2ee0950b3b54746d31f129ce6badd7cd
        let then = this;
        wx.request({
            url: 'https://apis.juhe.cn/geo/',
            data: {
                key: '2ee0950b3b54746d31f129ce6badd7cd',
                lat: lat,
                lng: lng,
                type: 1,
            },
            success: function (r) {
                then.setData({
                    user_district: r.data.result.ext.district,
                });
                wx.setStorageSync('user_district', r.data.result.ext.district);
                then.data_play(r.data.result.ext.district);
            }
        });
    },
    data_play(district) { //根据地区信息，获取页面数据
        let then = this;
        console.log(wx.getStorageSync("token"))
        wx.request({
            url: 'https://xczyzx.com/index.php/index/index/index_test',
            data: {
                district: district,
                user_token: wx.getStorageSync("token"),
            },
            success: function (res) {
                wx.hideLoading();
                console.log(res.data);
                if (res.data.key_sort == undefined) {
                    app.alert('网络错误请稍后再试');
                } else {
                    //地区数据处理
                    let k1 = res.data.key_sort.sort;
                    let city_list = [];
                    for (var i = 0; i < k1.length; i++) {
                        city_list.push(k1[i].name);
                    };
                    //新闻数据处理
                    //数组结构有误
                    let k2 = res.data.notice_sow.notice;

                    let news_title_list = [];
                    news_title_list.push(k2.help.title);
                    news_title_list.push(k2.news.title);
                    news_title_list.push(k2.notice.title);

                    let news_list = [];
                    let n1 = [],
                        n2 = [],
                        n3 = [];
                    for (var i = 0; i < k2.help.data.length; i++) {
                        n1.push(k2.help.data[i]);
                    };
                    for (var i = 0; i < k2.news.data.length; i++) {
                        n2.push(k2.news.data[i]);
                    };
                    for (var i = 0; i < k2.notice.data.length; i++) {
                        n3.push(k2.notice.data[i]);
                    };
                    news_list.push(n1, n2, n3);

                    let banner_list = res.data.notice_sow.sow;
                    for (var i = 0; i < k2.length; i++) {
                        news_title_list.push(k2[i].title);
                    };

                    //资源数据处理
                    let k3 = res.data.info_sort;
                    let resource_list = k3;

                    //首页弹框相关数据
                    let alert_box = res.data.alert_box;
                    // alert_box.is = true;   //弹框包含缩略图是否显示,此项决定了页面上是否有弹框的所有组件 boolean
                    // alert_box.show = false; //弹框是否弹出 boolean
                    // alert_box.thumbnail = '/image/ma_1.png'; //缩略图图片路径 String
                    // alert_box.img = '/image/ma_1.png'; //图片路径 String
                    // alert_box.link_state = false; // 弹框是否能被点击 boolean
                    // alert_box.link_id = Number(3); // 弹框如果能被点击，点击后跳转的文章ID Number

                    //首页专家人才数据
                    let experts = res.data.experts;
                    // for (var i = 0; i < 2; i++) {
                    //     let d = {};
                    //     d.id = Number(3); //专家的id Number
                    //     d.img = 'https://xczyzx.com/uploads/sow/20190829/dd3e2861d35d0fc824c4a42dfbd09bee.png'; //专家的照片 String
                    //     d.name = '马云'; //专家的名称 String
                    //     d.title = '阿里巴巴创始人'; //专家的头衔 String 
                    //     experts.push(d);
                    // };

                    //首页社会组织数据
                    let organization = res.data.organization;
                    // for (var i = 0; i < 2; i++) {
                    //     let d = {};
                    //     d.id = Number(3); //组织的id Number
                    //     d.title = '阿里巴巴'; //组织的名称 String 
                    //     d.img = 'https://xczyzx.com/uploads/sow/20190829/dd3e2861d35d0fc824c4a42dfbd09bee.png'; //组织的照片 String
                    //     d.name = '张老师'; //组织的联系人 String
                    //     d.tel = '13558681821'; //组织的联系电话 String
                    //     organization.push(d);
                    // };

                    //首页社区特色产品
                    let goods = [];
                    for (var i = 0; i < 5; i++) {
                        let d = {};
                        d.id = Number(3); //商品的id Number
                        d.img = 'https://xczyzx.com/uploads/sow/20190829/dd3e2861d35d0fc824c4a42dfbd09bee.png'; //商品的照片 String
                        d.name = '一束花'; //商品的名称 String
                        d.price = Number(255); //商品的价格 Number
                        goods.push(d);
                    };

                    //数据写入
                    then.setData({
                        d: res.data,
                        city_list: k1,
                        city_list_index: res.data.key_sort.key,
                        banner_list: banner_list,
                        news_title_list: news_title_list,
                        news_list: news_list,
                        resource_list: resource_list,
                        alert_box: alert_box,
                        experts: experts,
                        organization: organization,
                        goods: goods,
                        news_state:res.data.news.state
                    });

                    //数据缓存
                    wx.setStorageSync('city_list', city_list);

                    //获取banner数量 及其 宽度
                    let query = wx.createSelectorQuery();
                    query.select('#sw').boundingClientRect();
                    let width = wx.getSystemInfoSync().windowWidth;
                    query.exec((res) => {
                        then.setData({
                            sw_width: width * 0.65 * banner_list.length + width * 0.12
                        });
                    });
                    //console.log(res.data);
                };
            }
        });
    },
    tab_click(e) { //新闻列表切换
        this.setData({
            news_title_now: e.currentTarget.dataset.id,
        });
        this.setData({
            anima_1: app.aima_1(true),
        });
        setTimeout(function () {
            this.setData({
                anima_1: app.aima_1(false),
            });
        }.bind(this), 100);
    },
    city_choo(e) { //城市切换
        this.setData({
            city_list_index: e.detail.value,
        });
        let k = this.data.city_list[e.detail.value].name;
        this.data_play(k);
        wx.setStorageSync('user_district', k);
        this.choo_anima();
    },
    user_pack_click(e) { //点击用户模块,打开用户页面
        if (this.data.isLogin) { //判断用户是否登陆
            wx.navigateTo({
                url: '/pages/personal/home/home',
            });
        } else {
            wx.navigateTo({
                url: '/pages/personal/login/login',
            });
        };
    },
    mk_list(event) { //快速访问点击
        let k = Number(event.currentTarget.dataset.id);
        let t = event.currentTarget.dataset.t;
        if (k == 1 || k == 2 || k == 3) { //资源列表
            wx.navigateTo({
                url: '/pages/packSources/list?id=' + k + '&t=' + t,
            })
        } else if (k == 4) { //专家人才
            wx.navigateTo({
                url: '/pages/packExpert/list',
            });
        } else if (k == 5) { //项目公示
            wx.navigateTo({
                url: '/pages/packNeeds/list',
            });
        } else if (k == 6) { //社会组织
            wx.navigateTo({
                url: '/pages/packOrganization/list',
            });
        } else if (k == 7) { //社区特色产品
            wx.navigateTo({
                url: '/pages/packGoods/packGoods',
            })
        } else if (k == 11) { //我的消息
            wx.navigateTo({
                url: '/pages/myMessage/list',
            })
        } else if (k == 12) { //我的评价
            wx.navigateTo({
                url: '/pages/myComment/list',
            })
        } else if (k == 13) { //我的申请
            wx.navigateTo({
                url: '/pages/packApply/packApply?id='+t,
            })
        } else if (k == 14) { //转发分享
        } else if (k == 15) { //在线咨询
        } else if (k == 16) { //上传数据
            wx.navigateTo({
                url: '/pages/packUpData/packUpData',
            })
        } else if (k == 17) { //搜索功能
            wx.navigateTo({
                url: '/pages/search/query',
            });
        }
    },
    list(event) { //列表更多信息点击
        let k = Number(event.currentTarget.dataset.id);
        let t = event.currentTarget.dataset.t;
        wx.navigateTo({
            url: '/pages/packSources/list?id=' + k + '&t=' + t,
        })
    },
    arc_click(e) { //文章信息点击
        wx.navigateTo({
            url: '/pages/index/notice/notice?id=' + e.target.dataset.id,
        });
        console.log(e.target.dataset.id)
    },
    details(event) { //资源信息点击
        wx.navigateTo({
            url: '/pages/packSources/details/details?id=' + event.currentTarget.dataset.id,
        })
    },
    toOrganizationOne(e){//社会组织点击
        wx.navigateTo({
            url: '/pages/packOrganization/list?id=' + e.currentTarget.dataset.id,
        })
    },
    toExpertOne(e){//专家人才点击
        wx.navigateTo({
            url: '/pages/packExpert/list?id=' + e.currentTarget.dataset.id,
        })
    },
    choo_anima() {//地区选择动画
        let str = wx.createAnimation({
            duration: 700,
            timingFunction: "ease",
        });
        let end = wx.createAnimation({
            duration: 0,
            timingFunction: "step-end",
        });
        str.rotateY(180).step();
        end.rotateY(-180).step()
        let str_1 = wx.createAnimation({
            duration: 0,
            timingFunction: "step-end",
        });
        let end_1 = wx.createAnimation({
            duration: 800,
            timingFunction: "ease",
        });
        str_1.translateX(100).opacity(0).step();
        end_1.translateX(0).opacity(1).step();
        this.setData({
            city_animate: str.export(),
            city_img_animate: str_1.export()
        });
        setTimeout(function () {
            this.setData({
                city_img_animate: end_1.export()
            });
        }.bind(this), 100);
        setTimeout(function () {
            this.setData({
                city_animate: end.export(),
            });
        }.bind(this), 700);
    },
    icon_anima() {//图标翻转动画
        this.setData({
            icon_anima: app.aima_2(true),
        });
        setTimeout(function () {
            this.setData({
                icon_anima: app.aima_2(false),
            });
        }.bind(this), 800);
    },
    onPageScroll: function (e) {//banner滑动跟随页面滚动
        let height = wx.getSystemInfoSync().windowHeight;
        let width = wx.getSystemInfoSync().windowWidth;
        let query = wx.createSelectorQuery();
        query.select('#sw').boundingClientRect();
        query.exec((res) => {
            let m = height - res[0].height - 10;
            let t = Number();
            if (res[0].top < m && res[0].top > 0) {
                t = (this.data.sw_width - width) * (1 - res[0].top / m)
                this.setData({
                    news_banner_scroll_left: t
                });
            } else if (res[0].top > m) {
                this.setData({
                    news_banner_scroll_left: 0
                });
            };
        });
    },
    alert_box_switch() {//页面弹窗显示切换
        let t = this.data.alert_box;
        t.show = !t.show;
        this.setData({
            alert_box: t,
        });
    },
    alert_box_link(e) {//页面弹窗内部点击后跳转逻辑
        let k = e.currentTarget.dataset.id;
        if (this.data.alert_box.link_state) {
            wx.navigateTo({
                url: '/pages/index/notice/notice?id=' + k,
            });
            let t = this.data.alert_box;
            t.show = false;
            this.setData({
                alert_box: t,
            });
        };
    },
});