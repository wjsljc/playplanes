//封装获取id函数
function $(id) {return document.getElementById(id);}
var
	startDiv 	= $("startDiv"),			//获得开始界面
	mainDiv 	= $("mainDiv"),				//获得主界面
	scoreDiv 	= $("scoreDiv"),			//获得得分版
	num 		= $("num"),					//获得得分版中的分数
	suspendDiv  = $("suspendDiv"),			//获得暂停版
	endDiv 		= $("endDiv"),				//获得结束版
	endScore	= $("endScore"),			//获得结束版分数
	scores 		= 0,						//初始化分数
	backgroundPositionY = 0,				//初始化背景图片位置
	name		= $("name").value,
	set 		= null;						//初始化事件函数
var 
	containerLeft = $("contentDiv").offsetLeft,	//获取容积距离左边和上边距的距离
	containerTop = $("contentDiv").offsetTop;

if(localStorage.length !== 0){
console.log(localStorage);
	
	//用来存放排序过后的得分情况
	var pm = [];
	for(var sAttr in localStorage){
		var person = {};
		var info = JSON.parse(localStorage[sAttr]);
		person = {
			name : info.name,
			score : info.score
		}
		pm.push(person);
	}
	var temp = {};
	for(var i = 0;i < pm.length;i++){
		for(var j = 0;j < pm.length - i - 1;j++){
			if(pm[j].score < pm[j + 1].score){
				temp = pm[j+1];
				pm[j+1] = pm[j];
				pm[j] = temp;
			}
		}
	}
	for(var i = 0,len = pm.length;i < len;i++){
		var li = document.createElement("li");
		li.innerHTML = "姓名：" + pm[i].name + "&nbsp;&nbsp;&nbsp;&nbsp;" + "分数：" + pm[i].score;
		startDiv.appendChild(li);
	}
}else{
	console.log("没有本地存储");
}

	
//开始游戏
function begin(){
	//首页面隐藏
	startDiv.style.display = "none";
	//主页面、得分版页面显示
	mainDiv.style.display = "block";
	scoreDiv.style.display = "block";
	set = setInterval(function(){
		//开始游戏
		start();
	},20);
	
}

//创建飞机的类
function Plan(hp,x,y,sizeX,sizeY,score,dieTime,sudu,boomImage,imgSrc){
	this.hp 	    = hp;
	this.x 		    = x;
	this.y  	    = y;
	this.sizeX      = sizeX;
	this.sizeY      = sizeY;
	this.score      = score;
	this.dieTime    = dieTime;
	this.dieTimes   = 0;
	this.sudu 	    = sudu;
	this.boomImage  = boomImage;
	this.imgSrc     = imgSrc;
	this.planisdie  = false;
	this.planmove	= function(){
		if(scores <= 50000){
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu  + "px";
		}else if(scores > 50000 && scores <= 100000){
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu + 1 +  "px";
		}else if(scores > 100000 && scores <= 150000){
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu + 2 + "px";
		}else if(scores > 150000 && scores <= 200000){
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu + 3 + "px";
		}else if(scores > 200000 && scores <= 300000){
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu + 4 + "px";
		}else{
			this.imagenode.style.top = this.imagenode.offsetTop + this.sudu + 5 + "px";
		}
	}
	//画一个飞机
	this.imagenode  = null;
	//定义一个初始化的方法
	this.init = function(){
		this.imagenode = document.createElement("img");
		this.imagenode.style.left = this.x + "px";
		this.imagenode.style.top  = this.y + "px"; 
		this.imagenode.src = this.imgSrc;
		//填充到页面
		mainDiv.appendChild(this.imagenode);
	};
	//调用初始化飞机
	this.init();
}

//创建子弹类
function Bullet(x,y,sizeX,sizeY,sudu,imgSrc){
	this.x 		    = x;
	this.y 		    = y;
	this.sizeX      = sizeX;
	this.sizeY      = sizeY;
	this.sudu       = sudu;
	this.imgSrc     = imgSrc;
	this.imagenode  = null;
	this.bulletattach = 1;//代表子弹减的血值
	this.bulletmove = function(){
		this.imagenode.style.top = this.imagenode.offsetTop - 10 - this.sudu + "px";
		this.imagenode.style.left = this.imagenode.offsetLeft - random(-15,15) + "px";
	}
	//定义子弹生成的初始化方法
	this.init = function(){
		this.imagenode = document.createElement("img");
		this.imagenode.style.top = this.y + "px";
		this.imagenode.style.left = this.x + "px";
		this.imagenode.src = this.imgSrc;
		mainDiv.appendChild(this.imagenode);
	}
	//初始化子弹
	this.init();
}

//创建一个类型的子弹
function Oddbullet(x,y){
	Bullet.call(this,x,y,6,14,1,"img/bullet1.png");
}


//创建我的飞机的函数
function OurPlan(x,y){
	Plan.call(this,1,x,y,66,80,0,600,0,"img/本方飞机爆炸.gif","img/我的飞机.gif");
	//给我方飞机加id
	this.imagenode.setAttribute("id","ourplan");
}
//初始化我方飞机
var selfplan = new OurPlan(130,460);
//拖拽飞机
var ourplan  = document.getElementById("ourplan");


