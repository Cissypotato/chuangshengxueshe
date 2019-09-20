const app = getApp();
Page({
    data: {
        list:[],
        town: [],
        type: [],
        index:0,
        town_index:0
    },
    onLoad: function (options) {
        //app.alert('测试数据');
        wx.request({
          url: 'https://xczyzx.com/index.php/index/shop/returnShop',
          data: '',
          header: {},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res)=> {
              let type = res.data.sort
              let town = res.data.address
              let list=res.data.data
              this.setData({
                type,
                town,
                list
              })
              console.log(list)
              console.log(town)

          },
          fail: function(res) {},
          complete: function(res) {},
        })


    },
    onShow: function () {
        // let list = [];
        // let title = [
        //     '',
        //     '陶釉手工食盘',
        //     '24K 金珍珠表面',
        //     '紫砂水壶套装',
        //     '棉麻原木两人沙发',
        //     '原木自在床',
        //     '原木木椅',
        //     '手工文房四宝',
        //     '原木自在椅',
        // ];
        // let price = [
        //     '',
        //     '280',
        //     '12800',
        //     '800',
        //     '8900',
        //     '9800',
        //     '580',
        //     '800',
        //     '580',
        // ];
        // let imgs = [
        //     '',
        //     '/image/goods_img/good_img1.jpg',
        //     '/image/goods_img/good_img2.jpg',
        //     '/image/goods_img/good_img3.jpg',
        //     '/image/goods_img/good_img4.jpg',
        //     '/image/goods_img/good_img5.jpg',
        //     '/image/goods_img/good_img6.jpg',
        //     '/image/goods_img/good_img7.jpg',
        //     '/image/goods_img/good_img8.jpg'
        // ];
        // for (var i = 1; i < 9; i++) {
        //     let t = {};
        //     t.src = imgs[i];
        //     t.title = title[i];
        //     t.price = price[i];
        //     list.push(t);
        // };
        // this.setData({
        //     list, title, price, imgs
        // });   
    },
  type_choo(e){
    let type=this.data.type
    let id = type[e.detail.value].id
    this.setData({
      index: e.detail.value
    })
    wx.request({
      url: 'https://xczyzx.com/index.php/index/shop/returnShop',
      data: {
        shoptype_id:id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res)=> {
        let list=res.data.data
        this.setData({
          list
        })
      }
    })
  },
  zhen_choo(e){
      let town = this.data.town
      let id = town[e.detail.value].id
      console.log(id)

    // let id = e.currentTarget.dataset.id
    // console.log(id)
    this.setData({
      town_index: e.detail.value
    })
    wx.request({
      url: 'https://xczyzx.com/index.php/index/shop/returnShop',
      data: {
        two: id
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let list = res.data.data
        this.setData({
          list
        })
      }
    })
  },
  list_click(e){
    let id =e.currentTarget.dataset.id
      wx.navigateTo({
          url: '/pages/packGoods/goodsInfo?id='+id,
      });
  },
    toUpData(){
        wx.navigateTo({
            url: './upData/upData'
        })
    }
});