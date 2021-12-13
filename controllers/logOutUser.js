module.exports = (req,res) =>{
    const { username,password } = req.body;
    res.send(username="", password="");
    res.redirect('/');
}