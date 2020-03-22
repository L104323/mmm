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
const order=require('./api/order');
const shopCar=require('./api/shopCar');
const address=require('./api/address');

app.use('/',user);

app.use('/',shopList);

app.use('/',categoryGarbage);

app.use('/',slider);

app.use('/',questionbb);

app.use('/',point);

app.use('/',shopType);

app.use('/',category);

app.use('/',order);

app.use('/',shopCar);

app.use('/',address);

module.exports=app;