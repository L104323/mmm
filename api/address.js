const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');

var mongoose=require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// 添加地址
app.post('/addAddress',bodyParser.json(),(req,res)=>{
    // 如果传入为默认地址，则要修改其他地址为不是默认
    if(req.body.isDefault == true){
        // 修改isDefault
        MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("design");
            var whereStr = {"isDefault" : true};  // 查询条件
            var updateStr = {$set: { "isDefault" : false }};
            dbo.collection("address").updateMany(whereStr, updateStr, function(err, res1) {
                if (err) throw err;
                db1.close();
                // 添加
                db.insert('design','address',req.body,res)
            });
        });
    } else {
        // 添加
        db.insert('design','address',req.body,res)
    }
    
})

// 查询地址
app.post('/findAddress',bodyParser.json(),(req,res)=>{
    db.find('design','address',req.body,res,{},0,0)
})

// 删除地址
app.post('/deleteAddress',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
    var whereStr = { "_id": id}; 
    db.delete('design','address',whereStr,res,true)
    res.send({
        msg:1
    })
})

// 修改地址
app.post('/updateAddress',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
    //更新条件
    var whereStr = {'_id':id};  
    //更新内容
    var updateStr = {$set: { receiver:req.body.receiver,
                             phone:req.body.phone,
                             area:req.body.area,
                             detailAddress:req.body.detailAddress,
                             isDefault:req.body.isDefault}
                    };
     // 如果传入为默认地址，则要修改其他地址为不是默认
    if(req.body.isDefault == true){
        // 修改isDefault
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, db2) {
            if (err) throw err;
            var dbo = db2.db("design");
            var whereStr1 = {"isDefault" : true};  // 查询条件
            var updateStr1 = {$set: { "isDefault" : false }};
            dbo.collection("address").updateMany(whereStr1, updateStr1, function(err, res2) {
                if (err) throw err;
                db2.close();
                // 修改
                db.update('design','address',whereStr,updateStr,res,true)
            });
        });
    } else {
        // 修改
        db.update('design','address',whereStr,updateStr,res,true)
    }
})

module.exports = app