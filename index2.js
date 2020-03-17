const express=require('express');
const app=express();
// var bodyParser = require('body-parser');
// const user=require('./api/user');
// app.use('/',user);

const main=require('./main.js');
app.use('/',main);

// app.get('/user/find',bodyParser.json(),(req,res)=>{
//     console.log('fffff')
//     // db.find('design','user',req.body,res,{},0,0)
// })

app.listen(5000,()=>{console.log('服务启动成功')})