//初始化一个子弹
//var abullet = new Oddbullet(parseInt(selfplan.imagenode.style.left)+31,parseInt(selfplan.imagenode.style.top)-14);


//移动的匿名方法
this.yidong = function(){
	var 
		e = window.event || arguments[0],
		chufa = e.srcElement || e.target,//触发事件
		selfplanX = e.clientX,	//鼠标x
		selfplanY = e.clientY;	//鼠标Y
	//移动到的位置	
	ourplan.style.top = selfplanY  - containerTop - 44 + "px";
	ourplan.style.left = selfplanX - containerLeft - 33 + "px";
	
};
//边界判断
this.bianjie = function(){
	var e = window.event || arguments[0];
	var bodyObjX = e.clientX;
	var bodyObjY = e.clientY;
	console.log(bodyObjX);
	//超出边界让它取消移动(其实这里还应该减去飞机的宽高)
	if(bodyObjX < 0 || bodyObjX > 320 || bodyObjY < 0 || bodyObjY > 568){
		//取消监听事件
		if(document.removeEventListener){
			mainDiv.removeEventListener("mousemove",yidong,true);
		}else if(document.detachEvent){
			mainDiv.detachEvent("onmousemove",yidong,true);
		}
	}else{//边界内部增加移动事件
		if(document.addEventListener){
			mainDiv.addEventListener("mousemove",yidong,true);
		}else if(document.attachEvent){
			mainDiv.attachEvent("onmousemove",yidong,true);
		}
	}
}
//暂停
var stop = 0;
var bodyObj = document.getElementsByTagName("body")[0];
this.zanting = function(){
	//使其暂停
	if(stop == 0){
		//暂停面板显示
		suspendDiv.style.display = "block";
		//兼容性监听事件写法
		if(document.removeEventListener){
			mainDiv.removeEventListener("mousemove",yidong,true);
			bodyObj.removeEventListener("mousemove",bianjie,true);
			
		}else if(document.detachEvent){
			mainDiv.detachEvent("onmousemove",yidong,true);
			bodyObj.detachEvent("onmousemove",bianjie,true);
		}
		//让屏幕静止
		clearInterval(set);
		stop = 1;
	}else{
		//暂停面板消失
		suspendDiv.style.display = "none";
		//继续游戏
		if(document.addEventListener){
			mainDiv.addEventListener("mousemove",yidong,true);
//			bodyObj.addEventListener("mousemove",bianjie,true);
		}else if(document.attachEvent){
			mainDiv.addEventListener("mousemove",yidong,true);
//			bodyObj.addEventListener("mousemove",bianjie,true);
		}
		set = setInterval(function(){
			start();
		},20);
		stop = 0;
	}
}

//初始化添加监听事件
if(document.addEventListener){
	mainDiv.addEventListener("mousemove",yidong,true);
//	bodyObj.addEventListener("mousemove",bianjie,true);
	selfplan.imagenode.addEventListener("click",zanting,true);
	suspendDiv.getElementsByTagName("button")[0].addEventListener("click",zanting,true);
	suspendDiv.getElementsByTagName("button")[2].addEventListener("click",jixu,true);
}else if(document.attachEvent){
	mainDiv.addEventListener("mousemove",yidong,true);
//	bodyObj.addEventListener("mousemove",bianjie,true);
}
	
	
//想要监听的事件，监听到事件要触发的方法，触发的时间(true为立即触发)
//监听事件
mainDiv.addEventListener("mousemove",yidong,true);	//这里携程true才能取消监听事件

//创建敌军飞机
function Enemy(hp,x,y,sizeX,sizeY,score,dieTime,sudu,boomImage,imgSrc){
	Plan.call(this,hp,random(x,y),-100,sizeX,sizeY,score,dieTime,sudu,boomImage,imgSrc);
}
//初始化敌军飞机对象
//var enemyPlan = new Enemy(12,100,100,110,164,5000,300,1,"img/大飞机爆炸.gif","img/enemy2_fly_1.png");

//创建敌军飞机数组
var enemys = [];
//定义子弹数组
var bullets = [];
//定义飞机类型计数器
var mark = 0,marks = 0;

