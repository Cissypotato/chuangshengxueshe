// pages/packExpert/course-detail/course-detail.js
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
            url: 'https://xczyzx.com/index.php/index/expert/returnCourse',
            data: {id},
            success: (res) =>{
                console.log(res)
                this.setData({
                    init_data:res.data
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })

    },

    reservationNow(e){
        let course_id=e.currentTarget.dataset.id
        wx.request({
            url: 'https://xczyzx.com/index.php/index/About/about_course?uid=14&course_id=29',
            data: {
                uid:wx.getStorageSync('token'),
                course_id
            },
            success: (res) =>{
                wx.showToast({
                    title: res.data.info,
                    icon: 'success',
                    duration: 2000,
                    complete: () => {
                        this.setData({
                            state: res.data.state
                        })
                    }
                });
                console.log(res)
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    }
})