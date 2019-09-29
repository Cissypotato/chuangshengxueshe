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
       wx.request({
           url: 'https://xczyzx.com/index.php/index/expert/returnExpertDesc',
           data: {id},
           success: (res)=> {
               console.log(res)
               this.setData({
                   init_data:res.data
               })
           },
           fail: function(res) {},
           complete: function(res) {},
       })
    },

    toCourseDetail(e){
      let id=e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
          url: './course-detail/course-detail?id='+id,
      })
    }
})