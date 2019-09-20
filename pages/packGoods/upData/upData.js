const app = getApp();
let reg = app.globalData.myreg
Page({
    data: {
        //用户状态
        user: {},
        //初始数据
        data: {},
        plus_state: true,
        //富文本编辑器按钮样式集
        formats: {},
        //上传数据
        up_data: {},
        img_path:[],
        data_part: '',
    },
    onShow: function () { //先获取用户相关状态
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
            this.data_play(user.token);
        };
    },
    data_play(id) { //获取初始数据
        wx.request({
            url: 'https://xczyzx.com//index.php/index/shop/returnShopInfo',
            data: {
                id: id
            },
            success: (res) => {
                console.log(res.data)
                let data = res.data;
                let data_keys = [];
                let list_0 =data.address;
                let list_1 = [];
                let list_2 = [];
                let list_3 = [];
                for (let i = 0; i < list_0.length; i++) {
                    list_1.push({ name: list_0[i].name });
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
                    data: { ...data },
                    list_0:data.address,
                    part: list_4
                });
            }
        })
    },


    /*文本框赋值*/
    input_data(e) { //社会组织文本框数据赋值
        let up_data = this.data.up_data;
        let k = e.currentTarget.dataset.t;
        if (e.detail.value !== "") {
            up_data[k] = e.detail.value;
            this.setData({
                up_data
            });
        };
        console.log(up_data);
    },

    // /*社会组织上传*/
    // up_btn_step_1(e) { //社会组织开始上传
    //     let t = this.data.up_data;
    //     if (t.title == undefined) {
    //         getApp().alert('请填写组织名字');
    //     } else if (t.name == undefined) {
    //         getApp().alert('请填写联系人姓名');
    //     } else if (t.tel == undefined) {
    //         getApp().alert('请填写联系电话');
    //     } else if (t.editor == undefined) {
    //         getApp().alert('请填写组织介绍');
    //     } else if (this.data.img_path == undefined || this.data.img_path == []) {
    //         getApp().alert('请添加组织照片');
    //     } else {
    //         wx.showLoading({
    //             title: '上传中···'
    //         });
    //         wx.uploadFile({
    //             url: 'https://xczyzx.com/index.php/index/Society/addSociety',
    //             filePath: this.data.img_path,
    //             name: 'img',
    //             formData: {
    //                 uid: this.data.user.token,
    //                 title: t.title,
    //                 name: t.name,
    //                 tel: t.tel,
    //                 info: t.editor
    //             },
    //             success: (res) => {
    //                 wx.hideLoading()
    //                 wx.showModal({
    //                     title: '提示',
    //                     showCancel: false,
    //                     content: '上传成功，审核结果我们将尽快以消息的方式通知您，点击 确定 返回',
    //                     success() {
    //                         wx.navigateBack({
    //                             delta: 1
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     };
    // },

    /*产品上传*/
    plus_state_choo() {//产品展示和产品上传页面切换
        let plus_state = this.data.plus_state;
        plus_state = !plus_state;
        console.log(plus_state)
        this.setData({ plus_state });
    },
    deletePro(e) { //删除产品
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let data = this.data.data
        data.shop.splice(idx, 1)
        wx.showModal({
            title: '提示',
            content: '您确定删除这个产品吗',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: 'https://xczyzx.com/index.php/index/shop/delShop',
                        data: {
                            id: id
                        },
                        success: (res) => {
                            this.setData({
                                data
                            })
                        }
                    })
                }
            }
        })

    },
    tag_choo(e) { //产品针对人群
        let id = e.currentTarget.dataset.id;
        let data = this.data.data;
        let up_data = this.data.up_data;
        for (var i = 0; i < data.type.length; i++) {
            if (data.type[i].id == id) {
                data.type[i].act = true;
                up_data.type = data.type[i].id;
            } else {
                data.type[i].act = false;
            }
        };
        this.setData({ data, up_data });
    },
    choo_part(e) { //资源地区选择
        let list_0 = this.data.data.address;//tree
        let part = this.data.part;
        if (e.detail.column == 0) {
            let k = e.detail.value;
            //第一竖列
            let list_2 = []
            let list_3 = []
            for (let i = 0; i < list_0[k].son.length; i++) {
                list_2.push({ name: list_0[k].son[i].name })
                for (let j = 0; j < list_0[k].son[i].son.length; j++) {
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
                    name: list_0[0].son[k].son[i].name,
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
        let k1 = k[0]
        let k2 = k[1];
        let k3 = k[2] == null ? 0 : k[2];
        let part = this.data.part;
        let id = part[2][k3].id
        let t = this.data.up_data;
        t.pid = id
        this.setData({
            data_part: part[0][k1].name + ' ' + part[1][k2].name + ' ' + part[2][k3].name,
            up_data: t
        });
    },
    // up_btn_step_2() { //产品开始上传
    //     let t = this.data.up_data;
    //     if (t.i_name == undefined) {
    //         getApp().alert('请填写产品名称');
    //     } else if (t.price == undefined) {
    //         getApp().alert('请填写产品预算');
    //     } else if (t.people == undefined) {
    //         getApp().alert('请填写针对人群');
    //     } else if (t.editor == undefined) {
    //         getApp().alert('请填写组织介绍');
    //     } else {
    //         wx.showLoading({
    //             title: '上传中···'
    //         });
    //         t.plus_state = true
    //         this.setData({
    //             data: t
    //         })
    //         wx.request({
    //             url: 'https://xczyzx.com/index.php/index/Society/addCourse',
    //             data: {
    //                 uid: this.data.user.token,
    //                 i_name: t.i_name,
    //                 people: t.people,
    //                 info: t.editor,
    //                 price: t.price,
    //             },
    //             success: (res) => {
    //                 wx.hideLoading()
    //                 wx.showModal({
    //                     title: '提示',
    //                     showCancel: false,
    //                     content: '上传成功，审核结果我们将尽快以消息的方式通知您，点击 确定 返回',
    //                     success() {
    //                         wx.navigateBack({
    //                             delta: 1
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     };
    // },

    /*富媒体编辑器*/
    onEditorReady() { //编辑器初始化
        const then = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            then.editorCtx = res.context
        }).exec();
    },
    format(e) { //编辑器按钮逻辑
        let {
            name,
            value
        } = e.target.dataset;
        if (!name) return;
        this.editorCtx.format(name, value);
    },
    edit_blod() { //编辑器按钮样式
        let formats = this.data.formats;
        formats.bold = !formats.bold;
        this.setData({
            formats
        });
    },
    edit_back() { //编辑器按钮样式
        let formats = this.data.formats;
        formats.back = !formats.back;
        this.setData({
            formats
        });
    },
    insertImage() {
        wx.chooseImage({
            count: 4,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                wx.showLoading({
                    title: '上传图片中...',
                    mask: true
                })
                this.uploadimg(res.tempFilePaths)
            }
        })
    },
    uploadimg(data) {
        var i = data.i ? data.i : 0;
        wx.uploadFile({
            url: 'https://xczyzx.com/index.php/index/upload/upload_img',
            filePath: data[i],
            name: 'img',
            formData: 'null',
            success: res => {
                var str = res.data
                var pic = JSON.parse(str);
                console.log(pic.img)
                this.editorCtx.insertImage({
                    src: pic.img,
                    data: {
                        id: 'abcd',
                        role: 'god'
                    },
                    success: function () {
                        console.log('insert image success')
                    }
                })
            },
            complete: res => {
                i++;
                data.i = i
                if (i !== data.length) {
                    this.uploadimg(data);
                } else {
                    wx.hideLoading();
                }
            }

        })
    },
    onEditorBlur(e) {//编辑器赋值
        var up_data = this.data.up_data;
        up_data.editor = e.detail.html;
        this.setData({ up_data });
    },
