// pages/packExpert/list-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       let id=options.id
       this.setData({
           id
       })
       wx.request({
           url: 'https://xczyzx.com/index.php/index/expert/returnExpertDesc',
           data: {id},
           success: (res)=> {
               console.log(res)
               this.setData({
                   init_data:res.data
               })
           },
       })
    },

    toCourseDetail(e){
      let id=e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
          url: './course-detail/course-detail?id='+id,
      })
    },
    onShareAppMessage: function () {
        return {
            // title: this.data.init_data.title,
            // desc: '志愿活动分享',
            path: 'pages/packExpert/list-detail?id=' + this.data.id,

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

})