var backgroundPositionY = 0;
function start(){
	//背景图片位移
	mainDiv.style.backgroundPositionY = backgroundPositionY + "px";
	backgroundPositionY += 0.5;
	if(backgroundPositionY > 568){
		backgroundPositionY = 0;
	}
	mark++;
	if(mark === 20){
		marks++;
		if(marks === 20){
			//添加一个大飞机
			enemys.push(new Enemy(100,50,250,110,164,5000,600,1,"img/大飞机爆炸.gif","img/enemy2_fly_1.png"));
			//j = 0
			marks = 0;
		}else{
			//添加小飞机
			enemys.push(new Enemy(20,20,280,34,24,500,300,random(1,4),"img/小飞机爆炸.gif","img/enemy1_fly_1.png"));
		}
		if(marks % 5 === 0){
			//添加中飞机
			enemys.push(new Enemy(60,25,270,46,60,1000,400,random(1,3),"img/中飞机爆炸.gif","img/enemy3_fly_1.png"));
		}
		mark = 0;
	}
	//遍历敌机的数组
	var enemyslen = enemys.length;
	for(var i = 0;i <enemyslen;i++){
		if(enemys[i].planisdie != true){
			enemys[i].planmove();
		}
		//超过边界 删除飞机
		if(enemys[i].imagenode.offsetTop > 568){
			//
			mainDiv.removeChild(enemys[i].imagenode);
			//删除数组相对应的值
			enemys.splice(i,1);
			enemyslen--;
		}
		//如果敌机死亡，让它爆炸以后再删除
		if(enemys[i].planisdie === true){
			enemys[i].dieTimes += 20;
			//这么做有一点需要注意，dieTime 必须是20的倍数
			if(enemys[i].dieTimes === enemys[i].dieTime){
				mainDiv.removeChild(enemys[i].imagenode);
				//删除数组相对应的值
				enemys.splice(i,1);
				enemyslen--;
			}
		}
	}
	//每5次发射一次子弹
	if(mark % 5 === 0){
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+ random(0,10),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(10,20),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
		bullets.push(new Oddbullet(parseInt(selfplan.imagenode.style.left)+random(20,30),parseInt(selfplan.imagenode.style.top)-14));
	}
	//子弹的移动(遍历子弹数组)
	var bulletslen = bullets.length;
	for(var i = 0;i < bulletslen;i++){
		bullets[i].bulletmove();
		//让过多的子弹删除(否则会卡)
		if(bullets[i].imagenode.offsetTop < 0){
			mainDiv.removeChild(bullets[i].imagenode);
			//删除数组相对应的值
			bullets.splice(i,1);
			bulletslen--;
		}
	}
	
	//碰撞事件
	//遍历子弹
	for(var k = 0;k < bulletslen;k++){
		//敌机的遍历
		for(var j = 0;j < enemyslen;j++){
			if(enemys[j].planisdie === false){
				//如果没有死,判断敌机呢我方飞机的碰撞
					//水平碰撞(敌军的宽度加上左距离大于我军的左距离并且敌军的左距离小于)
				if(enemys[j].imagenode.offsetLeft + enemys[j].sizeX > selfplan.imagenode.offsetLeft + 10 && enemys[j].imagenode.offsetLeft < selfplan.imagenode.offsetLeft + selfplan.sizeX -10){
					//垂直碰撞
					if(enemys[j].imagenode.offsetTop + enemys[j].sizeY  > selfplan.imagenode.offsetTop + 10  && enemys[j].imagenode.offsetTop < selfplan.imagenode.offsetTop + selfplan.sizeY){
						//发生碰撞
						selfplan.imagenode.src = "img/本方飞机爆炸.gif";
						//显示得分版
						endDiv.style.display = "block";
						//计算分数
						num.innerHTML = scores;
						//静止屏幕滚动
							//取消监听事件的兼容性写法
						if(document.removeEventListener){	//其他浏览器
							mainDiv.removeEventListener("mousemove",yidong,true);
//							bodyObj.removeEventListener("mousemove",bianjie,true);
						}else if(document.detachEvent){	//IE8及其以下
							mainDiv.detachEvent("onmousemove",yidong,true);
//							bodyObj.detachEvent("onmousemove",bianjie,true);

						}
						//清除定时器
						clearInterval(set);
					}
				}
				//子弹和敌军碰撞
					//水平碰撞
				if(bullets[k].imagenode.offsetLeft + bullets[k].sizeX > enemys[j].imagenode.offsetLeft && bullets[k].imagenode.offsetLeft < enemys[j].imagenode.offsetLeft + enemys[j].sizeX){
					//垂直碰撞
					if(bullets[k].imagenode.offsetTop + bullets[k].sizeY > enemys[j].imagenode.offsetTop && bullets[k].imagenode.offsetTop < enemys[j].imagenode.offsetTop + enemys[j].sizeY){
						//打中敌军
						enemys[j].hp = enemys[j].hp - bullets[k].bulletattach;
						//敌军死了
						if(enemys[j].hp === 0){
							//改变分数
							scores += enemys[j].score;
							endScore.innerHTML = scores;
							num.innerHTML = scores;
							//飞机爆炸
							enemys[j].imagenode.src = enemys[j].boomImage;
							//改变飞机生存状态
							enemys[j].planisdie = true;
						}
						//子弹删除
						mainDiv.removeChild(bullets[k].imagenode);
						//删除数组
						bullets.splice(k,1);
						bulletslen--;
						break;
					}
				}
			}
		}
	}
	
}
//点击继续
function jixu(){
	console.log($("name").value);
	//存储分数和姓名
	var info = {
		name : $("name").value,
		score : scores
	};
	var str = JSON.stringify(info);
	localStorage.setItem($("name").value,str);
	location.reload(true);
}

//定义随机函数	
function random(min,max){
	return Math.floor(min+Math.random()*(max-min));
}





