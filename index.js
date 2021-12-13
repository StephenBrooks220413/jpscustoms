const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const BlogPost = require('./models/BlogPost');
const fileUpload = require('express-fileupload');

// dotenv for DB connection string
require('dotenv').config();

app.use(fileUpload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// DB
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
if(!mongoose){
    console.log('Error connecting to DB')
} else {
    console.log('DB connected!!')
}

// controllers
const expressSession = require('express-session');
const authMiddleware = require('./middleware/authMiddleware');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logout');

app.use(expressSession({
    secret: '894w95945nfnflum'
}))

// routes
app.listen(3000, () => {
    console.log('app listening')
})

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/about', (req, res)=>{
    res.render('about')
})

app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.get('/catalog', (req, res)=>{
    res.render('catalog')
})

app.get('/create', (req, res) =>{
    res.render('create')
})

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/auth/logout', logoutController);

global.loggedIn = null;

app.use("*", (req, res, next)=>{
    loggedIn = req.session.userId;
    next()
});


// single post page
app.get('/post/:id', async (req, res)=>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{
        blogpost
    })
})

// receiving post
app.get('/blogs', async (req,res) =>{
    const blogposts = await BlogPost.find({}).sort({_id: -1}).limit({limit: 10});
    // console.log(blogposts)
    res.render('blogs',{
        blogposts
    })
})

// creating post
app.post('/posts/store', authMiddleware, (req, res)=>{
    BlogPost.create(req.body,(error,blogpost)=>{
        res.redirect('/blogs')
    })
})

app.post('/posts/store',async (req,res) =>{    
    let image = req.files.image
    image.mv(path.resolve(__dirname,'public/img',image.name),
        async (error)=>{
            await BlogPost.create({
                ...req.body,
                image:'/img/' + image.name
            })
            res.redirect('/blogs')
        })

})

app.use((req, res) => res.render('notfound'));