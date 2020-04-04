const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

app.post('/addOrder',bodyParser.json(),(req,res)=>{
    db.insert('design','order',req.body,res)
})
//查所有订单
app.post('/findOrder',bodyParser.json(),(req,res)=>{
    // console.log(req.body)
    db.find('design','order',req.body,res,{},0,0)
})

app.post('/findOrderByuserId',bodyParser.json(),(req,res)=>{
    // console.log(req.body)
    var whereStr = {'receive.userId':req.body.userId}
    console.log(whereStr)
    db.find('design','order',whereStr,res,{},0,0)
})

// 支付时修改订单支付时间和状态
app.post('/updateOrder',bodyParser.json(),(req,res)=>{
    console.log('fffff')
    console.log(req.body)
    //更新条件
    var whereStr = {'orderNo':req.body.orderNo};  
    //更新内容
    var updateStr = {$set: { payTime:req.body.payTime,
                             status:'待发货'}
                    };
    db.update('design','order',whereStr,updateStr,res,true)
})

// 发货时修改订单状态和添加发货时间
app.post('/updateOrderBySend',bodyParser.json(),(req,res)=>{
    //更新条件
    var whereStr = {'orderNo':req.body.orderNo};  
    //更新内容
    var updateStr = {$set: { sendTime:req.body.sendTime,
                             status:req.body.status}
                    };
    db.update('design','order',whereStr,updateStr,res,true)
})

module.exports = app;