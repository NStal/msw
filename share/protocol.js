//通信协议
/**
*服务端发送请求的协议
*数据json传输格式
{
    "cmd":Operater,
    "id":[id1,id2,],//选择ID
    "Postion":{
        "x":[position-x],
        "y":[position-y]
    }//targetPosition目标地点
    "targetId":id//目标ID
}
*/

//操作枚举
var operateEnum = {
    SINGLE_SELECT:0,//单选
    MULTI_SELECT:1,//多选
    MOVE:2,//移动
    ATTACK:3,//攻击
    MINING:4,//采矿
    MINING_BACK:5,//加矿
    MAKE_SHIP:6,//造船
    UPGRADE:7//升级
}

//协议转换
var ProtocalGenerater = {};

//生成单选json
ProtocalGenerater.singleSelect = function(shipId){
    var jsonData = {};
    jsonData.cmd = 0;
    jsonData.id = shipId;
    return jsonData;
}
//生成多选json
ProtocalGenerater.multiSelect = function(shipIds){
    var jsonData = {};
    jsonData.cmd = 1;
    jsonData.id = shipIds;
    return jsonData;
}
//生成移动json
ProtocalGenerater.moveTo = function(ids,x,y){
    var jsonData = {};
    jsonData.cmd = 2;
    jsonData.id = ids;
    jsonData.Position.x = x;
    jsonData.Position.y = y;
    return jsonData；
}
//生成攻击json
ProtocalGenerater.attackTo = function(ids,targetId){
    var jsonData = {};
    jsonData.cmd = 3;
    jsonData.id = ids;
    jsonData.targetId = targetId;
    return jsonData;
}
//生成采矿json
ProtocalGenerater.mining = function(id,targetId){
    var jsonData = {};
    jsonData.cmd = 4;
    jsonData.id = id;
    jsonData.targetId = targetId;
    return jsonData;
}
//生成加矿json
ProtocalGenerater.mingningBack = function(id){
    var jsonData = {};
    jsonData.cmd = 5;
    jsonData.id = id;
    return jsonData;
}
//生成造船json
ProtocalGenerater.makeShip = function(targetId){
    var jsonData = {};
    jsonData.cmd = 6;
    jsonData.targetId = targetId;
    return jsonData;
}
//生成升级json
ProtocalGenerater.upgradeShip = function(shipId){
    var jsonData = {};
    jsonData.cmd = 7;
    jsonData.id = shipId;
    return jsonData;
}