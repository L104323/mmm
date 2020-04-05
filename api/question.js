const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

// 随机抽取题目
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
            // console.log(result)
            res.send(randomQuestion)
            db.close();
        });
    });
})
// 查询所有题目
app.get('/findAllQuestion',(req,res)=>{
    var whereStr = req.query
    if(Object.keys(whereStr).length>0){
        const reg=new RegExp(req.query.question,'i');
        whereStr = {"question":{$regex:reg}};
    }
    db.find('design','question',whereStr,res,{},0,0)
})
// 分页查询
app.get('/findAllQuestion2',(req,res)=>{
    var skipCount=req.query.pageSize*(req.query.pageIndex-1);
    const reg=new RegExp(req.query.question,'i');
    var whereStr = {question:{$regex:reg}};
    if(whereStr.question==''){
        whereStr = {};
    }
    db.find('design','question',whereStr,res,{},skipCount,parseInt(req.query.pageSize));
})
// 添加题目
app.get('/addQuestion',bodyParser.json(),(req,res)=>{
    let whereObj = req.query
    whereObj.options.forEach((item,index)=>{
        whereObj.options[index]=JSON.parse(whereObj.options[index])
    })
    db.insert('design','question',whereObj,res)
})


// 修改题目
app.post('/updateQuestion',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body._id)
    //更新条件
    var whereStr = {'_id':id};  
    //更新内容
    var updateStr = {$set: { explain:req.body.explain,
                             options:req.body.options,
                             question:req.body.question}
                    };
    db.update('design','question',whereStr,updateStr,res,true)
})

// 删除题目
app.post('/deleteQuestion',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
      var whereStr = { "_id": id}; 
    db.delete('design','question',whereStr,res,true)
    res.send({
      msg:1
    })
})

// 批量删除题目
app.post('/deleteManyQuestion',bodyParser.json(),(req,res)=>{
    console.log(req.body.ids)
    var ids=req.body.ids
    ids.forEach(item=>{
      var id=mongoose.Types.ObjectId(item)
      var whereStr = { "_id": id}; 
      db.delete('design','question',whereStr,res,true)
    })
    res.send({
      msg:1
    })
})


module.exports=app;