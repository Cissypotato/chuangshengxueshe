var app = getApp();
Page({
    data: {
        num: 0,
        desc: "为资源打分",
        imgList: [],
        fileImgList: [],
        remarks: ''
    },
    onLoad: function(options) {
        console.log(options)
        var then = this
        then.setData({
            id: options.id,
            res: options.res
        })
    },
    changeNum: function(e) {
        var then = this
        then.setData({
            num: e.currentTarget.id,
        })
    },
    textareaAInput: function(e) {
        var then = this
        then.setData({
            remarks: e.detail.value
        })
    },
    ChooseImage() {
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        this.data.imgList.splice(e.currentTarget.dataset.index, 1);
        this.setData({
            imgList: this.data.imgList
        })
    },
    submission(e) {
        let then = this
        let imgList = then.data.imgList
        let num = then.data.num
        let remarks = then.data.remarks
        if (num != 0 && remarks != '') {
            if (imgList.length != 0) {
                then.uploadimg({
                    url: app.globalData.appUrl + "Upload/upload_img",
                    path: imgList,
                });
            } else {
                then.uploadForm()
            }
        } else {
            wx.showToast({
                title: '请打分和给予评价',
                icon: 'none',
                duration: 1000,
            })
        }
    },
    uploadimg: function(data) {
        var then = this,
            i = data.i ? data.i : 0,
            success = data.success ? data.success : 0,
            fail = data.fail ? data.fail : 0;

        wx.showLoading({
            title: '上传中...',
            mask: true,
        })
        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            name: 'img',
            formData: 'null',
            success: function(res) {
                wx.hideLoading();
                success++;
                var str = res.data //返回的结果，可能不同项目结果不一样
                var pic = JSON.parse(str);
                var pic_name = pic.img;
                var fileImgList = then.data.fileImgList;
                fileImgList.push(pic_name)
            },
            fail: function(res) {
                fail++;
                console.log('fail:' + i + "fail:" + fail);
            },
            complete: function(res) {
                i++;
                if (i == data.path.length) {
                    then.uploadForm()
                } else { //若图片还没有传完，则继续调用函数
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    then.uploadimg(data);
                }
            },
        })
    },
    uploadForm: function() {
        var then = this
        console.log(then.data.fileImgList)
        wx.request({
            url: app.globalData.appUrl + 'comment/add_comment',
            data: {
                uid: wx.getStorageSync('token'),
                resources_id: then.data.res,
                score: then.data.num,
                content: then.data.remarks,
                img: then.data.fileImgList,
                order_id: then.data.id
            },
            method: 'post',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                setTimeout(function() {
                    wx.reLaunch({
                        url: '/pages/mine/home/home',
                        success: function(res) {
                            wx.showToast({
                                title: '评论成功',
                                icon: 'none',
                                duration: 1000,
                            })
                        }
                    })

                }, 200)

            },
        })
    }

})