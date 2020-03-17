const express=require('express');
// const router = express.Router();
const app=express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoose=require('mongoose');

const upload = require('../utils/upload.js');

// 查找商品(多表关联)
app.get('/findShopList',(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("design");
        var shop = [];
        // 用promise，是为了查找到的结果赋值给另一个变量
        // 查找商品
        var allShop = function(){
            return new Promise(function(resolve,reject){
                dbo.collection("shopList"). find({}).toArray(function(err, result) { // 返回集合中所有数据
                    if (err) throw err;
                    resolve(result)
                })
            })
        }
        // 根据id查找商品类型
        var findType = function(whereStr){
            return new Promise(function(resolve,reject){
                dbo.collection("shopType"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
                    if (err) throw err;
                    resolve(result)
                })
            })
        }
        // 返回最终的商品列表
        allShop().then(function(result){
            shop = result
            var i = 0;
            shop.forEach((item,index)=>{
                var id=mongoose.Types.ObjectId(item.typeId)
                var whereStr = { "_id": id}
                findType(whereStr).then(function(resData){ 
                    shop[index].shopType = resData[0].shopType
                    i++
                    if(i==shop.length){
                        res.send(shop)
                    }
                })
            })
        })
    })
})

// 添加商品
app.post('/addShop',bodyParser.json(),(req,res)=>{
    console.log(req.body)
    db.insert('design','shopList',req.body,res)
})

//上传图片
app.post('/uploadShop',function(req,res,next){
    var pathImg = '/shop';
    upload(req,res,pathImg);
})


module.exports=app;