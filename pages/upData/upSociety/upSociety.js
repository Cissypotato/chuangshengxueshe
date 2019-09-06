const app = getApp();
let reg = app.globalData.myreg
Page({
    data: {
        uid: 0,
        up_data: {},
        img_path: [],
        // isLogin: 1,
        // need_data: null,
        projectItem: {},
        projects: [],
        // projectTitle: [],
        // isOrganization: false,
        // isAddProject: false,
        toCertify: 3,
        state: 3,
        formats: {},
        bottom: 0,
        readOnly: false,
        placeholder: '输入项目介绍...',
        _focus: false,
        isIcon: false,
        iconText: '展开',
        tag:[],
        index:0,
        pickerValue:"请点击进行选择",
        societyName:""

    },
    onLoad(options) {
        let id = wx.getStorageSync("token")
        // console.log(id)
        wx.request({
            url: 'https://xczyzx.com/index.php/index/Society/returnIsSociety',
            data: {
                uid: id
            },
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
                // console.log(res)
                let data = res.data
                let up_data = this.data.up_data
                up_data["uid"] = id
                // console.log(data.type)
                this.setData({
                    uid: id,
                    up_data,
                    toCertify: data.state,
                    projects: data.item,
                    tag:data.type,
                    societyName:data.name
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })

    },
    onShow: function() {
        
    },


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
        } else {
            console.log(e.detail.value)
            app.alert("请填写相关信息")

        }
        console.log(item)

    },
    chooseImage(e) { //图片选择
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: 1,
            success: res => {
                console.log(res)
                let t = this.data.img_path;
                t = res.tempFilePaths[0]
                this.setData({
                    img_path: t
                });
            }
        })
    },
    handleImagePreview(e) { //图片浏览
        wx.previewImage({
            current: this.data.img_path,
            urls: this.data.img_path
        });
    },
    removeImage(e) { //图片删除
        this.setData({
            img_path: ""
        });
    },
    submitForm(e) { //社会组织开始上传
        let up_data = this.data.up_data;
        let arr = Object.keys(up_data);
        console.log(arr.length)

        if (arr.length < 5) {

            app.alert('请先填写全部表单');
        } else if (reg.test(this.data.up_data.tel) == false) {
            app.alert('请填写有效电话号码');
        } else
        if (this.data.img_path.length == 0) {
            app.alert('请先上传照片');
        } else {
            wx.showLoading({
                title: '上传中···',
            });
            this.setData({
                now_up: 0
            });
            this.img_up();
        };
    },
    img_up() { //图片上传
        let data = this.data.up_data
        console.log(data)
        wx.uploadFile({
            url: 'https://xczyzx.com/index.php/index/Society/addSociety',
            filePath: this.data.img_path,
            name: 'img',
            formData: {
                uid: data.uid,
                title: data.title,
                name: data.name,
                tel: data.tel,
                info: data.editor
            },
            success: (res) => {
                console.log(res)
                wx.hideLoading();
                app.alert("添加组织成功，审核结果我们将尽快以消息的方式通知您")
                setTimeout(() => {
                    wx.reLaunch({
                        url: '/pages/upData/upData',
                    })
                }, 2000)    
            },
        
        });
    },


/*项目*/
    input_project_data(e) { //项目文本框数据赋值
        let projectItem = this.data.projectItem
        let k = e.currentTarget.dataset.t;
        if (e.detail.value !== "") {
            projectItem[k] = e.detail.value;
            this.setData({
                projectItem
            })
        } else {
            console.log(e.detail.value)
            app.alert("请填写相关信息")

        }

    },

    deletePro(e) { //删除项目
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        let projects = this.data.projects
        projects.splice(idx, 1)
        
        

       
        
    },

    bindPickerChange: function (e) {//项目 针对人群picker选择事件
        let tag = this.data.tag
        let id = tag[e.detail.value].id
        let pickerValue = tag[e.detail.value].name
        let projectItem = this.data.projectItem
        projectItem["project_tag"] = id
        this.setData({
            index: e.detail.value,
            projectItem,
            pickerValue
        })
    },

    submitProject() {//提交项目数据
        let data = this.data.projectItem

        let arr = Object.keys(data)
        console.log(data)
        if (arr.length < 4) {
            app.alert("请填写全部信息")
        } else {
            wx.request({
                url: 'https://xczyzx.com/index.php/index/Society/addCourse',
                data: {
                    uid: this.data.uid,
                    i_name: data.project_title,
                    people: data.project_tag,
                    info: data.editor,
                    price: data.project_price,
                },
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    app.alert("添加项目成功，审核结果我们将尽快以消息的方式通知您")
                    setTimeout(()=>{
                        wx.reLaunch({
                            url: '/pages/upData/upData',
                        })
                    },2000)
                    
                },
                fail: function(res) {},
                complete: function(res) {},
            })

        }

    },
   

/*富文本*/
    zk() {
        var iconText;
        if (this.data.isIcon) {
            iconText = '展开'
        } else {
            iconText = '收起'
        }
        this.setData({
            isIcon: !this.data.isIcon,
            iconText
        })
    },
    readOnlyChange() {
        this.setData({
            readOnly: !this.data.readOnly
        })
    },
    onEditorReady() {
        const then = this
        wx.createSelectorQuery().select('#editor').context(function(res) {
            then.editorCtx = res.context
        }).exec()
    },    
    undo() {// 富文本撤回
        this.editorCtx.undo()
    },  
    redo() {// 富文本重回
        this.editorCtx.redo()
    },
    format(e) {
        let {
            name,
            value
        } = e.target.dataset
        if (!name) return
        // console.log('format', name, value)
        this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
        const formats = e.detail
        this.setData({
            formats
        })
    },
    
    insertDivider() {//富文本添加分隔符
        this.editorCtx.insertDivider({
            success: function() {
                console.log('insert divider success')
            }
        })
    },
    
    clear() {//富文本清空文本框
        this.editorCtx.clear({
            success: function(res) {
                console.log("clear success")
            }
        })
    },
    
    removeFormat() {//删除富文本选择
        this.editorCtx.removeFormat()
    },
    insertDate() {//富文本添加当前时间
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        })
    },
    
    insertImage() {
        var then = this;
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
    onEditorBlur(e) {//组织富文本
        var up_data = this.data.up_data;
        this.editorCtx.getContents({
            success: res => {
                up_data.editor = res.html;
                this.setData({
                    up_data: up_data
                })
            }
        })
    },
    onEditorBlur_2(e) {//项目富文本
        let data = this.data.projectItem
        this.editorCtx.getContents({
            success: res => {
                data.editor = res.html;
                this.setData({
                    projectItem: data
                })
            }
        })
    },
    
});