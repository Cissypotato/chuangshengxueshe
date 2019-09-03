const app = getApp();
Page({
   data: {
      formats: {},
      bottom: 0,
      readOnly: false,
      placeholder: '输入课程介绍...',
      _focus: false,
      isExpert: true,
      startDate: '2019-09-01',
      endDate: '2019-09-01',
      startTime: '00:00',
      endTime: '00:00',
      data_part: '',
      need_data: null,
      up_data: {},
   },
   onLoad() {

   },
   onShow(){
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
               resource_type: res.data.sort,
               list_0: res.data.tree,
               part: list_4
            });
         }
      });
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
      const then = this

      wx.chooseImage({
         count: 4,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success(res) {
            console.log(res)
            res.tempFilePaths.forEach(item => {
               then.editorCtx.insertImage({
                  src: item,
                  data: {
                     id: 'abcd',
                     role: 'god'
                  },
                  success: function() {
                     console.log('insert image success')
                  }
               })
            })

         }
      })
   },
   bindDateChange(e) {
      if (e.currentTarget.dataset.name === "startDate") {
         this.setData({
            startDate: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "endDate") {
         this.setData({
            endDate: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "startTime") {
         this.setData({
            startTime: e.detail.value
         })
      } else if (e.currentTarget.dataset.name === "endTime") {
         this.setData({
            endTime: e.detail.value
         })
      }

   },
   submitForm() {
      this.editorCtx.getContents({
         success: res => {
            console.log(res)
         }
      })
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
})