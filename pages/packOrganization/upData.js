Page({
    data: {
        //用户状态
        user: {},
        //初始数据
        data: {},
        plus_state:true,
        //富文本编辑器按钮样式集
        formats: {},
        //上传数据
        up_data: {},
    },
    onLoad:function(){

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
    onShow: function() { //先获取用户相关状态
       
    },
    data_play(id) { //获取初始数据
        wx.request({
            url: 'https://xczyzx.com/index.php/index/Society/returnIsSociety',
            data: {
                uid: id
            },
            success: (res) => {
                console.log(res.data)
                let data = res.data;
                this.setData({
                    data:{...data}
                });
            }
        })
    },

    /*图片上传模块*/
    chooseImage(e) { //图片选择
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: 1,
            success: res => {
                let t = this.data.img_path;
                t = res.tempFilePaths[0];
                this.setData({
                    img_path: t
                });
            }
        })
    },
    handleImagePreview(e) { //图片浏览
        wx.previewImage({
            current: this.data.img_path,
            urls: [this.data.img_path]
        });
    },
    removeImage(e) { //图片删除
        this.setData({
            img_path: ""
        });
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

    /*社会组织上传*/
    up_btn_step_1(e) { //社会组织开始上传
        let t = this.data.up_data;
        if (t.title == undefined) {
            getApp().alert('请填写组织名字');
        } else if (t.name == undefined) {
            getApp().alert('请填写联系人姓名');
        } else if (t.tel == undefined) {
            getApp().alert('请填写联系电话');
        } else if (t.editor == undefined) {
            getApp().alert('请填写组织介绍');
        } else if (this.data.img_path == undefined || this.data.img_path == []) {
            getApp().alert('请添加组织照片');
        } else {
            wx.showLoading({
                title: '上传中···'
            });
            wx.uploadFile({
                url: 'https://xczyzx.com/index.php/index/Society/addSociety',
                filePath: this.data.img_path,
                name: 'img',
                formData: {
                    uid: this.data.user.token,
                    title: t.title,
                    name: t.name,
                    tel: t.tel,
                    info: t.editor
                },
                success: (res) => {
                    wx.hideLoading()
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '上传成功，审核结果我们将尽快以消息的方式通知您，点击 确定 返回',
                        success() {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        };
    },

    /*项目上传*/
    plus_state_choo() {//项目展示和项目上传页面切换
        let plus_state = this.data.plus_state;
        plus_state = !plus_state;
        console.log(plus_state)
        this.setData({ plus_state });
    },
    deletePro(e) { //删除项目
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let data = this.data.data
        data.item.splice(idx, 1)
        wx.showModal({
            title: '提示',
            content: '您确定删除这个项目吗',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: 'https://xczyzx.com/index.php/index/Society/delItem',
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
    tag_choo(e) { //项目针对人群
        let id = e.currentTarget.dataset.id;
        let data = this.data.data;
        let up_data = this.data.up_data;
        for (var i = 0; i < data.type.length; i++) {
            if (data.type[i].id == id) {
                data.type[i].act = true;
                up_data.people = data.type[i].id;
            }else{
                data.type[i].act = false;
            }
        };
        this.setData({ data, up_data });
    },
    up_btn_step_2() { //项目开始上传
        let t = this.data.up_data;
        if (t.i_name == undefined) {
            getApp().alert('请填写项目名称');
        } else if (t.price == undefined) {
            getApp().alert('请填写项目预算');
        } else if (t.people == undefined) {
            getApp().alert('请填写针对人群');
        } else if (t.editor == undefined) {
            getApp().alert('请填写组织介绍');
        } else {
            wx.showLoading({
                title: '上传中···'
            });
            t.plus_state=true
            this.setData({
                data:t
            })
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Society/addCourse',
                data: {
                    uid: this.data.user.token,
                    i_name: t.i_name,
                    people: t.people,
                    info: t.editor,
                    price: t.price,
                },
                success: (res) => {           
                    wx.hideLoading()
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '上传成功，审核结果我们将尽快以消息的方式通知您，点击 确定 返回',
                        success() {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        };
    },

    /*富媒体编辑器*/
    onEditorReady() { //编辑器初始化
        const then = this
        wx.createSelectorQuery().select('#editor').context(function(res) {
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
        this.setData({up_data});
    },
    re_btn(e){
        let data=this.data.data
        data.state=3
        this.setData({
            data
        })
    }
});