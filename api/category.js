const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 查找垃圾分类内容
app.get('/findCategory',bodyParser.json(),(req,res)=>{
    console.log('ddd')
    db.find('design','category',req.body,res,{},0,0);
})

module.exports=app;