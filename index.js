const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const userRoute = require('./routes/user');

mongoose.connect(process.env.MONGO_CLOUD_DB || process.env.MONGO_LOCAL_DB)
.then(()=>{
    console.log('DB is Connected...');
})
.catch(()=>{
    console.log('Something went wrong while connecting to database');
})

app.use(express.json());

app.use('/api/user', userRoute);

app.get('/', (req, res)=>{
    res.send("homepage")
    console.log('homepage');
})

app.listen(process.env.PORT || 8000, ()=>{
    console.log('awesome...');
})