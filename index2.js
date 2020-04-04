const express=require('express');
const app=express();

const main=require('./main.js');
app.use('/',main);


app.listen(5000,()=>{console.log('服务启动成功')})