const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

// BlogPost.find({}, (error, blogpost)=>{
//     console.log(error, blogpost)
// }).sort({_id: -1}).limit({limit: 10});

var id = "61afa82430fdc5f993d42375";

BlogPost.findByIdAndUpdate(id, {
    title: "Node.js Make Apps Easily"
}, (error, blogpost)=>{
    console.log(error, blogpost)
})