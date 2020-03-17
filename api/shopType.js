const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

app.get('/findShopType',bodyParser.json(),(req,res)=>{
    db.find('design','shopType',req.body,res,{},0,0)
})

module.exports=app;