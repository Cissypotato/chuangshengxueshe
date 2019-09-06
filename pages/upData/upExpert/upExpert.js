const app = getApp();
Page({
   data: {
      formats: {},
      bottom: 0,
      readOnly: false,
      placeholder: '输入课程介绍...',
      _focus: false,
      isExpert: true,
      startDate: '选择开始日期',
      endDate: '选择结束日期',
      startTime: '选择开始时间',
      endTime: '选择结束时间',
      data_part: '',
      need_data: null,
      up_data: {},
       
       
      rz_data: {},
      rz_img: '',
      isIcon: false,
      iconText: '展开',
   },
   onLoad() {
      this.getUserState();
   },
   onShow() {
      let need_data = this.data.need_data
      wx.request({
         url: 'https://xczyzx.com/index.php/index/address/returnlist',
         success: (res) => {
            let data_keys = [];
            let list_0 = res.data.tree;
            let list_1 = [];
            let list_2 = [];
            let list_3 = [];
            for (let i = 0; i < list_0.length; i++) {
               list_1.push({
                  name: list_0[i].name
               });
            };
            for (let a = 0; a < list_0[0].son.length; a++) {
               list_2.push({
                  name: list_0[0].son[a].name
               });
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
   getUserState() {
      wx.request({
         url: 'https://xczyzx.com/index.php/index/expert/returnIsExpert',
         data: {
            uid: wx.getStorageSync('token')
         },
         success: res => {
            console.log(res)
            this.setData({
               isExpert: res.data.state
            })
            if (res.data.state === 2) {
               app.alert('发布失败请仔细检查')
            }
         },
         fail: function(res) {
            app.alert('获取状态失败请稍后再试')
         },
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
   // 富文本撤回
   undo() {
      this.editorCtx.undo()
   },
   // 富文本重回
   redo() {
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
   //富文本添加分隔符
   insertDivider() {
      this.editorCtx.insertDivider({
         success: function() {
            console.log('insert divider success')
         }
      })
   },
   //富文本清空文本框
   clear() {
      this.editorCtx.clear({
         success: function(res) {
            console.log("clear success")
         }
      })
   },
   //删除富文本选择
   removeFormat() {
      this.editorCtx.removeFormat()
   },
   //富文本添加当前时间
   insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
         text: formatDate
      })
   },
   //富文本图片上传
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
               success: function() {
                  console.log('insert image success')
               }
            })
         },
         complete: res => {
            i++;
            data.i = i
            if (i !== data.length) {
               this.uploadimg(data);
            }else{
               wx.hideLoading();
            }
         }

      })
   },
   onEditorBlur(e) {
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
   bindDateChange(e) {
      var t = this.data.up_data;

      if (e.currentTarget.dataset.name === "startDate") {
         t.startDate = e.detail.value;
         this.setData({
            up_data: t,
            startDate: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "endDate") {
         t.endDate = e.detail.value;
         this.setData({
            up_data: t,
            endDate: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "startTime") {
         t.startTime = e.detail.value;
         this.setData({
            up_data: t,
            startTime: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "endTime") {
         t.endTime = e.detail.value;
         this.setData({
            up_data: t,
            endTime: e.detail.value
         })
      }

   },
   choo_part(e) { //资源地区选择
      let list_0 = this.data.list_0; //tree
      let part = this.data.part;
      if (e.detail.column == 0) {
         let k = e.detail.value;
         //第一竖列
         let list_2 = []
         let list_3 = []
         for (let i = 0; i < list_0[k].son.length; i++) {
            list_2.push({
               name: list_0[k].son[i].name
            })
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
   choo_part_ok(e) {
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
   input_data(e) { //文本框数据赋值
      let item = this.data.up_data;
      let k = e.currentTarget.dataset.t;
      if (e.detail.value !== '') {
         item[k] = e.detail.value;
         this.setData({
            up_data: item
         });
      } else {
         app.alert('请填写相关信息')
      }

   },
   submitForm() {
      
      var up_data = this.data.up_data;
      var arr = Object.keys(up_data);
      console.log(up_data);

      function pd() {
         if (arr.length !== 10) {
            app.alert('请填写全部信息');
            return false;
         } else {
            return true;
         }
      }
      if (pd()) {
         //开始时间和结束时间的时间戳转换
         var startRq = up_data['startDate'] + ' ' + up_data['startTime'] + ':00';
         var endRq = up_data['endDate'] + ' ' + up_data['endTime'] + ':00';
         var start = (new Date(startRq)).getTime() / 1000;
         var end = (new Date(endRq)).getTime() / 1000;

         if (start >= end) {
            alert('结束时间不能大于和等于开始时间')
         } else {
            this.setData({ isBut: !this.data.isBut })
            wx.request({
               url: 'https://xczyzx.com/index.php/index/expert/addCourse',
               data: {
                  uid: wx.getStorageSync('token'),
                  s_name: up_data['name'],
                  start_time: start,
                  end_time: end,
                  three: up_data['pid'],
                  desc: up_data['village'],
                  price: up_data['price'],
                  num: up_data['num'],
                  info: up_data['editor'],
               },
               method: 'POST',
               success:res=> {
                  console.log(res)
                  if (res.data.state) {
                     wx.navigateBack({
                        delta: 1,
                        success: function (res) {
                           app.alert('发布成功等待工作人员审核')
                        },
                     })
                  } else {
                     wx.showToast({
                        title: res.data.info,
                        icon: 'none',
                        duration: 1000,
                        success: res=>{
                           this.onLoad();
                        },
                     })
                  }
               },
               fail: function(res) {
                  app.alert('请求失败请稍后再试')
               },
            })
         }


      }
   },
   rz_data(e) {
      var rz_data = this.data.rz_data;
      var t = e.currentTarget.dataset.t;
      rz_data[t] = e.detail.value;
      this.setData({
         rz_data
      })
   },
   rz_img(e) {
      wx.chooseImage({
         count: 1,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: res => {
            this.setData({
               rz_img: res.tempFilePaths
            })
         }
      })
   },
   rz_sub() {
      var rz_data = this.data.rz_data;
      var arr = Object.keys(rz_data);
      var myreg = app.globalData.myreg;
      var img = this.data.rz_img;

      function pd() {
         if (arr.length !== 3) {
            app.alert('请填写全部信息');
            return false;
         } else if (img === '') {
            app.alert('请上传您的头像');
            return false;
         } else if (!myreg.test(rz_data['tel'])) {
            app.alert('手机号码错误');
            return false;
         } else {
            return true;
         }
      }

      if (pd()) {
         for (var i = 0; i < arr.length; i++) {
            var j = arr[i];
            if (rz_data[j] === '') {
               app.alert('请填写相关信息')
               break;
            } else if (i === 2) {
               wx.uploadFile({
                  url: 'https://xczyzx.com/index.php/index/expert/addExpert',
                  filePath: img[0],
                  name: 'img',
                  formData: {
                     'uid': wx.getStorageSync('token'),
                     'name': rz_data['name'],
                     'tel': rz_data['tel'],
                     'info': rz_data['introduuction'],
                     'img': img[0]
                  },
                  success:res=> {
                     const data = JSON.parse(res.data)
                     if (data.state) {
                        this.onLoad();
                     } else {
                        wx.showToast({
                           title: data.info,
                           icon: 'none',
                           duration: 1000,
                           success: function(res) {
                              this.onLoad();
                           },
                        })
                     }
                  }
               })
            }
         }

      }
   }
})