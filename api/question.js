const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 随机抽取问题
app.get('/findQuestion',bodyParser.json(),(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("design");
        dbo.collection("question"). find({}).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            let randomQuestion = [];
            let arr = result;
            // 10道题
            for(var i=0;i<10;i++){
                var index=Math.floor(Math.random()*arr.length); // 取数组的随机索引，Math.floor向下取整，Math.random获取0-1之间随机数
                randomQuestion.push(arr[index]); //把随机取到的元素存进数组里面
                arr.splice(index,1); //删除已随机获取到的数组，防止重复
            }
            res.send(randomQuestion)
            db.close();
        });
    });
})

module.exports=app;