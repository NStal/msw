(function(exports){
    var Class = require("./util").Class;
    var EventEmitter = require("./util").EventEmitter;
    var Point = require("./util").Point;
    var Util = require("./util").Util;
    var Ship = EventEmitter.sub();
    var AI = require("./ai").AI;
    var Static = require("./static").Static;
    Ship.prototype._init = function(info){
	if(!info){
	    return;
	}
	this.proto = Static.gameResourceManager.get(info.itemId);
	var proto = this.proto;
	this.type = "ship";
	this.coolDownIndex = 0;
	if(info.id)
	    this.id = info.id.toString();
	if(!this.id){
	    console.warn("!!!!","no id!!!!");
	    console.trace();
	    return;
	} 
	this.cordinates = info.cordinates?Point.Point(info.cordinates):Point.Point(0,0); 
	this.team = info.team; 
	Util.update(this,proto);
	if(info.action){
	    this.action = info.action;
	}else{
	    this.action = {};
	}
	this.AI = new AI(this);
	if(info.AI){
	    Util.update(this.AI,info.AI);
	}
	if(typeof info.toward == "number"){
	    this.toward = info.toward;
	}else{
	    this.toward = 0;
	}
	this.itemId = info.itemId;
	if(info.life)this.life = info.life;
	if(!this.upgradeRate){
	    this.upgradeRate = 1.25;
	}
	var level = Static.battleField.teamInfo[this.team].tech[this.itemId];
	for(var i=0;i<level;i++){
	    this.upgrade();
	}
    }
    Ship.prototype.upgrade = function(){
	if(this.itemId!=0){
	    this.maxLife *= this.upgradeRate;
	    this.life *= this.upgradeRate;
	}else{
	    this.maxLife*=3;
	    this.life*=3;
	}
	this.attack = Math.floor(this.attack*this.upgradeRate);
	this.maxSpeed *= Math.floor(Math.sqrt(this.upgradeRate)*100)/100;
	this.maxRotateSpeed *= Math.floor(Math.sqrt(Math.sqrt(this.upgradeRate))*100)/100;;
	if(typeof this.minSpeed == "number"){
	    this.minSpeed *= Math.floor(Math.sqrt(Math.sqrt(this.upgradeRate))*100)/100;
	}
	this.level++;
    }
    Ship.prototype.onDraw = function(context){
	if(!Static.battleFieldDisplayer.pointInScreen(this.position,this.size))return;
	context.beginPath();
	var size = this.size;
	if(!this.shake){
	    this.shake = new Shake({
		time:120+10*Math.random()
		,range:5
		,angle:90
	    });
	    this.shake.index+=Math.random()*100;
	    this.effects = [this.shake];
	}
	if(this.img){
	    context.save();
	    context.rotate(Math.PI/2); 
	    context.drawImage(this.img,-this.img.width/2,-this.img.height/2,this.img.width,this.img.height);
	    context.restore();
	}else{
	    this.img = Static.resourceLoader.get(this.src);
	    context.moveTo(-size/2,-size/3);
	    context.lineTo(size/2,0);
	    context.lineTo(-size/2,size/3);
	    context.closePath();
	    context.fillStyle = "black";
	    context.fill();
	}
	if(this.index){
	    this.index++;
	}
	else{
	    this.index=1;
	}
	//draw life
	context.save();
	context.rotate(-this.rotation); 
	context.beginPath();
	context.arc(0,0,this.size,0,Math.PI*2*this.life/this.maxLife);
	if(this.team == Static.userteam)
	    context.strokeStyle = "green";
	else
	    context.strokeStyle = "red";
	context.stroke();
	if(this.isSelected){
	    //context.beginPath();
	    //context.arc(0,0,this.size+8,this.index/3,Math.PI*2-1+this.index/3);
	    //
	    //context.stroke();
	    context.beginPath();
	    context.strokeStyle = "#0bf";
	    context.arc(0,0,this.size+4,-this.index/2,Math.PI*2-1-this.index/2);
	    context.stroke();
	}
	context.restore(); 
    }
    Ship.prototype.toData = function(){
	var data ={
	    id:this.id
	    ,team:this.team
	    ,cordinates:{
		x:this.cordinates.x
		,y:this.cordinates.y
	    }
	    ,toward:this.toward
	    ,action:this.action
	    ,AI:this.AI.toData()
	    ,itemId:this.itemId
	    ,life:this.life
	}
	return data;
    }
    Ship.prototype.onDead = function(byWho){
	this.emit("dead",this,byWho);
    }
    Ship.prototype.onDamage = function(damage){
	this.life -=damage;
	if(this.life<=0){
	    this.life = 0;
	    this.onDead();
	}
	if(this.life>this.maxLife){
	    this.life = this.maxLife;
	}
    }
    Ship.prototype.next = function(){
	this.AI.calculate();
	this.emit("next");
	if(this.coolDownIndex<this.coolDown){
	    this.coolDownIndex++;
	}else{
	    this.fireReady = true;
	}
	var fix = this.action.rotateFix;
	
	if(fix>1 || fix < -1){
	    console.trace();
	    return;
	}
	rotateSpeed = this.maxRotateSpeed;
	this.toward += fix*rotateSpeed;
	
	this.toward = Math.mod(this.toward,Math.PI*2);
	
	var fix = this.action.speedFix;
	var speed = this.maxSpeed;
	//move
	var realSpeed = speed*fix;
	if(typeof this.minSpeed == "number" && realSpeed<this.minSpeed)
	    realSpeed = this.minSpeed;
	this.cordinates.x+=Math.cos(this.toward) *realSpeed;
	this.cordinates.y+=Math.sin(this.toward) *realSpeed;
	this.action.speedFix = 0;
	this.action.rotateFix = 0;
    } 
    exports.Ship = Ship;
})(exports)
