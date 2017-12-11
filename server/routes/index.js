//@@@@@@@@服务端接口，布置接口的文件，辅助实战功能完善@@@@@@@@@@

var express = require('express');
var mockjs=require('mockjs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

//用来输出当前的状态，期号，截止时间。
var makeIssue=function(){
  var date=new Date();
  //获取服务端当前的时间。
  var first_issue_date=new Date();//存储：记录当天的第一期的时间
  //期号生成的规则，2017041801期，年月日01期，每天有78期，晚上10点之后显示第二天的第一期，第一期是第二天的9点销售，9：:10分截止

  //第一期的截止时间9:10
  first_issue_date.setHours(9);
  first_issue_date.setMinutes(10);
  first_issue_date.setSeconds(0);
  //console.log(first_issue_date);Tue Dec 05 2017 09:10:00 GMT+0800
  //截止时间：用第一期的时间加上77期的时间
  var end_issue_date=new Date(first_issue_date.getTime()+77*10*60*1000);
  //console.log(end_issue_date);Tue Dec 05 2017 22:00:00 GMT+0800
  var cur_issue,end_time,state;//申明临时存储的变量当前期，截止时间，状态
  if(date.getTime()-first_issue_date.getTime()>0&&date.getTime()-end_issue_date.getTime()<0){
    //当前的时间如果大于第一期的时间，且小于截止时间。
//正常销售
    var cur_issue_date=new Date();
    //9点开始
    cur_issue_date.setHours(9);
    cur_issue_date.setMinutes(0);
    cur_issue_date.setSeconds(0);

    //当期的销售剩余时间
    var minus_time=date.getTime()-cur_issue_date.getTime();
    var h=Math.ceil(minus_time/1000/60/10);
    //当期的销售剩余时间，有多少个10分钟。Math.ceil向上舍入25.1约等于26

    //算截止的时间
    var end_date=new Date(cur_issue_date.getTime()+1000*60*10*h);
    //假设现在是9:28，minus_time=28分钟，h是3，end_date=9:30
    end_time=end_date.getTime();
    //当前期号
    cur_issue=[end_date.getFullYear(),('0'+(end_date.getMonth()+1)).slice(-2),('0'+end_date.getDate()).slice(-2),('0'+h).slice(-2)].join('')
  }else{
    //今天销售已停止
      first_issue_date.setDate(first_issue_date.getDate()+1);
    //第一期时间加一天，显示第二天的第一期
    end_time=first_issue_date.getTime();
    cur_issue=[first_issue_date.getFullYear(),('0'+(first_issue_date.getMonth()+1)).slice(-2),('0'+first_issue_date.getDate()).slice(-2),'01'].join('')
  }
  var cur_date=new Date();
  //前八分钟是销售，后两分钟是开奖
  if(end_time-cur_date.getTime()>1000*60*2){
    state='正在销售'
  }else {
    state='开奖中'
  }
  return {
    issue:cur_issue,
    state:state,
    end_time:end_time
  }
};

//接下来是三个接口，
//接口定义的是get，所以这里就是router.get(),
router.get('/get/omit',function(req,res,next){
  //res.json()	返回一个 JSON 格式的响应。里面用的是mockjs，mock功能
  res.json(mockjs.mock({
    'data|11':[/[1-9]{1,3}|0/],//返回长度为11的数据，[/[1-9]{1,3}|0/]这是mockjs提供的格式
    'issue':/[1-9]{8}/
    //这里按理说应该是上面计算出来的，这里用的是假的
  }))
});

router.get('/get/opencode',function(req,res,next){
  //这里的期号是真实的，不用mock
  var issue=mackIssue().issue;
  //开奖号还是用mockjs模拟，
  var data=mockjs.mock({
    'data':[/[1-3]/,/[4-5]/,/[6-7]/,/[8-9]/,/1[0-1]/]
    ///[1-3]/在1-3中随机生成1个数，为了使开奖号不同，分成了五位
  }).data;
  res.json({
    issue:issue,
    data:data
  })
});

router.get('/get/state/',function(req,res,next){
  var state=makeIssue();
  //var state=makeIssue().state;这里加上state，反倒出现问题
  res.json(state);
})
module.exports = router;
