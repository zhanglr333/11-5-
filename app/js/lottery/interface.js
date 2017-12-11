/**
 * Created by LiRong on 2017/11/24.
 */
//@@@@@@@@@@@将项目中涉及的接口封装在一个类里，通过实例化后，@@@@@@@@@@
// 对象就能拿到所有的接口，
//这样调用方便，也便于维护，需要修改，新增，删除某个接口时，
// 只要找到这个模块，就可以轻松解决
import $ from 'jquery';
class Interface{
    //获取遗漏数据，issue为期号
    getOmit(issue){
        let self=this;
        console.log(self);
        return new Promise((resolve,reject)=>{
            console.log(this);
            $.ajax({
                url:'/get/omit',//请求地址
                data:{           //请求数据
                    issue:issue
                },
                dataType:'json',//响应数据格式
                success:function(res){ //请求成功后的回调函数
                    self.setOmit(res);//?????????????????????
                    //保存数据
                    //setOmit是其他类的一个方法，lottery多重继承四个类，
                    // 引入当前this对象，在接口的类中就能拿到这个方法，从而保存了数据。
                    resolve.call(self,res);
                },
                error:function(err){    //请求失败后的回调函数
                    reject.call(err);
                }
            })
        })
    }
    //获取开奖号码
    getOpenCode(issue){
        let self=this;
        return new Promise(function(resolve,reject){
        $.ajax({
            url:'/get/opencode',
            data:{
                issue:issue
            },
            dataType:'json',
            success:function(res){
                self.setOpenCode(res,data);
                resolve.call(self,res)
            },
            error:function(err){
                reject.call(err)
            }
        })
        })
    }
    //获取当前状态
    getState(issue){
        let self=this;
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:'/get/state',
                data:{
                    issue:issue
                },
                dataType:'json',
                success:function(res){
                    //self.setState(res,data);
                    resolve.call(self,res)
                },
                error:function(err){
                    reject.call(err)
                }
            })
        })
    }
}
export default Interface