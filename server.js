'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const server = express();
server.use(cors());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/book', { useNewUrlParser: true, useUnifiedTopology: true });

const BookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    img: String
});
const OwnerSchema = new mongoose.Schema({
    email: String,
    books: [BookSchema]
});
const ownerModel = mongoose.model('User', OwnerSchema);

function userCollection() {
    const collectionData = new ownerModel({
        email: 'sanaa.almoghraby@gmail.com',
        books: [
            {
                name: 'The Growth Mindset',
                description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.',
                status: 'FAVORITE FIVE',
                img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg'
            },
            {
                name: 'The Momnt of Lift',
                description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.',
                status: 'RECOMMENDED TO ME',
                img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg'
            }
        ]
    })
    console.log(collectionData);
    // collectionData.save();
}

// userCollection();



//localhost:3002/book?myEmail=sanaa.almoghraby@gmail.com
server.get('/book',getBookinf)

function getBookinf(req,res){
    
    const myEmail=req.query.myEmail;
    ownerModel.find({email:myEmail,function(err,data){
        if (err){
            res.send('not correct email')
        }else{
            res.send(data[0].books)
        }
        
    }})

}


server.get('/', homePageHandler);

function homePageHandler(req, res) {
    res.send('all good')
}


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})