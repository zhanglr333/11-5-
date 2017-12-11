/**
 * Created by LiRong on 2017/11/24.
 */
    //彩种的玩法，奖金，开奖号，

//任选2：至少选择两个号码投注，选号与开奖号码任意两位一致，则中奖。
//任选3：至少选择三个号码投注，选号与开奖号码任意三位一致，则中奖。
//任选4：至少选择四个号码投注，选号与开奖号码任意四位一致，则中奖。
//任选5：至少选择五个号码投注，选号与开奖号码全部一致，则中奖。
//任选6：至少选择六个号码投注，选号任意五位与开奖号码一致，则中奖。
//任选7：至少选择七个号码投注，选号任意五位与开奖号码一致，则中奖。
//任选8：至少选择八个号码投注，选号任意五位与开奖号码一致，则中奖。
import $ from 'jquery';
class Base{
    //initPlayList 初始化奖金和玩法及说明
    initPlayList(){
        //使用map数据结构
        this.play_list.set('r2',{
            bonus:6,
            tip:'从01-11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
            name:'任二'
        })
            .set('r3',{
                bonus:19,
                tip:'从01-11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
                name:'任三'
            })
            .set('r4',{
                bonus:78,
                tip:'从01-11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
                name:'任四'
            })
            .set('r5',{
                bonus:540,
                tip:'从01-11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
                name:'任五'
            })
            .set('r6',{
                bonus:90,
                tip:'从01-11中任选6个或多个号码，所选号码任意五位与开奖号码一致，即中奖<em class="red">90</em>元',
                name:'任六'
            })
            .set('r7',{
                bonus:26,
                tip:'从01-11中任选7个或多个号码，所选号码任意五位与开奖号码一致，即中奖<em class="red">26</em>元',
                name:'任七'
            })
            .set('r8',{
                bonus:9,
                tip:'从01-11中任选8个或多个号码，所选号码任意五位与开奖号码一致，即中奖<em class="red">9</em>元',
                name:'任八'
            })
    }
    //initNumber 初始化号码,使用set数据结构
    initNumber(){
        for(let i=1;i<12;i++){
            this.number.add((''+i).padStart(2,'0'));
            //padStart()用于头部补全,第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
        }
    }
    //设置遗漏数据,使用map数据结构
    setOmit(omit){
        let self=this;
        self.omit.clear();//先清空
        // 再重新赋值。entries()是对键值对的遍历。
        for(let [index,item] of omit.entries()){
            self.omit.set(index,item)
        }
        $(self.omit_el).each(function(index,item){
            //each(callback)以每一个匹配的元素作为上下文来执行一个函数。
            $(item).text(self.omit.get(index));
            //text(val)设置所有匹配元素的文本内容
        });
    }
    //设置开奖,使用set数据结构,因为不能重复。
    setOpenCode(code){
        let self=this;
        self.open_code.clear();//先清空
        // 再重新赋值。
        for(let item of code.values()){
            self.open_code.add(item);
        }
        self.updateOpenCode&&self.updateOpenCode.call(self,code);
    }
//号码选中or取消
    toggleCodeActive(e){
        let self=this;
        let $cur=$(e.currentTarget);//取出当前选出的dom
        $cur.toggleClass('btn-boll-active');//toggleClass（class）如果存在（不存在）就删除（添加）一个类。
        self.getCount();
    }
    //切换玩法
    changePlayNav(e){
        let self=this;
        let $cur=$(e.currentTarget);//取出当前选出的dom
        $cur.addClass('active').siblings().removeClass('active');
        //给当前元素添加类，并找到它的所有同辈元素，将指定类移除
        self.cur_play=$cur.attr('desc').toLocaleLowerCase();
        //取得第一个匹配元素的属性值,toLocaleLowerCase() 方法用于把字符串转换为小写。
        $('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
        //设置匹配元素的html内容
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        self.getCount();
    }
    //操作区,全选0，大1，小2，奇3，偶4，清除5。
    assistHandle(e){
        e.preventDefault();//不要执行与事件关联的默认动作（如果存在这样的动作）。
        // 例如，如果 type 属性是 "submit"，在事件传播的任意阶段可以调用任意的事件句柄，
        // 通过调用该方法，可以阻止提交表单。
        let self=this;
        let $cur=$(e.currentTarget);
        let index=$cur.index();
        //搜索匹配的元素，并返回相应元素的索引值，从0开始计数。
        //如果不给 .index() 方法传递参数，那么返回值就是
        // 这个jQuery对象集合中第一个元素相对于其同辈元素的位置。
        $('.boll-list  .btn-boll').removeClass('btn-boll-active');
        if(index===0){
            $('.boll-list .btn-boll').addClass('btn-boll-active');
        }
        if(index===1){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent-5>0){//06-11
                    $(t).addClass('btn-boll-active')
                }
            })
        }
        if(index===2){//01-05
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent-6<0){
                    $(t).addClass('btn-boll-active')
                }
            })
        }
        if(index===3){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent%2==1){
                    $(t).addClass('btn-boll-active')
                }
            })
        }
        if(index===4){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent%2==0){
                    $(t).addClass('btn-boll-active')
                }
            })
        }
        self.getCount();
    }
    //getName 获取当前彩票名称
    getName(){
        return this.name
    }
    //addCode 添加号码
    addCode(){
        let self=this;
        let $active=$('.boll-list .btn-boll-active').text().match(/\d{2}/g);
        //取得所有匹配元素的内容。.match(/\d{2}/g)在全局匹配2位数字，并返回子串，是数组类型。
        let active=$active?$active.length:0;
        //如果$active存在，active=$active.length，否则为0.
        let count=self.computeCount(active,self.cur_play);//注数
        if(count){
            self.addCodeItem($active.join(' '),self.cur_play,self.play_list.get(self.cur_play).name,count);
        }
    }
