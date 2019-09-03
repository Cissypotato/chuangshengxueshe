const app = getApp();
Page({
   data: {
      //用户登陆状态
      isLogin: false,
      user_real: false,

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

      //动画
      city_animate: {},
      city_img_animate: {},

      //
      news_banner_scroll_left: 0,
   },
   onLoad: function(options) {
      if (wx.getStorageSync('user_district') == '') {
         this.get_lat();
      } else {
         //console.log('读取到用户地区')
         this.data_play(wx.getStorageSync('user_district'));
      };
      wx.showLoading({
         title: '加载中',
      });
   },
   onShow: function() {
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
            //console.log('获取用户经纬度')
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
         success: function(r) {
            then.setData({
               user_district: r.data.result.ext.district,
            });
            wx.setStorageSync('user_district', r.data.result.ext.district);
            then.data_play(r.data.result.ext.district);
            //console.log('经纬度地址解析')
         }
      });
   },
   data_play(district) { //根据地区信息，获取页面数据
      let then = this;
      wx.request({
         url: 'https://xczyzx.com/index.php/index/index/index_test',
         data: {
            district: district,
            user_token: wx.getStorageSync("token"),
         },
         success: function(res) {
            wx.hideLoading();
            //console.log(res.data);
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

               //数据写入
               then.setData({
                  d: res.data,
                  city_list: k1,
                  city_list_index: res.data.key_sort.key,
                  banner_list: banner_list,
                  news_title_list: news_title_list,
                  news_list: news_list,
                  resource_list: resource_list,
               });

               //数据缓存
               wx.setStorageSync('city_list', city_list);

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
      setTimeout(function() {
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
            url: '/pages/mine/home/home',
         });
      } else {
         wx.navigateTo({
            url: '/pages/mine/login/login',
         });
      };
   },
   mk_list(event) { //快速访问点击
      let k = Number(event.currentTarget.dataset.id);
      let t = event.currentTarget.dataset.t;
      if (k == 1 || k == 2 || k == 3) { //资源列表
         wx.navigateTo({
            url: '/pages/index/list/list?id=' + k + '&t=' + t,
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
         wx.showToast({
            title: '暂未开通,敬请期待',
            icon: 'none',
            duration: 1000,
         })
         // wx.navigateTo({
         //    url: '/pages/packGoods/packGoods',
         // })
      } else if (k == 11) { //我的消息
         wx.navigateTo({
            url: '/pages/mine/news/news',
         })
      } else if (k == 12) { //我的评价
         wx.navigateTo({
            url: '/pages/mine/assess/assess',
         })
      } else if (k == 13) { //我的申请
         wx.navigateTo({
            url: '/pages/packApply/packApply',
         })
      } else if (k == 14) { //转发分享
      } else if (k == 15) { //在线咨询
      } else if (k == 16) { //上传数据
         wx.navigateTo({
            url: '/pages/upData/upData',
         })
      } else if (k == 17) { //搜索功能
         wx.navigateTo({
            url: '/pages/index/query/query',
         });
      }
   },
   list(event) { //列表更多信息点击
      let k = Number(event.currentTarget.dataset.id);
      let t = event.currentTarget.dataset.t;
      wx.navigateTo({
         url: '/pages/index/list/list?id=' + k + '&t=' + t,
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
         url: '/pages/index/details/details?id=' + event.currentTarget.dataset.id,
      })
      console.log(event.currentTarget.dataset.id)
   },
   choo_anima() {
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
      setTimeout(function() {
         this.setData({
            city_img_animate: end_1.export()
         });
      }.bind(this), 100);
      setTimeout(function() {
         this.setData({
            city_animate: end.export(),
         });
      }.bind(this), 700);
   },
   icon_anima() {
      this.setData({
         icon_anima: app.aima_2(true),
      });
      setTimeout(function() {
         this.setData({
            icon_anima: app.aima_2(false),
         });
      }.bind(this), 800);
   },
   onPageScroll: function(e) {
      let height = wx.getSystemInfoSync().windowHeight;
      let width = wx.getSystemInfoSync().windowWidth;
      let k = height / width;
      if (e.scrollTop > 310) {
         this.setData({
            news_banner_scroll_left: (e.scrollTop - 310) / k
         });
      } else if (e.scrollTop < 310) {
         this.setData({
            news_banner_scroll_left: 0
         });
      }
   },
});