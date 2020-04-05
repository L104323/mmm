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
// app.get('/findShopList',(req,res)=>{
//     MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("design");
//         var shop = [];
//         // 用promise，是为了查找到的结果赋值给另一个变量
//         // 查找商品
//         var allShop = function(){
//             return new Promise(function(resolve,reject){
//                 dbo.collection("shopList"). find({}).toArray(function(err, result) { // 返回集合中所有数据
//                     if (err) throw err;
//                     resolve(result)
//                 })
//             })
//         }
//         // 根据id查找商品类型
//         var findType = function(whereStr){
//             return new Promise(function(resolve,reject){
//                 dbo.collection("shopType"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
//                     if (err) throw err;
//                     resolve(result)
//                 })
//             })
//         }
//         // 返回最终的商品列表
//         allShop().then(function(result){
//             shop = result
//             var i = 0;
//             shop.forEach((item,index)=>{
//                 var id=mongoose.Types.ObjectId(item.typeId)
//                 var whereStr = { "_id": id}
//                 findType(whereStr).then(function(resData){ 
//                     shop[index].shopType = resData[0].shopType
//                     i++
//                     if(i==shop.length){
//                         res.send(shop)
//                     }
//                 })
//             })
//         })
//     })
// })

// 多表关联查找所有商品
app.get('/findShopList2',bodyParser.json(),(req,res)=>{
    MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        // 多表查询
        dbo.collection('shopList').aggregate([
            { $lookup:
                {
                from: 'shopType',            // 右集合
                localField: 'typeId',    // 左集合 join 字段
                foreignField: '_id',         // 右集合 join 字段
                as: 'typeDetails'           // 新生成字段（类型array）
                }
            } 
          ]).toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
          db1.close();
        });
    });
})

// 添加商品
app.post('/addShop',bodyParser.json(),(req,res)=>{
    var whereStr = req.body
    whereStr.typeId = mongoose.Types.ObjectId(whereStr.typeId)
    db.insert('design','shopList',whereStr,res)
})

//上传图片
app.post('/uploadShop',function(req,res,next){
    var pathImg = '/shop';
    upload(req,res,pathImg);
})

// 根据商品类型查询商品
app.post('/findShop',bodyParser.json(),(req,res)=>{
    var whereStr = req.body
    whereStr.typeId = mongoose.Types.ObjectId(whereStr.typeId)
    if (req.body.id) {
        var id=mongoose.Types.ObjectId(req.body.id)
        whereStr = { "_id": id}
    }
    db.find('design','shopList',whereStr,res,{},0,0)
})

// 根据商品名称搜索商品
app.post('/searchShop',bodyParser.json(),(req,res)=>{
    var whereStr = req.body
    const reg=new RegExp(req.body.shopName,'i'); //不区分大小写，实现模糊查询
    var whereStr = {"shopName":{$regex:reg}};
    db.find('design','shopList',whereStr,res,{},0,0)
})

// 分页查询商品
app.get('/findShopPage',(req,res)=>{
    var skipCount=req.query.pageSize*(req.query.pageIndex-1);
    if(req.query.typeId){
        var whereStr = {
            typeId:mongoose.Types.ObjectId(req.query.typeId)
        }        
    }
    if(req.query.shopName){
        const reg=new RegExp(req.query.shopName,'i');
        var whereStr = {
            shopName:{$regex:reg}
        }      
    }
    if(req.query.shopName == undefined && req.query.typeId == undefined){
        var whereStr = {}
    }
    MongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        // 多表查询
        dbo.collection('shopList').aggregate([
            {
                $match:whereStr
            },
            { 
                $lookup:
                {
                from: 'shopType',            // 右集合
                localField: 'typeId',    // 左集合 join 字段
                foreignField: '_id',         // 右集合 join 字段
                as: 'typeDetails'           // 新生成字段（类型array）
                }
            },
            {
                $skip:skipCount
            }, 
            {
                $limit:parseInt(req.query.pageSize)
            }
          ]).toArray(function(err, result) {
          if (err) throw err;
          res.send(result)
          db1.close();
        });
    });
})

// 用户兑换商品时修改商品库存
app.post('/updateShop',bodyParser.json(),(req,res)=>{
    var updateShop = req.body
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db1) {
        if (err) throw err;
        var dbo = db1.db("design");
        updateShop.forEach(item=>{
            var id=mongoose.Types.ObjectId(item.shopId)
            //更新条件
            var whereStr = {'_id':id}; 
            var updateStr = {$set: { "stock" : item.stock }};
            dbo.collection("shopList").updateOne(whereStr, updateStr, function(err, result) {
                if (err) throw err;
            });
        })
        res.send({msg:'ok'})
        db1.close();
    });
})


// 修改商品
app.post('/updateShopAll',bodyParser.json(),(req,res)=>{
    console.log(req.body)
    var id=mongoose.Types.ObjectId(req.body._id)
    //更新条件
    var whereStr = {'_id':id};  
    //更新内容
    var updateStr = {$set: { shopName:req.body.shopName,
                             typeId:mongoose.Types.ObjectId(req.body.typeId),
                             point:req.body.point,
                             money:req.body.money,
                             stock:req.body.stock,
                             shopImg:req.body.shopImg,
                             pics:req.body.pics}
                    };
    db.update('design','shopList',whereStr,updateStr,res,true)
})

// 删除商品
app.post('/deleteShop',bodyParser.json(),(req,res)=>{
    var id=mongoose.Types.ObjectId(req.body.id)
    var whereStr = { "_id": id}; 
    db.delete('design','shopList',whereStr,res,true)
    res.send({
      msg:1
    })
})

// 批量删除商品
app.post('/deleteManyShop',bodyParser.json(),(req,res)=>{
    console.log(req.body.ids)
    var ids=req.body.ids
    ids.forEach(item=>{
      var id=mongoose.Types.ObjectId(item)
      var whereStr = { "_id": id}; 
      db.delete('design','shopList',whereStr,res,true)
    })
    res.send({
      msg:1
    })
})

module.exports=app;