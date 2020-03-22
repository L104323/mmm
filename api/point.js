const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 添加积分
app.post('/addPoint',bodyParser.json(),(req,res)=>{
    // console.log(req.body)
    db.insert('design','point',req.body,res)
})

// 查询所有积分
app.get('/fintPoint',bodyParser.json(),(req,res)=>{
    // console.log(req.body)
    console.log('0000000')
    db.find('design','point',{},res)
})

module.exports=app;