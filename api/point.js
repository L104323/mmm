const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 添加积分
app.post('/addPoint',bodyParser.json(),(req,res)=>{
    db.insert('design','point',req.body,res)
})

// 查询所有积分
// app.post('/fintPoint',bodyParser.json(),(req,res)=>{
//     db.find('design','point',req.body,res,{},0,0)
// })

app.get('/fintPoint',(req,res)=>{
    db.find('design','point',req.query,res,{},0,0)
})

module.exports=app;