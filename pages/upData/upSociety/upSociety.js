const app = getApp();
let reg = app.globalData.myreg
Page({
    data: {
        uid: 0,
        initial_data:{},
        up_data: {},
        picker:{
            index: 0,
            pickerValue: "请点击进行选择",
        },
        formats:{},

    },
    onLoad(options) {
        let id = wx.getStorageSync("token")
        wx.request({
            url: 'https://xczyzx.com/index.php/index/Society/returnIsSociety',
            data: {
                uid: id
            },
            success: (res) => {
                let data = res.data
                console.log(data)
                let initial_data = this.data.initial_data
                let up_data = this.data.up_data
                this.setData({
                    uid:id,
                    initial_data: data,
                    // toCertify: data.state,
                    // projects: data.item,
                    // tag:data.type,
                    // societyName:data.name
                })
            },
        })
    },
    // onShow: function() {
    // },


/*社会组织*/
    input_data(e) { //社会组织文本框数据赋值
        let item = this.data.up_data;
        let k = e.currentTarget.dataset.t;
        if (e.detail.value !== "") {
            console.log(e.detail.value)
            item[k] = e.detail.value;
            this.setData({
                up_data: item
            });
        }
        console.log(item)
    },
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
    submitForm(e) { //社会组织开始上传
        let up_data = this.data.up_data;
        // console.log(up_data)
        if (up_data.title==undefined) {
            app.alert('请填写社会组织名字');
        }else if (up_data.name == undefined) {
            app.alert('请填写联系人名字');
        }else if (up_data.tel== undefined || reg.test(this.data.up_data.tel) == false) {
            app.alert('请填写有效电话号码');
        }else if (up_data.editor == undefined) {
            app.alert('请填写组织介绍');
        }else if (this.data.img_path.length == 0) {
            app.alert('请先上传照片');
        } else {
            wx.showLoading({
                title: '上传中···',
            });
            wx.uploadFile({
                url: 'https://xczyzx.com/index.php/index/Society/addSociety',
                filePath: this.data.img_path,
                name: 'img',
                formData: {
                    uid: this.data.uid,
                    title: up_data.title,
                    name: up_data.name,
                    tel: up_data.tel,
                    info: up_data.editor
                },
                success: (res) => {
                    console.log(res)
                    wx.hideLoading();
                    app.alert("添加组织成功，审核结果我们将尽快以消息的方式通知您")
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/index/home/home',
                        })
                    }, 2000)
                },

            });
        };
    },
    reSubmit(){//社会组织审核失败回到提交社会组织提交页面
       let initial_data=this.data.initial_data
       initial_data.state=3
       this.setData({
           initial_data
       })
    },

/*项目*/
    deletePro(e) { //删除项目
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let initial_data= this.data.initial_data
        initial_data.item.splice(idx, 1)
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
                                initial_data
                            })
                        }
                    })
                }
            }
        }) 
        

        
    },
    bindPickerChange: function (e) {//项目 针对人群picker选择事件
        let tag = this.data.initial_data.type
        let id = tag[e.detail.value].id
        let picker=this.data.picker
        let up_data = this.data.up_data
        picker.index = e.detail.value
        picker.pickerValue= tag[e.detail.value].name
        up_data["project_tag"] = id
        this.setData({
            picker,
            up_data
            
        })
    },
    submitProject() {//提交项目数据
        let up_data = this.data.up_data
        // let arr = Object.keys(data)
        console.log(up_data)
        if (up_data.project_title == undefined) {
            app.alert('请填写项目名字');
        } else if (up_data.project_price == undefined) {
            app.alert('请填写项目预算');
        } else if (up_data.project_tag == undefined ) {
            app.alert('请选择项目针对人群');
        } else if (up_data.editor == undefined) {
            app.alert('请填写先项目介绍');
        }else {
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Society/addCourse',
                data: {
                    uid: this.data.uid,
                    i_name: up_data.project_title,
                    people: up_data.project_tag,
                    info: up_data.editor,
                    price: up_data.project_price,
                },
                success: (res) => {
                    app.alert("添加项目成功，审核结果我们将尽快以消息的方式通知您")
                    setTimeout(()=>{
                        wx.redirectTo({
                            url: '/pages/index/home/home',
                        })
                    },2000)   
                },
            })

        }

    },
   
/*富文本*/
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
});