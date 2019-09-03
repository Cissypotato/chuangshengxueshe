const app = getApp();
Page({
    data: {
        list: [],
        now:0,
        project_list: [{name:"自愿举办的非营利性社会服务活动"}, {name:"自愿举办的非营利性社会服务活动"}, {name:"自愿举办的非营利性社会服务活动"}]
    },
    onLoad: function (options) {
      wx.request({
        url: 'https://xczyzx.com/index.php/index/Society/returnSociety',
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) =>{
          console.log(res.data)

          this.setData({
            list:res.data
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    },
    onShow: function () {
        // let list = [];
        // let k1 = {
        //     id:'1',
        //     title: '新都区月亮公益机构',
        //     src:'/image/g1.jpg',
        //     type: '儿童、妇女',
        //     master:'小张',
        //     tel:'13558685868'
        // };
        // list.push(k1,k1,k1);
        // this.setData({
        //     list
        // });
    },
    list_click(e) {
        let id =e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pages/packOrganization/moreInfo/moreInfo?id='+id,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
    },
    swiperChange: function (e) {
        var that = this;
        if (e.detail.source == 'touch') {
            that.setData({
                now: e.detail.current
            });
        }
    }, 
});