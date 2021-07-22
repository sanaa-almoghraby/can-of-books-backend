'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json())
const PORT = process.env.PORT;

// mongodb://sanaa:sanaa#123@cluster0-shard-00-00.jn4uh.mongodb.net:27017,cluster0-shard-00-01.jn4uh.mongodb.net:27017,cluster0-shard-00-02.jn4uh.mongodb.net:27017/book?ssl=true&replicaSet=atlas-ow5lhc-shard-0&authSource=admin&retryWrites=true&w=majority
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
    const sanaa = new ownerModel({
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
    console.log(sanaa);
    sanaa.save();
}

// userCollection();



//localhost:3001/book?myEmail=sanaa.almoghraby@gmail.com
server.get('/book', getBookinf)

server.post('/addbooks', addNewbook)
server.delete('/delebook/:id', deletbook)
server.put('/updatebooks/:id', updatebook)



function getBookinf(req, res) {

    const myEmail = req.query.myEmail;
    ownerModel.find({ email: myEmail }, (err, data) => {
        if (err) {
            res.send('not correct email')
        } else {
            res.send(data[0].books)
        }

    })

}
///////////////////////////////////////////////////////////////////////////

function addNewbook(req, res) {

    let { email, name, description, status, img } = req.body;
    // console.log('ssssssssssss', req.body);
    ownerModel.find({ email: email }, (err, data) => {
        if (err) {
            res.send('not correct email')
        } else {
            data[0].books.push({

                name: name,
                description: description,
                status: status,
                img: img

            })

            data[0].save()
            res.send(data[0].books)
        }

    })
}
/////////////////////////////////////////////////////////////

function deletbook(req, res) {
    let { email } = req.query;
    let indx = Number(req.params.id);
    ownerModel.find({ email: email }, (err, data) => {
        if (err) {
            res.send('not correct email')
        } else {
            const resdele = data[0].books.filter((elem, index) => {
                if (index !== indx) {
                    return elem;
                }
            })
            data[0].books = resdele
            // console.log('sssssssssss', data[0].books);
            data[0].save()
            res.send(data[0].books)
        }

    })


}
////////////////////////////////////////////////////////////////////////////
function updatebook(req, res) {
    let { email, name, description, status, img } = req.body;
    console.log(req.body);
    let indx = Number(req.params.id);
    console.log('ccccccccccc',indx);
    ownerModel.findOne({ email: email }, (err, data) => {
        if (err) {
            res.send('not correct email')

        } else {
            // const resdele = data[0].books.filter((elem, index) => {
            //     if (index !== indx) {
            //         return elem;
            //     }else{
            //         elem={
            //                     name: namebook,
            //                     description: descriptionbook,
            //                     status: statusbook,
            //                     img: imgbook
            //                 }
            //                 return elem;
            //     }

            // })
            // data[0].books=resdele
             
                data.books.splice(indx, 1, {
                    name: name,
                    description: description,
                    status: status,
                    img: img
                });

        }

        console.log(data);
        data.save();
        res.send(data.books);
    });

}


server.get('/', homePageHandler);

function homePageHandler(req, res) {
    res.send('all good')
}


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})