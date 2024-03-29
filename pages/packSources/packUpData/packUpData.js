const app = getApp();
let reg=app.globalData.myreg
Page({
    data: {
        resource_type: [],
        data_part: '',
        up_data: {},
        img_path: [],
        isLogin:1,
        need_data:null
    },
    onLoad(){    
        let user = {};
        user.token = wx.getStorageSync("token");
        user.user_real = wx.getStorageSync("user_real");
        if (user.token == '' || user.user_real == '') {
            if (user.token == '') {
                var k = '/pages/personal/login/login';
            } else {
                var k = '/pages/personal/real/real';
            };
            wx.showModal({
                title: '提示',
                content: '未登陆或未实名认证用户无法完成此功能，现在就去完成吗？',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: k
                        });
                    } else {
                        wx.navigateBack({
                            delta: 1
                        });
                    };
                }
            });
        } else {
            this.setData({
                user
            });
            wx.request({
                url: 'https://xczyzx.com/index/resources/returnField',
                data: {
                    state: 3
                },
                success: (res) => {
                    // console.log(res)
                    let data = res.data
                    this.setData({
                        need_data: data
                    })
                }
            })

        };
        
    },
    onShow: function() {
        let need_data=this.data.need_data
        wx.request({
            url: 'https://xczyzx.com/index.php/index/address/returnlist',
            success: (res) => {
                // console.log(res)
                let data_keys = [];    
                let list_0 = res.data.tree;
                let list_1 = [];
                let list_2 = [];
                let list_3 = [];
                for (let i = 0; i < list_0.length; i++) {                   
                    list_1.push({name:list_0[i].name});                   
                };
                for (let a = 0; a < list_0[0].son.length; a++) {
                    list_2.push({ name: list_0[0].son[a].name });
                    if (a == 0) {
                        for (let b = 0; b < list_0[0].son[a].son.length; b++) {
                            list_3.push({
                                name: list_0[0].son[a].son[b].name,
                                id: list_0[0].son[a].son[b].id,
                            });
                        };
                    };
                };
                let list_4 = [];
                list_4.push(list_1, list_2, list_3);
                this.setData({
                    resource_type: res.data.sort,
                    list_0: res.data.tree,
                    part: list_4
                });
            }
        });
    },
    
    choo_type(e) { //资源类型选择
        let k = this.data.resource_type;
        for (var i = 0; i < k.length; i++) {
            k[i].state = false;
        };
        k[e.currentTarget.dataset.id].state = true;
        let t = this.data.up_data;
        t.sort = k[e.currentTarget.dataset.id].id;
        this.setData({
            resource_type: k,
            up_data: t
        });
    },
    choo_part(e) { //资源地区选择
        let list_0 = this.data.list_0;//tree
        let part = this.data.part; 
        if (e.detail.column == 0) {
            let k = e.detail.value; 
            //第一竖列
             let list_2=[]
             let list_3=[]
            for (let i = 0; i < list_0[k].son.length; i++) {
              list_2.push({name:list_0[k].son[i].name})
                for (let j = 0; j < list_0[k].son[i].son.length;j++){
                    list_3.push({
                        name: list_0[k].son[i].son[j].name,
                        id: list_0[k].son[i].son[j].id
                    })
                }
            };    
            part[1] = list_2
            part[2] = list_3
            this.setData({
                part,
            });

        } else if (e.detail.column == 1) {
            let k = e.detail.value;
             let list_3 = [];
            for (let i = 0; i < list_0[0].son[k].son.length; i++) {
                list_3.push({
                    name:list_0[0].son[k].son[i].name,
                    id: list_0[0].son[k].son[i].id
                    })
            };
            part[2] = list_3
            this.setData({
                part,
            });
        } else if (e.detail.column == 2) {
            let k = e.detail.value;
        };
    },
    choo_part_ok(e) { //资源地区选择确认
        let k = e.detail.value;
        let k1 =k[0]
        let k2 = k[1];
        let k3 = k[2] == null ? 0 : k[2];
        let part = this.data.part;
        let id=part[2][k3].id
        let t = this.data.up_data;
        t.pid = id
        this.setData({
            data_part: part[0][k1].name+ ' ' + part[1][k2].name + ' ' + part[2][k3].name,
            up_data: t
        });
    },
    getLngAndLat() { //经纬度获取
        wx.showLoading({
            title: '获取中······',
        });
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                let t = this.data.up_data;
                t.lng = res.longitude;
                t.lat = res.latitude;
                this.setData({
                    up_data: t
                });
                wx.hideLoading();
            }
        });
    },
    input_data(e) { //文本框数据赋值
        let item = this.data.up_data;
        let k = e.currentTarget.dataset.t;
        if (e.detail.value!==""){
            console.log(e.detail.value)
            item[k] = e.detail.value;
            console.log(item)
            this.setData({
                up_data: item
            });  
        }else{
            console.log(e.detail.value)
            app.alert("请填写相关信息")
             
        }
        // console.log(item)
       
    },
    chooseImage(e) { //图片选择
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: 6,
            success: res => {
                let t = JSON.parse(JSON.stringify(this.data.img_path)) 
                for (let i = 0; i < res.tempFilePaths.length;i++){
                    t.push(res.tempFilePaths[i]);
                }
                this.setData({
                    img_path: t
                });
            }
        })
    },
    handleImagePreview(e) { //图片浏览
        wx.previewImage({
            current: this.data.img_path[e.target.dataset.idx],
            urls: this.data.img_path
        });
    },
    removeImage(e) { //图片删除
        let i = e.target.dataset.idx;
        let t = JSON.parse(JSON.stringify(this.data.img_path));
        t.splice(i, 1);
        this.setData({
            img_path: t
        });
    },
    submitForm(e) { //开始上传

        let up_data = this.data.up_data;
        let need_data=this.data.need_data;
        console.log(need_data)
        console.log(up_data)
        
        let must_data=[]
        for(let i=0;i<need_data.length;i++){
            if(need_data[i].bool==true){
                must_data.push(need_data[i])
            }
        }
        function judge() { //这里写遍历方法与后端传来的data_keys逐个对比
            let arr = Object.keys(up_data);
            console.log(arr)
            console.log(must_data)
            if (up_data.sort == 3 && arr.length < must_data.length ) {
                return true;
            } else if (arr.length < must_data.length - 1 ) {
                return true;
            }
            
        };
        
        if (judge()) {
            app.alert('请先填写全部表单');
        } else if(reg.test(this.data.up_data.tel)==false){
            app.alert('请填写有效电话号码');
        }else if (this.data.img_path.length == 0) {
            app.alert('请先上传照片');
        } else {
            wx.showLoading({
                title: '上传中···',
            });
            let t = this.data.up_data;
            let k = 'image_url';
            t[k] = [];
            this.setData({
                up_data: t,
                now_up: 0
            });
            this.img_up();
        };
    },
    img_up() { //图片上传
        wx.uploadFile({
            url: 'https://xczyzx.com/index.php/index/address/upload_img',
            filePath: this.data.img_path[this.data.now_up],
            name: 'file',
            success: (res) => {
                let info = JSON.parse(res.data);
                if (info.state) {
                    let d = this.data.up_data;
                    d.image_url.push(info.image_url);
                    this.setData({
                        up_data: d
                    });
                }
            },
            complete: (res) => {
                let t = Number(this.data.now_up) + 1;
                if (t === this.data.img_path.length) {
                    this.data_up();
                } else {
                    this.setData({
                        now_up: t
                    });
                    this.img_up();
                };
            }
        });
    },
    data_up() { //数据上传
       let  t=this.data.up_data
       let user=this.data.user
       let data={}
        if (t.sort===3){
          data={
              user_id: user.token,
              title: t.title,
              sort_id: t.sort,
              pid: t.pid,
              group: t.village,
              lng: t.lng,
              lat: t.lat,
              area: t.area,
              all: t.landlord,
              price: t.price,
              phone: t.tel,
              desc: t.area_detail,
              img: t.image_url,
              time_slot:t.time
          }
        } else {
             data = {
                user_id:user.token,
                title: t.title,
                sort_id: t.sort,
                pid: t.pid,
                group: t.village,
                lng: t.lng,
                lat: t.lat,
                area: t.area,
                all: t.landlord,
                price: t.price,
                phone: t.tel,
                desc: t.area_detail,
                 img: t.image_url,
            }
        }

        wx.request({
            url: 'https://xczyzx.com/index.php/index/resources/addResources',
            data:data,
            success: function(res) {

              console.log(res)
                wx.hideLoading();
                app.alert('成功');//这里写数据成功后的逻辑\

                wx.navigateBack({
                    delta: 1,
                })
            }
        });
    },
    toLogin(){//跳转到登录页
        wx.navigateTo({
            url: '/pages/personal/login/login',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    toUserReal() {
        wx.navigateTo({
            url: '/pages/personal/real/real',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    }
});