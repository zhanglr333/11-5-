/**
 * Created by LiRong on 2017/11/24.
 */

    //@@@@@@@@@@@--倒计时模块--@@@@@@@@@@@@@@@@@@@@@@
class Timer{
    //定义一个方法，三个参数end表示截止时间，update表示时间更新的回调，
    //handle表示倒计时结束后的回调。
    countdown(end,update,handle){

        const now = new Date().getTime();
        //获取当前时间的毫秒数，便于计算
        const self = this;
        console.log(self);
        //获取当前对象的指针，指的是？？Timer？？，在countdown（）方法里将this缓存下来
        //判断当前时间与截止时间的关系，
        if(now-end>0){
            handle.call(self);
            //若不这样写，则handle（）里的this指向就是window
        }else{

            let last_time=end-now;
            const px_d=24*60*60*1000;
            const px_h=60*60*1000;
            const px_m=60*1000;
            const px_s=1000;
            let d=Math.floor(last_time/px_d);
            let h=Math.floor((last_time-d*px_d)/px_h);
            let m=Math.floor((last_time-d*px_d-h*px_h)/px_m);
            let s=Math.floor((last_time-d*px_d-h*px_h-m*px_m)/px_s);
            //@@@@@@@以上是将剩余的时间按照d,h,m,s计算出来。
            let r=[];
            if(d>0){
                r.push(`<em>${d}</em>天`);
            }
            if(r.length||(h>0)){
                //判断r.length，如果没有天，1.前面就不能有天，2.就不会有时，理解||为或者
                r.push(`<em>${h}</em>时`);
            }
            if(r.length||(m>0)){
                r.push(`<em>${m}</em>分`);
            }
            if(r.length||(s>0)){
                r.push(`<em>${s}</em>秒`);
            }
            self.last_time=r.join("");//给Timer添加属性。
            update.call(self,r.join(""));
            //1秒后更新一次倒计时
            setTimeout(function(){
                self.countdown(end,update,handle);
            },1000);
        }
    }
}
export default Timer