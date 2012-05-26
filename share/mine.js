(function(exports){
    var EventEmitter = require("./util").EventEmitter; 
    var Point = require("./util").Point;
    var Mine = EventEmitter.sub();
    Mine.prototype._init = function(info){
	this.position = Point.Point(info);
	this.size = 50;
	this.type = "mine";
	this.id = info.id;
	console.log(this.position.toString());
    } 
    exports.Mine =Mine;
})(exports)