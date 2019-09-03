App({
    globalData: {
        myreg: /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/,
        appUrl: 'https://xczyzx.com/index.php/index/',
        user_real:false,
    },
    onLaunch: function () {
       
    },
    alert(k) {//错误警告
        wx.showToast({
            title: k,
            icon: 'none',
            duration: 2000,
        })
    },
    aima_1:function(t){//滑动动画组件
        if(t){
            return wx.createAnimation({
                duration: 0,
                timingFunction: "step-end",
            }).translateX(100).opacity(0).step().export();
        }else{
            return wx.createAnimation({
                duration: 800,
                timingFunction: "ease",
            }).translateX(0).opacity(1).step().export();
        };
    },
    aima_2: function (t) {//旋转动画组件
        if (t) {
            return wx.createAnimation({
                duration:800,
                timingFunction: "ease",
            }).rotateY(180).opacity(1).step().export();
        } else {
            return wx.createAnimation({
                duration: 0,
                timingFunction: "step-end",
            }).rotateY(0).opacity(1).step().export();
        };
    },
});