//添加单次号码，code是号码，typeName是任五，count是注数
    addCodeItem(code,type,typeName,count){
        let self=this;
        const tpl=`
        <li codes="${type}|${code}" bonus="${count*2}" count="${count}">
        <div class="code">
        <b>${typeName}${count>1?'复式':'单式'}</b>
        <b class="em">${code}</b>
        [${count}注,<em class="code-list-money">${count*2}</em>元]
        </div>
        </li>
        `;
        $(self.cart_el).append(tpl);//向每个匹配的元素内部追加内容。
        self.getTotal();
    }
    getCount(){
        let self=this;
        let active=$('.boll-list .btn-boll-active').length;
        let count=self.computeCount(active,self.cur_play);//柱数
        let range=self.computeBonus(active,self.cur_play);//奖金[min,max]
        let money=count*2;
        let win1=range[0]-money;//最小盈利
        let win2=range[1]-money;//最大盈利
        let tpl;
        let c1=(win1<0&&win2<0)?Math.abs(win1):win1;//返回绝对值，盈利情况
        let c2=(win1<0&&win2<0)?Math.abs(win2):win2;
        if(count===0){
            tpl=`您选了 <b class="red">${count}</b> 注，共 <b class="red">${count*2}</b> 元`
        }else if(range[0]===range[1]){
            tpl=`您选了 <b>${count}</b> 注，共 <b>${count*2}</b> 元 <em>若中奖，奖金：
            <strong class="red">${range[0]}</strong> 元,
            您将${win1>=0?'盈利':'亏损'}
            <strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong>  元
            </em>`
        }else{
            tpl=`您选了 <b>${count}</b> 注，共 <b>${count*2}</b> 元 <em>若中奖，奖金：
            <strong class="red">${range[0]}</strong> 至 <strong class="red">${range[1]}</strong> 元,
            您将${(win1<0&&win2<0)?'亏损':'盈利'}
            <strong class="${win1>=0?'red':'green'}"> ${c1}</strong>
            至 <strong class="${win2>=0?'red':'green'}">${c2}</strong> 元
            </em>`
        }
        $('.sel_info').html(tpl);
    }
   // getTotal 计算所有金额
    getTotal(){
        let count=0;
        //购物车
        $('.codelist li').each(function(index,item){
            count+=$(item).attr('count')*1;
        });
        $('#count').text(count);
        $('#money').text(count*2);
    }
    // getRandom 随机号码生成
    getRandom(num){
        let arr=[],index;//定义数组和索引。
        let number=Array.from(this.number);
        //将类似数组的对象和可遍历的对象转为真正的数组
        while(num--){
            index=Number.parseInt(Math.random()*number.length);
            arr.push(number[index]);
            number.splice(index,1);//将数组再移除掉，使得每次随机的数不会重复
            //要删除的第一项的位置和要删除的项数
        }
        return arr.join(' ')
    }
    //机选
getRandomCode(e){
    e.preventDefault();
    let num=e.currentTarget.getAttribute('count');//当前生成的数量
    let play=this.cur_play.match(/\d+/g)[0];//当前玩法的数字。
    // cur_play全局对象，保存当前玩法，玩法变化，它也会变化。
    let self=this;
    if(num==='0'){
        $(self.cart_el).html('')
    }else{
        for(let i=0;i<num;i++){
            self.addCodeItem(self.getRandom(play),self.cur_play,self.play_list.get(self.cur_play).name,1);
            // addCodeItem(code,type,typeName,count)添加单次号码
        }
    }
}

}
export default Base








