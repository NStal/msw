var InteractionManager = Drawable.sub();
InteractionManager.prototype._init = function(){
    var self = this;
    Static.battleField.on("shipFire",function(ship,target){
	var Ammor = Ammunition[ship.subType];
	var ammor = new Ammor(ship,target);
	self.add(ammor);
	console.error("~~~~");
    })
    Static.battleField.on("gained",function(ship,mine,ammount){
	self.add(new EarnAnimation(ship,mine,ammount));
    });
}

var EarnAnimation = Drawable.sub()
EarnAnimation.prototype._init = function(ship,mine,ammount){
    this.mine = mine;
    this.position = ship.cordinates;
    this.index=0;
    this.length = 30;
    this.ammount = ammount
}
EarnAnimation.prototype.onDraw = function(context){
    if(this.index==this.length){
	this.parentContainer.remove(this);
    }
    context.translate(0,-this.index/3);
    context.globalAlpha = 1-this.index/this.length;
    this.index++;
    context.fillStyle = "white";
    context.fillText(this.ammount.toString(),0,0);
    context.fillText()
}
var NormalAmmunition = Drawable.sub();
NormalAmmunition.prototype._init = function(ship,target){
    this.position=ship.cordinates;
    this.targetPosition = target.cordinates;
    if(ship.team == Static.userteam)
	this.color = "orange";
    else
	this.color = "red";
    this.index = 0;
    this.length = 5;
}
NormalAmmunition.prototype.onDraw = function(context){
    if(this.index==this.length){
	this.parentContainer.remove(this);
    }
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(this.targetPosition.x-this.position.x
		   ,this.targetPosition.y-this.position.y);
    context.strokeStyle = this.color;
    context.lineWidth = (Math.sin(this.index)+2);
    context.stroke();
    
    this.index++;
}
var Ammunition = {
    "motherShip":NormalAmmunition
    ,"attackShip":NormalAmmunition
    ,"defenceTower":NormalAmmunition
}