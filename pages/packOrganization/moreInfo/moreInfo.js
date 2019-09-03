// pages/packOrganization/moreInfo/moreInfo.js
Page({
   data: {
      nodes: ""
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      let id = options.id
      wx.request({
         url: 'https://xczyzx.com/index.php/index/Society/returnDesc?id=' + id,
         data: '',
         header: {},
         method: 'GET',
         dataType: 'json',
         responseType: 'text',
         success: res=> {
            console.log(res)
            this.setData({
               nodes: res.data.info.replace(/\<img/gi, '< img style="max-width:100%;height:auto;display:block;margin:0 auto;"')
            })
         },
         fail: function(res) {},
         complete: function(res) {},
      })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
})