const express=require('express');
const app = express();

const db=require('../db/db.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var mongoose=require('mongoose');

let fs = require('fs');
let formidable = require('formidable');
let sd = require('silly-datetime');
app.use('/public',express.static('./public')); //定要设置为静态文件，否则访问不了

// 图片上传：把本地图片上传到express项目public文件夹里，用路径访问，如http://localhost:5000/public/avatar/图片名
app.post('/upload',function(req,res,next){
    console.log('ttt')
    let AVATAR_UPLOAD_FOLDER = '/avatar';
    //创建上传表单
    var form = new formidable.IncomingForm();
    //设置编码格式
    form.encoding = 'utf-8';
    //设置上传目录
    form.uploadDir = './public' + AVATAR_UPLOAD_FOLDER;
    //保留后缀
    form.keepExtensions = true;
    //文件大小
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req,function(err,fields,files){
    let filesFile = files.file
    if (err) {
      return res.json({
        status: 500,
        msg: "内部服务器错误",
        result:''
      })
    }
    // 限制文件大小 单位默认字节 这里限制大小为2m
    if (filesFile.size > form.maxFieldsSize) {
      fs.unlink(filesFile.path)
      return res.json({
        status: '1',
        msg: "图片大小不能超过2M",
        result:''
      })
    }
    //后缀名
    var extName = '';
    switch (filesFile.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    if (extName.length == 0) {
      return res.json({
        status: '1',
        msg: "只支持png和jpg格式图片",
        result:''
      })
    }
    //使用第三方模块silly-datetime
    var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
    //生成随机数
    var ran = parseInt(Math.random() * 8999 + 10000);
    // 生成新图片名称
    var avatarName = t + '_' + ran + '.' + extName;
    // 新图片路径
    var newPath = form.uploadDir + '/' + avatarName;
    // 更改名字和路径
    fs.rename(filesFile.path, newPath, function (err) {
      if (err) {
        return res.json({
          "code": 401,
          "message": "图片上传失败"
        })
      } else{
        return res.json({
          status: "0",
          msg: "图片上传成功",
          result: {
             data: AVATAR_UPLOAD_FOLDER + '/' + avatarName
          }
       })
      }
    })
  })
})

// 所有用户查询
app.post('/user/login',bodyParser.json(),(req,res)=>{
  db.find('design','user',req.body,res,{},0,0)
})

// 用户分页查询
app.post('/user/findUser',bodyParser.json(),(req,res)=>{
  const reg=new RegExp(req.body.username,'i'); //不区分大小写，实现模糊查询
  var skipCount=req.body.pageSize*(req.body.pageIndex-1);
  if(req.body.roleId!=''){
    var roleId=parseInt(req.body.roleId);
  }
  var whereStr = {"username":{$regex:reg},"roleId":roleId};
  
  if(req.body.username=='' && req.body.roleId==''){
    whereStr={}
  }
  if(req.body.roleId=='' && req.body.username!=''){
    var whereStr = {"username":{$regex:reg}}
  }
  if(req.body.username=='' && req.body.roleId!=''){
    var whereStr = {"roleId":roleId}
  }
  db.find('design','user',whereStr,res,{},skipCount,req.body.pageSize);
})

// 用户添加
app.post('/user/addUser',bodyParser.json(),(req,res)=>{
  db.insert('design','user',req.body,res)
})

// 用户单行删除
app.post('/user/deleteUser',bodyParser.json(),(req,res)=>{
  var id=mongoose.Types.ObjectId(req.body.id)
	var whereStr = { "_id": id}; 
  db.delete('design','user',whereStr,res,true)
  res.send({
    msg:1
  })
})

// 用户批量删除
app.post('/user/deleteManyUser',bodyParser.json(),(req,res)=>{
  var ids=req.body.ids
  ids.forEach(item=>{
    var id=mongoose.Types.ObjectId(item)
    var whereStr = { "_id": id}; 
    // db.delete('design','user',whereStr,res,true)
    // MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db("design");
    //   // var whereStr = {"name":'菜鸟教程'};  // 查询条件
    //   dbo.collection("user").deleteOne(whereStr, function(err, obj) {
    //       if (err) throw err;
    //       console.log("文档删除成功");
    //       db.close();
    //   });
    // });
    db.delete('design','user',whereStr,res,true)
  })
  res.send({
    msg:1
  })
})

// 用户修改
app.post('/user/updateUser',bodyParser.json(),(req,res)=>{
  var id=mongoose.Types.ObjectId(req.body.id)
  //更新条件
  var whereStr = {'_id':id};  
  //更新内容
  var updateStr = {$set: { username:req.body.username,
                           password:req.body.password,
                           email:req.body.email,
                           roleId:req.body.roleId,
                           headImg:req.body.headImg}
                  };
  db.update('design','user',whereStr,updateStr,res,true)
})

module.exports=app;