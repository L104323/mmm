const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 添加收藏
app.post('/addCollect',bodyParser.json(),(req,res)=>{
    console.log(req.body)
    var collectInfo = req.body
    collectInfo.shopId=mongoose.Types.ObjectId(collectInfo.shopId)
    db.insert('design','collect',collectInfo,res)
})

// 查询收藏
app.post('/findCollect',bodyParser.json(),(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        // 多表查询
        dbo.collection('collect').aggregate([
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
                as: 'collectDetails'           // 新生成字段（类型array）
                }
            } 
          ]).toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
          db1.close();
        });
    });
})

// 删除收藏
app.post('/deleteCollect',bodyParser.json(),(req,res)=>{
    var ids=req.body.ids
    ids.forEach(item=>{
      var id=mongoose.Types.ObjectId(item)
      var whereStr = { "_id": id}; 
      db.delete('design','collect',whereStr,res,true)
    })
    res.send({
      msg:1
    })
})

module.exports=app;