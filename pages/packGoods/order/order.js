// pages/personal/shop/order/order.js
const app = getApp()
let appUrl = app.globalData.appUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let com_id = options.com_id
        console.log(com_id)
        console.log(wx.getStorageSync("token"))
        this.setData({
            com_id
        })
        if (options.address_id) {
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
                        init_data: res.data,
                        price: res.data.shop.price
                    })
                },
            })
        } else {
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
                        init_data: res.data,
                        price: res.data.shop.price
                    })
                },
            })
        }


    },

    onShow: function() {
        if (this.data.address_id) {
            console.log("yeah")
            return
        } else {
            wx.request({
                url: appUrl + 'shop/orderInfo',
                data: {
                    user_id: wx.getStorageSync("token"),
                    shop_id: this.data.com_id
                },
                success: (res) => {
                    console.log(res.data)
                    this.setData({
                        init_data: res.data,
                        price: res.data.shop.price
                    })
                },
            })
        }


    },
    toAddAddress() {
        wx.navigateTo({
            url: './../address/addAddress/addAddress',
        })
    },
    toAddressList() {
        wx.navigateTo({
            url: './../address/address?id=' + this.data.com_id,
        })
    },
    add() { //商品数量加
        let num = this.data.num + 1
        let price = this.data.init_data.shop.price * num
        if (num > 10) {
            app.alert("不能增加了哦")
        } else {
            this.setData({
                num,
                price
            })
        }

    },
    reduce() { //商品数量减
        let num = this.data.num - 1
        let price = this.data.init_data.shop.price * num
        if (num < 1) {
            app.alert("不能减少了哦")
        } else {
            this.setData({
                num,
                price
            })
        }

    },
    submitOrder(e) { //提交订单
        // console.log(e)
        let address_id = e.currentTarget.dataset.addressid


        wx.request({
            url: appUrl + 'pay/addOrder',
            data: {
                user_id: wx.getStorageSync("token"),
                address_id,
                shop_id: this.data.com_id,
                shop_num: this.data.num
            },
            success: (res) => {
                console.log(res)
                let id = res.data.shop_id
                if (res.data.code == 200) {
                    //    app.alert(res.data.info)
                    wx.login({
                        success(res) {
                            console.log(res)
                            if (res.code) {
                                //发起网络请求
                                wx.request({
                                    url: appUrl + 'pay/pay',
                                    data: {
                                        id,
                                        code: res.code
                                    },
                                    success: (res) => {
                                        console.log(res)
                                        wx.requestPayment(
                                            {
                                                'timeStamp': res.data.timeStamp,
                                                'nonceStr': res.data.nonceStr,
                                                'package': res.data.package,
                                                'signType': res.data.signType,
                                                'paySign': res.data.paySign,
                                                'success':  (res)=> { 
                                                    
                                                    wx.redirectTo({
                                                        url: '/pages/index/index',
                                                        complete: function(res) {},
                                                    })
                                                },
                                                'fail': function (res) { 
                                                    console.log(res)
                                                    app.alert("支付失败")
                                                },
                                
                                            })
                                    },
                                })
                            } else {
                                console.log('登录失败！' + res.errMsg)
                            }
                        }
                    })

                } else {
                    app.alert(res.data.info)
                }
            },
        })

        // wx.requestPayment(
        //     {
        //         'timeStamp': '',
        //         'nonceStr': '',
        //         'package': '',
        //         'signType': 'MD5',
        //         'paySign': '',
        //         'success': function (res) { 
        //             console.log(res)
        //         },
        //         'fail': function (res) { },
        //         'complete': function (res) { }
        //     })
    },
    pay: function() {
        var ordercode = this.data.txtOrderCode;
        wx.login({
            success: function(res) {
                if (res.code) {
                    wx.request({
                        url: 'https://www.yourdomain.com/pay',
                        data: {
                            code: res.code, //要去换取openid的登录凭证
                            ordercode: ordercode
                        },
                        method: 'GET',
                        success: function(res) {
                            console.log(res.data)
                            wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                success: function(res) {
                                    // success
                                    console.log(res);
                                },
                                fail: function(res) {
                                    // fail
                                    console.log(res);
                                },
                                complete: function(res) {
                                    // complete
                                    console.log(res);
                                }
                            })
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },

})