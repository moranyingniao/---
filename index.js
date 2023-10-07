function pp(className){
    return document.querySelector(className);
}
 //封装插入节点功能
 function appendNode(label,content){
     let child = document.createElement(label)
    return child.append(content);
 }
 //页面隐藏与显示功能
 function toggle(currentNode,toNode){
    currentNode.style.display = 'none';
    toNode.style.display = 'block';
}


//开始游戏
function tostartGame(current,to){
    toggle(current,to)
}
//看排行榜
function toList(current,to){
    toggle(current,to)
}
//返回首页
function tohome(current,to){
    toggle(current,to)
}
// 调用控制器
//子弹速度控制
var bullettimer;//子弹速度定时器
var planetimer;//飞机生产定时器
var planeSpeedtimer;//飞机速度定时器
var bulletdelay = 100; //子弹移动速度
var planedelay = 4000; //飞机生产速度
var planespeeddelay = 100;// 飞机移动速度
var fittimer;//击中监控定时器
var fitdelay = 10;
var enemyfittimer;
var enemyfitdelay=10;

//缓存变量
//子弹速度控制

function bulletMove(){
        // 拿到节点子弹
        let arrybullet = $('.bullet');
        for(i=0;i<arrybullet.length;i++){
            //获取子弹高度position
            let bulletHeight = arrybullet[i].offsetTop;
            bulletHeight=bulletHeight-10;
            arrybullet[i].style.top = bulletHeight+'px';
            if(bulletHeight<0 && arrybullet.length !== 0){
                //到顶移除元素
                //移除元素
                $('.bullet')[i].remove();
            }
        }
}

//飞机速度控制器
function planeMove(){
    //拿到飞机节点
    let plant = $('.emergeplane');
    for(i=0;i<plant.length;i++){
        let palnetop = plant[i].offsetTop;
        palnetop = palnetop +4;
        plant[i].style.top = palnetop + 'px';
        if(palnetop >500){
            //移除元素
            $('.emergeplane')[i].remove();
        }
    }
}

   
//重新开始函数,所有重置
function restart(){
    clearInterval(bullettimer);
    clearInterval(planetimer);
    clearInterval(planeSpeedtimer);
    bullettimer =  setInterval(bulletMove,bulletdelay);
    planetimer = setInterval(enemyPlanerandom,planedelay);
    planeSpeedtimer = setInterval(planeMove,planespeeddelay);
    enemyfittimer = setInterval(enemyfit,enemyfitdelay)
    fittimer=setInterval(fit,fitdelay);
    //击中检测，每多少时间检测
    $('.bullet').remove();
    $('.emergeplane').remove();
    $('.myplane').css('left','127px');
    //清除得分
    $('.killNum').text('0');
    $('.score').text('0');
    $(".myplane").attr("src", "./images/myPlane.gif");
}

//暂停游戏
function stopgame(){
    clearInterval(bullettimer);
    //暂停飞机移动
    clearInterval(planeSpeedtimer);
    //暂停飞机生产
    clearInterval(planetimer);
    clearInterval(enemyfittimer)
}


