/**
 * Created by LiRong on 2017/11/24.
 */
import 'babel-polyfill';
import Base from  './lottery/base.js';
import Timer from './lottery/timer.js';
import Calculate from './lottery/calculate.js';
import  Interface from'./lottery/interface.js';
import $ from 'jquery';

//实现多重继承，es6只提到extends实现继承，没有提供直接操作多重继承的方式，需要自己写，多重继承就需要用到深层拷贝

//@@@@@@@@@@@@@@深层拷贝的方法，target,source是拷贝的目标和源对象，后拷贝到前面
const copyProperties=function(target,source){
    //Reflect.ownKeys()返回一个数组,该方法返回对象所有自身的属性
    for(let key of Reflect.ownKeys(source)){
        if(key!=='constructor'&&key!=='prototype'&&key!=='name'){
            let desc=Object.getOwnPropertyDescriptor(source,key);
            //getOwnPropertyDescriptor返回指定对象上一个自有属性对应的属性描述符
            Object.defineProperty(target,key,desc);
            //defineProperty()直接在一个对象上定义一个新属性，或者修改一个已经存在的属性， 并返回这个对象。target需要定义属性的对象,key需定义或修改的属性的名字,desc:将被定义或修改的属性的描述符
        }
    }
}

//多重继承的方法
//rest参数...mixins,用于获取函数的多余参数
const mix=function(...mixins){
    class Mix{}//申明一个空类
    for(let mixin of mixins){
        copyProperties(Mix,mixin);//将mixin深度拷贝到Mix上。
        copyProperties(Mix.prototype,mixin.prototype);
    }
    return Mix
}
//<!--end 以上就是实现多重继承的方法-->

class Lottery extends mix(Base,Calculate,Interface,Timer){
    //mix(Base,Calculate,Interface,Timer)，返回一个类，但是这里的//mix已经实现了多个类的继承
    //构建函数name区别多个彩种，name='syy',cname='11选5',issue='**',state='**'这些是lottery的默认参数
 constructor(name='syy',cname='11选5',issue='**',state='**'){
     super();
     //子类必须在父类的构造函数中调用super()，这样才有this对象，因为this对象是从父类继承下来的
     this.name=name;
     this.cname=cname;
     this.issue=issue;
     this.state=state;
     this.el='';
     this.omit=new Map();
     this.open_code=new Set();
     this.open_code_list=new Set();
     this.play_list=new Map();
     this.number=new Set();
     this.issue_el='#curr_issue';
     this.countdown_el='#countdown';
     this.state_el='.state_el';
     this.cart_el='.codelist';
     this.omit_el='';
     this.cur_play='r5';
     this.initPlayList();
     this.initNumber();
     this.updateState();
     this.initEvent();
 }

    updateState(){
        let self=this;
        this.getState().then(function(res){
            self.issue=res.issue;
            self.end_time=res.end_time;
            self.state=res.state;
            $(self.issue_el).text(res.issue);
            self.countdown(res.end_time,function(time){
                $(self.countdown_el).html(time);
            },function(){
                setTimeout(function(){
                    self.updateState();
                    self.getOmit(self.issue).then(function(res){

                    });
                    self.getOpenCode(self.issue).then(function(res){

                    })
                },500)
            })
        })
    }
//初始化事件
    initEvent(){
        let self=this;
        $('#plays').on('click','li',self.changePlayNav.bind(self));
       //任选玩法
        $('.boll-list').on('click','.btn-boll',self.toggleCodeActive.bind(self));
        //号码
        $('#confirm_sel_code').on('click',self.addCode.bind(self));//确认选号，清空号码
        $('.dxjo').on('click','li',self.assistHandle.bind(self));
        //全，大小奇偶
        $('.qkmethod').on('click','.btn-middle',self.getRandomCode.bind(self));//机选
    }
}

export default Lottery;





