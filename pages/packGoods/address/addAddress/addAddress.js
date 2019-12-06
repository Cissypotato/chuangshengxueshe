// pages/personal/address/addAddress/addAddress.js
const app = getApp()
let appUrl = app.globalData.appUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {

    region: ['广东省', '广州市', '海珠区'],
    addressItem:null,
    isLogin: false,
    isUpdate:false
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      region: e.detail.value,
      isUpdate:true
    })
  },
  updateFormSubmit:function(e){//改地址
    let name = e.detail.value.name
    let province = e.detail.value.province[0]
    let city = e.detail.value.province[1]
    let area = e.detail.value.province[2]
    let place = e.detail.value.address
    let defaultValue = e.detail.value.defaultSelected ? 1 : 0
    let tel = e.detail.value.tel
    let myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/
    if (myreg.test(tel)) {
      wx.request({
          url: appUrl + 'Useraddress/upt_address',
        data: {
          "id":this.data.id,
          "porvince": province,
          "city": city,
          "area": area,
          "name": name,
          "tel": tel,
          "place": place,
        },
        success: function (res) {
          if (res.data.state) {
            wx.navigateBack({
              delta: 1,
              success: function () {
                wx.showToast({
                  title: '修改地址成功',
                  icon: 'none',
                  duration: 1000,
                })
              }
            })
          }


        },
      })
    }

  },

  formSubmit: function (e) {//新增地址
    let name = e.detail.value.name
    let province = e.detail.value.province[0]
    let city = e.detail.value.province[1]
    let area = e.detail.value.province[2]
    let place = e.detail.value.address
    let defaultValue = e.detail.value.defaultSelected?1:0
    let tel = e.detail.value.tel
    let myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/
    if (myreg.test(tel)) {
      wx.request({
          url: appUrl + 'Useraddress/add_address',
        data: {
          user_id: this.data.user_id,
          "porvince":province,
          "city":city,
          "area":area,
          "name": name,
          "tel": tel,
          "place":place,
          "default": defaultValue 
        },
        success: function (res) {
          if(res.data.state){
              wx.navigateBack({
                  delta: 1,
                  success: function () {
                      wx.showToast({
                          title: '修改地址成功',
                          icon: 'none',
                          duration: 1000,
                      })
                  }
              })
          }
         
        },
      })


    } else {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000,
      })
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value)


  },
  switchChange: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
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
        url: appUrl + 'Useraddress/select_address',
      data: {
        "id": id
      },
      success: (res) => {
        this.setData({
          addressItem: res.data.info
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user_id=wx.getStorageSync("token")
    this.setData({
        user_id
    })
  },

})