/*图片上传相关*/
    chooseImage(e) { //图片选择
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: 6,
            success: res => {
                // let t = this.data.img_path;
                // t = [...res.tempFilePaths]
                // // t.push();
                // // console.log(res)
                // this.setData({
                //     img_path: t
                // });
                let t = JSON.parse(JSON.stringify(this.data.img_path))
                for (let i = 0; i < res.tempFilePaths.length; i++) {
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
        let t = JSON.parse(JSON.stringify(this.data.img_path))
        t.splice(i, 1);
        this.setData({
            img_path: t
        });
    },


    up_btn_step_2(e) { //开始上传
        let up_data = this.data.up_data;
        console.log(up_data)
        let arr = Object.keys(up_data);
        if (arr.length<6) {
            app.alert('请先填写全部表单');
        }else if (reg.test(this.data.up_data.tel) == false) {
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
            url: 'https://xczyzx.com/index.php/index/shop/returnSrc',
            filePath: this.data.img_path[this.data.now_up],
            name: 'img',
            success: (res) => {
                console.log(res)
                let info = JSON.parse(res.data);
                if (info.state) {
                    let d = this.data.up_data;
                    d.image_url.push(info.img);
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
        let t = this.data.up_data
        console.log(t)
        wx.request({
            url: "https://xczyzx.com/index.php/index/shop/addShop",
            data: {
                uid: this.data.user.token,
                name: t.i_name,
                tel: t.tel,
                price: t.price,
                shoptype_id: t.type,
                three: t.pid,
                info: t.editor,
                img: t.image_url
                },
            success: function (res) {

                console.log(res)
                wx.hideLoading();
                app.alert('成功');//这里写数据成功后的逻辑\
                wx.navigateBack({
                    delta: 1,
                })
            }
        });
    },
    
});