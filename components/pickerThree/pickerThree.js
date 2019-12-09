// components/pickerThree/pickerThree.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        list_0: {
            type: Array,
            value: [],
        },
        part: {
            type: Array,
            value: [],
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
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
    }
})