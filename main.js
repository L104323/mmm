const express=require('express');

const app=express();

const shopList=require('./api/shopList');
const user=require('./api/user');
const categoryGarbage=require('./api/categoryGarbage');
const slider=require('./api/slider');
const questionbb=require('./api/question');
const point=require('./api/point');
const shopType=require('./api/shopType');
const category=require('./api/category');

app.use('/',user);

app.use('/',shopList);

app.use('/',categoryGarbage);

app.use('/',slider);

app.use('/',questionbb);

app.use('/',point);

app.use('/',shopType);

app.use('/',category);

module.exports=app;