document.addEventListener('keydown',(e)=>{
    //键盘向左
    if(e.key === 'ArrowLeft'){
        //获取相对于父元素的位置
        let oldleft = pp('.myplane').offsetLeft;
        oldleft = oldleft-3;
        // 定格左边
        if(oldleft>0){
            pp('.myplane').style.left = `${oldleft}px`
        }
    }
  
    //键盘向右
    if(e.key === 'ArrowRight'){
        let oldRight = pp('.myplane').offsetLeft;
        //定格右边总款-飞机
        oldRight = oldRight+3;
        
        if(oldRight<320 - 66){
            pp('.myplane').style.left = `${oldRight}px`
        }
    }
    //空格发送
    if(e.key === ' '){
        //飞机位置
        let planleft = pp('.myplane').offsetLeft;

        //飞机位置与发射位置同步
        $('.enterGame').append(`<img class='bullet'
        style='left:${planleft+32}px' src="./images//bullet1.png"/>`);
        
        
    }
    if(e.key === 'Enter'){
        // 暂停游戏，暂停一切动作
        const stopGame = pp('.stopGame');
        stopGame.style.display = 'block';
        stopgame();
        
    }
});
function random(max,min){
    let num =parseInt(Math.random()*(max-min+1)+min);
    return num;
}
//
//随机生成不同飞机
function enemyPlanerandom(){

    // console.log(Math.random())
    //                  0*3+0=0
    //                  0.999*3+0=2
    //mm作为图片index
    let enemyPlaneType = ['big','middle','small'];
    let enemyPlaneScore = [3,2,1];
    let index =random(2,0);
    let planWidth = [110,46,34]

    //随机宽度
    let randomWidth = random(320-planWidth[index],0);
    //随机生成不同位置
    
    $('.enterGame').append(`<img class='emergeplane'
     style='left:${randomWidth}px'
     src='./images/enemyPlane_${enemyPlaneType[index]}.png'
     data-hp ='${enemyPlaneScore[index]}'
     data-score ='${enemyPlaneScore[index]}'
     />`)
    
}
//击中功能
function fit(){
   if($('.emergeplane').length !== 0 && $('.bullet').length !== 0){
    for(let i=0;i<$('.emergeplane').length;i++){
        for(let j=0;j<$('.bullet').length;j++){
            let bulletLeft = pp('.bullet').offsetLeft;//子弹的left的值
            let planeLeft = pp('.emergeplane').offsetLeft;//敌机的left的值
            let bulletWidth = 6;//子弹的宽度
            let planeWidth =  $('.emergeplane').eq(i).width();//飞机的宽度
            let planetop = pp('.emergeplane').offsetTop;//飞机的top值
            let bullettop = pp('.bullet').offsetTop;//子弹的top值
            let planeHeight = $('.emergeplane').eq(i).height();
            //如果击中
            if(bulletLeft >= planeLeft && bulletLeft <= planeLeft + planeWidth - bulletWidth
                && bullettop <= planetop + planeHeight){

                    //如果击中目标
                    let hp =  $('.emergeplane').eq(i).attr('data-hp')*1;
                    hp--;
                
                    // 判断飞机生命值是否为0，生命值为0，删除当前飞机，击杀数以及分数增加
                    if(hp == 0){
                       
                            //击杀数增加，通过获取值加一
                            $('.killNum').text($('.killNum').text()*1+1);
                            //获取不同飞机单个得分
                            let score =  $('.emergeplane').eq(i).attr('data-score')*1;
                            //统计总分
                            $('.score').text($('.score').text()*1+score);
                             // 敌机生命值为0，图片换成爆炸图片
                            $('.emergeplane').eq(i).attr("src","./images/boom.png");
                            setTimeout(()=>{
                                 //删除当前飞机
                                $('.emergeplane').eq(i).remove();
                                i--;
                            },100)
                    }else{//hp不为0说明处于战损状态
                            //同时修改页面hp具体值
                            $('.emergeplane').eq(i).attr('data-hp',hp);
                            // 判断当前敌机的是否包含某个类名，用来切换对应的战损图片 
                            if($('.emergeplane').eq(i).hasClass('big')){
                                $('.emergeplane').eq(i).attr('src','./images/boom_big.gif')
                            }else if($('.emergeplane').eq(i).hasClass('middle')){
                                $('.emergeplane').eq(i).attr('src','./images/boom_middle.gif')
                            }
                    }

                    //删除碰撞子弹
                    $('.bullet').eq(j).remove();
                    //子弹减少
                    j--;
                    return;
                }


        }
    }
   }
}


//敌方飞机与我的飞机相撞
function enemyfit(){
    for(i=0;i<$('.emergeplane').length;i++){
        //敌方的left值
        let emergeleft = $('.emergeplane').eq(i).position().left;
        //敌方的top值
        let emergetop = $('.emergeplane').eq(i).position().top;
        //我方的left值
        let myplane = pp('.myplane').offsetLeft;
        //我方的top值
        let mttop = pp('.myplane').offsetTop;
        //我方的的飞机宽度
        let myplaneWidth = $('.myplane').width();
        //敌方的宽度
        let emergewidth = $('.emergeplane').eq(i).width();
        //敌方的高度
        let emergeheight = $('.emergeplane').eq(i).height();

        //判断
        if(emergeleft <= myplane + myplaneWidth && 
            myplane <= emergeleft + emergewidth
            && mttop <= emergetop + emergeheight){
                // 把我方飞机替换为战损图
                $(".myplane").attr("src", "./images/myPlane_boom.gif");
                // 游戏结束页面出现
                stopgame();
                pp('.overGame').style.display = 'block';


                //出现输入框
                setTimeout(()=>{
                    let playname = prompt('请输入玩家名:');
                   if(playname !== null){
                    if(playname.length>0){
                        //有名子时

                    }else{
                        //默认名字
                        playname = '游客'+Math.random()
                    }
                    let obj = {
                        name:playname,
                        score:$('.score').text()
                    }
                    //存储数据
                    localStorage.setItem(`plane-${playname}`,JSON.stringify(obj));

                   }
                },100)
            }
    }
}


//渲染排名
function renderlist(){
     // 1.在localStroage中找出所有玩家信息
    // 2.把所有玩家信息存放在数组中
    // 3.根据总分数，对数组里面的玩家进行排序（从大到小）
    // 4.渲染排序之后的数组
    let arry = [];

    //数组排序
    for(key in localStorage){
        if(key.slice(0,5) === 'plane'){
            //存储vaLue
            let value = localStorage[key];
            arry.push(JSON.parse(value));
        }
    }
    for(i=0;i<arry.length;i++){
        for(j=i+1;j<arry.length;j++){
            if(arry[i].score*1 < arry[j].score*1){
                [arry[i],arry[j]] = [arry[j],arry[i]];
            }
        }
    }
    //渲染列表
    let newdata = arry.map((item,index)=>{
        return `<tr>
        <th>${index+1}</th>
        <th>${item.name}</th>
        <th>${item.score}</th>
        </tr>
        `
    })

    //再插入
    $('.renderlist').append(newdata.join(' '))
    console.log(arry)
}
renderlist()
 
