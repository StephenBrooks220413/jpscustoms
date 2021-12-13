const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
    const blogposts = await BlogPost.find({}).find({}).sort({_id: -1}).limit({limit: 10});
    console.log(req.session)
    res.render('/blogs',{
        blogposts
    })
}