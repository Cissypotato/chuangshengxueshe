// pages/personal/order/conformOrder/confirmOrder.js
const app=getApp()
let appUrl = app.globalData.appUrl
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
         url: appUrl +'ordershop/orderDesc',
         data: {id},
         success:(res)=> {
             console.log(res.data)
             this.setData({
                 init_data:res.data
             })
         },
     })
    },
    confirm(){
        wx.request({
            url: appUrl +'/index.php/index/order/confirmReceipt',
            data: {
                id:this.data.id
            },
            success: (res) =>{
                console.log(res)
                wx.showModal({
                    title: '提示',
                    content: '您确认已经收到物品了吗',
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            wx.navigateBack({
                                delta: 1,
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }

                })
            },
        })
    }
    
})