/**
 * Created by LiRong on 2017/11/24.
 */
    //计算模块，钱，注数
class Calculate{
    //计算注数
    //active 是当前选中的号码个数
    //play_name是当前的玩法标识
    computeCount(active,play_name){
        let count=0;//当前注数默认为0；
        const exist=this.play_list.has(play_name);
        //判断玩法是否存在。
        const arr=new Array(active).fill('0');
        //创建数组的同时，赋值一个常量（表示数组的长度，但是是空的），所以用fill将数组中的每个元素都变为‘0’
        //let e=new Array(3);console.log(e);//(3) [empty × 3]
        if(exist && play_name.at(0)==="r"){
            count=Calculate.combine(arr,play_name.split('')[1]).length;
            //combine是静态方法，通过类去调用
            // 用指定字符分割字符串，返回一个数组.
        }//不满足时count为0.
        return count;
    }
    //@@@@@@@@@@组合运算，@@@@@@@@@
    // 指的是从x个元素中，选出y个进行组合，有多少种方案
    // arr是参与组合运算的数组，size是组合运算的基数@@@@@@@@@@@
    static combine(arr,size){   //???最后算出来是什么
        let allResult=[];//最后的结果。
        //为了及时运行函数，采用自调，三个参数对应f函数中的参数,
        // 在es6中不能匿名自调
        //假设选中的是任二，则size是二，arr是选中号码的集合，
        (function f(arr,size,result){
            let arrLen=arr.length;
            //如果集合小于基数，返回
            if(size>arrLen){
                return;
            }
            //如果两者相等，则
            if(size===arrLen){
                allResult.push([].concat(result,arr));
                console.log(allResult);
                console.log(result);
            }else{
                for(let i=0;i<arrLen;i++){
                    let newResult=[].concat(result);
                    newResult.push(arr[i]);
                    if(size===1){
                        allResult.push(newResult)
                    }else{
                        let newArr=[].concat(arr);
                        newArr.splice(0,i+1);
                        f(newArr,size-1,newResult)
                    }
                }
            }
        })(arr,size,[])
        return allResult;
    }
    //计算金额，奖金范围预测
    //active 是当前选中的号码个数
    computeBonus(active,play_name) {
        const play = play_name.split('');//['r','二']
        const self = this;
        let arr = new Array(play[1] * 1).fill(0);
        let min,max;//???????????????????????
        if (play[0] === 'r') {
            let min_active = 5 - (11 - active);//最小命中数，
            // 11中5，选了active个，剩下的号码11 - active全中，则选中的号码中，能中的号码数5 - (11 - active)，即为最小命中数。
            //一共有5个号码会中，如选中<6个，则最小命中数是<0，选中=6个，则最小命中数是=0
            // 如选中>6个，则最小命中数>0，如选中7个，则最小命中数是1，因为剩下4个号码，则选择的号码中一定会有一个中


            //最小命中数>0，选中>6个，最大是5.
            if (min_active > 0) {

                //选择任五，任四及以下。
                if (min_active - play[1] >= 0) {
                    arr = new Array(min_active).fill(0);
                    min = Calculate.combine(arr, play[1]).length;
                } else {    //选择任六及以上。
                    //选号满足要求。要求至少选择play[1]个。
                    if (play[1] - 5 > 0 && active - play[1] >= 0) {
                        arr = new Array(active - 5).fill(0);
                        min = Calculate.combine(arr, play[1] - 5).length;
                        //arr = new Array(active).fill(0);
                        // min = Calculate.combine(arr,5).length;
                    } else {//选号不满足要求。选择少于play[1]个。
                        min = active - play[1] > -1 ? 1 : 0
                    }
                }


            } else {//不能全中的情况。
                min = active - play[1] > -1 ? 1 : 0;
            }

            //最大命中数，最大是5，在active中选择最小的数。
            let max_active = Math.min(active, 5);

            //选任六及以上。
            if (play[1] - 5 > 0) {

                if (active - play[1] >= 0) {
                    arr = new Array(active - 5).fill(0);
                    max = Calculate.combine(arr, play[1] - 5).length;
                } else {
                    max = 0;
                }
                //选任五以下
            } else if (play[1] - 5 < 0) {
                arr = new Array(Math.min(active, 5)).fill(0);
                max = Calculate.combine(arr, play[1]).length;
                //选任五
            } else {
                max = 1;
            }
        }
        return [min,max].map(item=>item*self.play_list.get(play_name).bonus);//???play_name?
        //map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
        }
}
export default Calculate