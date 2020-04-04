const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 最新记录
app.post('/addAnswerRecord',bodyParser.json(),(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        var whereStr = {"userId":req.body.userId}
        dbo.collection("answerRecord"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            if( result.length == 0 ){
                db.insert('design','answerRecord',req.body,res)
            } else {
                var updateStr = {$set: { successTimes:req.body.successTimes,
                            errorTimes:req.body.errorTimes,
                            points:req.body.points }
                };
                db.update('design','answerRecord',whereStr,updateStr,res,true)
            }
            db1.close();
        });
    })
})

app.get('/findRecord',bodyParser.json(),(req,res)=>{
    db.find('design','answerRecord',req.body,res,{},0,0)
})


module.exports=app;