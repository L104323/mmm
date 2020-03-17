const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 垃圾分类分页查询
app.post('/findGarbage',bodyParser.json(),(req,res)=>{
    const reg=new RegExp(req.body.garbageName,'i'); //不区分大小写，实现模糊查询
    var skipCount=req.body.pageSize*(req.body.pageIndex-1);
    var whereStr = {"garbageName":{$regex:reg},"garbageType":req.body.garbageType};
    
    if(req.body.garbageName=='' && req.body.garbageType==''){
      whereStr={}
    }
    if(req.body.garbageType=='' && req.body.garbageName!=''){
      var whereStr = {"garbageName":{$regex:reg}}
    }
    if(req.body.garbageName=='' && req.body.garbageType!=''){
      var whereStr = {"garbageType":req.body.garbageType}
    }
    db.find('design','categoryGarbage',whereStr,res,{},skipCount,req.body.pageSize);
})

app.post('/searchGarbage',bodyParser.json(),(req,res)=>{
  const reg=new RegExp(req.body.garbageName,'i'); //不区分大小写，实现模糊查询
  var whereStr = {"garbageName":{$regex:reg}};
  db.find('design','categoryGarbage',whereStr,res,{},0,0);
})

// 垃圾分类修改
app.post('/updateGarbage',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id);
    //更新条件
    var whereStr = {'_id':id};  
    //更新内容
    var updateStr = {$set: { garbageName:req.body.garbageName,
                             garbageType:req.body.garbageType,
                             typeImg:req.body.typeImg}
                    };
    db.update('design','categoryGarbage',whereStr,updateStr,res,true)
})

// 垃圾分类单行删除
app.post('/deleteOneGarbage',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
    var whereStr = { "_id": id}; 
    db.delete('design','categoryGarbage',whereStr,res,true)
    res.send({
      msg:1
    })
})

// 垃圾分类批量删除
app.post('/deleteManyGarbage',bodyParser.json(),(req,res)=>{
    var ids=req.body.ids
    ids.forEach(item=>{
      var id=mongoose.Types.ObjectId(item)
      var whereStr = { "_id": id}; 
      db.delete('design','categoryGarbage',whereStr,res,true)
    })
    res.send({
      msg:1
    })
  })

// 垃圾分类添加
app.post('/addGarbage',bodyParser.json(),(req,res)=>{
    db.insert('design','categoryGarbage',req.body,res)
  })

module.exports=app;