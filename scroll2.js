/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-01-31 21:25:25
 * @version $Id$
 */
	var get={
		byClass:function(tagname,classname,obj) {
			var col=(obj||document).getElementsByTagName(tagname);
			for(var i=0;i<col.length;i++){
				if(col[i].className==classname){
					return col[i]
				}
			}
		},
		oleft:function(ele){
			return ele.offsetParent? (ele.offsetLeft+arguments.callee(ele.offsetParent)):ele.offsetLeft;
		},
		Style:function(obj,attr){
			return parseFloat(obj.currentStyle? obj.currentStyle[attr]:getComputedStyle(obj,null)[attr]);
		}
	};
	window.onload=function(){
		var box=document.getElementById("box");
		var list=get.byClass("div","list",box);
		var ul=list.getElementsByTagName('ul')[0];
		var scrollbar=get.byClass("div","scrollBar",box);
		var bar=get.byClass("div","bar",scrollbar);
		var barm=get.byClass("div","barM",scrollbar);
		var barleft=get.oleft(bar);
		var barwidth=bar.offsetWidth;
		var barmwidth=barm.offsetWidth;
		var li=ul.getElementsByTagName('li');
		var barl=get.byClass("div","barL",scrollbar);
		var barr=get.byClass("div","barR",scrollbar);
		var imarginright=get.Style(li[li.length-1],"marginRight");
		var maxl=barmwidth-barwidth;
		var disX,iscale,timer;

		//动态设置列表容器宽度
		ul.style.left=(li.offsetWidth+imarginright)*(li.length-1)+"px";

		//拖动滚动条
		bar.onmousedown=function(e){
			disX=(e||window.event).clientX-bar.offsetLeft;
			document.onmousemove=function(){
				var il=(e||window.event).clientX-disX;
				il<=0&&(il=0);
				il>=maxl&&(il=maxl);
				bar.style.left=il+"px"//值得研究的地方
				iscale=il/maxl;
				return false;
			};
			document.onmouseup=function(){
				startMove(ul,parseInt((list.offsetWidth+imarginright)-ul.offsetWidth)*iscale);
				isStop();
				document.onmousemove=null;
				document.onmouseup=null;//取消已经绑定的监听
			};
			return false
		};
		//取消滚动条单击事件的冒泡机制
		bar.onclick=function(e){
			(e||window.event).cancelBubble=true;
		};
		//滚动条左右按钮鼠标移入和键盘事件
		barl.onmouseover=barr.onmouseover=document.onkeydown=function(e){
			e=e||window.event;
			alert(e.keyCode);
			var ispeed=0;
			if(e.target==barl||e.keyCode==37){
				ispeed=-5;
			}
			if(e.target==barr||e.keyCode==39){
				ispeed=5;
			}
			timer=setInterval(function(){
				togetherMove(getStyle(oBar,"left")+ispeed,1)
			},30)
		};
		barl.onmouseout=barr.onmouseout=document.onkeyup=function(){
			clearInterval(timer);
		};

		//点击滚动
		barm.onclick=function(e){
			var itarget=(e||window.event).clientX-box.offsetLeft-this.offsetLeft-(barwidth/2);
			togetherMove(itarget)
		};

		//滚轮事件
		box.onmouseover=function(e){
			e=e||window.event;
			function mouseWheel(event){
				var delta=event.wheelDelta ? event.wheelDelta : -event.detail * 40;//值得研究
				var itarget=delta>0? -50:50;
				togetherMove(bar.offserLeft+itarget);
			}
			addHandler(this,"mousewheel",mouseWheel);
			addHandler(this,"DOMMouseScroll",mouseWheel);
		};

		//定义图片区和滚动条同时滚动togetherMove
		function togetherMove(itarget,buffer){
			if(itarget<=0){
				timer&&clearInterval(timer);
				itarget=0;
			}
			if(itarget>=maxl){
				timer&&clearInterval(timer);
				itarget=maxl;
			}
			iscale=itarget/maxl;
			startMove(ul,parseInt((list.offsetWidth + imarginright - ul.offsetWidth) * iscale), function () {isStop()}, buffer);
			startMove(bar, itarget, function () {isStop()}, buffer);
		};

		//判断滚动条是否到达边界
		function isStop(){
			barl.className="barL";
			barr.className="barR";
			switch(bar.offsetLeft){
				case 0:
					barl.className += " barLStop";
					break;
				case 1:
					barr.className += " barLStop";
					break;
			}
		}
		isStop();
	};
	function addHandler(ele,event,fn){
		return ele.addEventListener?ele.addEventListener(event,fn,false):ele.attach("on"+event,fn);
	};
	function startMove(obj,itarget,fn,buffer){
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			doMove(obj,itarget,fn,buffer);
		},30)
	};
	function doMove(obj,itarget,fn,buffer){
		var objleft=get.Style(obj,"left");
		var speed=(itarget-objleft)/(buffer||5);
		speed=speed>0?Math.ceil(speed):Math.floor(speed);
		objleft==itarget?(clearInterval(obj.timer),fn&&fn()):obj.style.left=objleft+speed+"px";
	}
