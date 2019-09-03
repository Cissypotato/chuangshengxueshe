const app = getApp();
Page({
    data: {
        resource_type: [],
        data_part: '',
        up_data: {},
        img_path: [],
    },
    onShow: function () {
        wx.request({
            url: 'https://xczyzx.com/index.php/index/address/returnlist',
            success: (res) => {
                console.log(res)
                let data_keys = []; //这里应该接受一个后端传来的数组，内容为前端提交此表单的所有key,key含义，key格式，是否必填
                let list_0 = res.data.tree;
                let list_1 = [];
                let list_2 = [];
                let list_3 = [];
                for (let i = 0; i < list_0.length; i++) {
                    // if (i == 0) {//由于后端传来的地区格式有误，定（i==0）是暂时的妥协处理方法
                    list_1.push({ name: list_0[i].name });
                    for (let a = 0; a < list_0[i].son.length; a++) {
                        list_2.push({ name: list_0[i].son[a].name });
                        if (a == 0) {
                            for (let b = 0; b < list_0[i].son[a].son.length; b++) {
                                list_3.push({
                                    name: list_0[i].son[a].son[b].name,
                                    id: list_0[i].son[a].son[b].id,
                                });
                            };
                        };
                    };
                    // };
                };
                let list_4 = [];
                list_4.push(list_1, list_2, list_3);
                console.log(list_4)
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

            // console.log(list_2)
            // console.log(list_3)
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
        // list_4.push(list_1, list_2, list_3);
        // this.setData({
        //     part
        // });
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
        console.log(part[2])
        this.setData({
            data_part: part[0][k1].name + ' ' + part[1][k2].name + ' ' + part[2][k3].name,
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
        item[k] = e.detail.value;
        console.log(item)
        this.setData({
            up_data: item
        });
    },
    chooseImage(e) { //图片选择
        wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: 6,
            success: res => {
                let t = this.data.img_path;
                t.push(res.tempFilePaths[0]);
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
        let t = this.data.img_path;
        t.splice(i, 1);
        this.setData({
            img_path: t
        });
    },
    submitForm(e) { //开始上传
        let t = this.data.up_data;
        function judge() { //这里写遍历方法与后端传来的data_keys逐个对比
            let arr = Object.keys(t);
            if (arr.length < 16) {
                return true;
            };
        };
        if (judge()) {
            app.alert('请先填写全部表单');
        } else if (this.data.img_path.length == 0) {
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
        wx.request({
            url: 'https://xczyzx.com/index.php/index/resources/addResources',
            data: t,
            success: function (res) {

                console.log(res)
                wx.hideLoading();
                app.alert('成功');//这里写数据成功后的逻辑
            }
        });
    }
});