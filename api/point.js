const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 用户添加
app.post('/addPoint',bodyParser.json(),(req,res)=>{
    console.log(req.body)
    db.insert('design','point',req.body,res)
})

module.exports=app;