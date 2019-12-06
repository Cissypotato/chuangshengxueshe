// pages/personal/shop/order/order.js
const app = getApp()
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
        let com_id = options.com_id
        console.log(com_id)
        this.setData({
            com_id
        })
     if(options.address_id){
         let address_id = options.address_id
         console.log(address_id)
         this.setData({
             address_id
         })
         wx.request({
             url: appUrl + 'shop/orderInfo',
             data: {
                 address_id,
                 user_id: wx.getStorageSync("token"),
                 shop_id: this.data.com_id
             },
             success: (res) => {
                 console.log(res.data)
                 this.setData({
                     init_data: res.data
                 })
             },
         })
     }else{
         console.log(appUrl)
         wx.request({
             url: appUrl + 'shop/orderInfo',
             data: {
                 user_id: wx.getStorageSync("token"),
                 shop_id: this.data.com_id
             },
             success: (res) => {
                //  console.log(url)
                 console.log(res.data)
                 this.setData({
                     init_data: res.data
                 })
             },
         })
     }
    
    
    },


    
    onShow: function () {
        if(this.data.address_id){
            console.log("yeah")
            return
        }else{
            wx.request({
                url: appUrl + 'shop/orderInfo',
                data: {
                    user_id: wx.getStorageSync("token"),
                    shop_id: this.data.com_id
                },
                success: (res) => {
                    console.log(res.data)
                    this.setData({
                        init_data: res.data
                    })
                },
            })
        }
        
     
    },
    toAddAddress(){
        wx.navigateTo({
            url: './../address/addAddress/addAddress',
        })
    },
    toAddressList(){
        wx.navigateTo({
            url: './../address/address?id='+this.data.com_id,
        })
    },
    submitOrder(e){//提交订单
        // console.log(e)
        let address_id=e.currentTarget.dataset.addressid
        // console.log(address_id)
        wx.request({
            url: appUrl+'/index.php/index/Order/addOrder',
            data: {
                user_id: wx.getStorageSync("token"),
                shop_id: this.data.com_id,
                address_id
            },
            success:(res)=> {
                if(res.data.status==true){
                    wx.showToast({
                        title: res.data.info,
                        icon: 'none',
                        duration: 2000,
                        success:()=>{   
                            setTimeout(()=>{
                                wx.switchTab({
                                    url: '../shop',
                                })
                            },2000)
                        }
                    })
                }else{
                    app.alert(res.data.info)
                }
                
            },
        })
    }
    
})