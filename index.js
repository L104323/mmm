const express=require('express');
const app=express();
const db=require('./db/db.js');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/user/get',(req,res)=>{
    // console.log(req);
    // console.log(res);
    // db.find('design','list',{},res)
    // res.send('访问成功')
    // res.send(db.find('design','list',{},res));
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("design");
        dbo.collection("list"). find({}).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result);
            res.send(result)
            db.close();
        });
    });
})

app.post('/user/submit',bodyParser.json(),(req,res)=>{
    console.log(req.body)
    db.insert('design','list',req.body,res)

})

app.use('/my',(req,res)=>{
	res.send('成功了')
})
app.listen(5000,()=>{console.log('服务启动成功')})