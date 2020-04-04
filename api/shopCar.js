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
    var shopCarInfo = req.body
    shopCarInfo.shopId=mongoose.Types.ObjectId(shopCarInfo.shopId)
    db.insert('design','shopCar',shopCarInfo,res)
})

// 查询购物车
app.post('/findShopCar',bodyParser.json(),(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        // 多表查询
        dbo.collection('shopCar').aggregate([
          {
              $match://条件筛选关键词，类似mysql中的where
              {
                  userId: req.body.userId,//指定条件,在这里我指定了id,
              }
          },
          { $lookup:
             {
               from: 'shopList',            // 右集合
               localField: 'shopId',    // 左集合 join 字段
               foreignField: '_id',         // 右集合 join 字段
               as: 'shopDetails'           // 新生成字段（类型array）
             }
           }
          ]).toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
          db1.close();
        });
    });
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