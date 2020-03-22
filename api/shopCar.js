const express=require('express');
// const router = express.Router();
const app=express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoose=require('mongoose');

// 添加购物车
app.post('/addShopCar',bodyParser.json(),(req,res)=>{
    db.insert('design','shopCar',req.body,res)
})

// 查询购物车
app.post('/findShopCar',bodyParser.json(),(req,res)=>{
    db.find('design','shopCar',req.body,res)
})

// 修改购物车
app.post('/updateShopCar',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
    //更新条件
    var whereStr = {'_id':id};
    var updateStr = {$set: { num:req.body.num}};  
    db.update('design','shopCar',whereStr,updateStr,res,true)
})

// 删除购物车
app.post('/deleteShopCar',bodyParser.json(),(req,res)=>{
    console.log('金金金')
    var ids=req.body.ids
    console.log(ids)
    ids.forEach(item=>{
      var id=mongoose.Types.ObjectId(item)
      var whereStr = { "_id": id}; 
      db.delete('design','shopCar',whereStr,res,true)
    })
    res.send({
      msg:1
    })
})

module.exports = app;