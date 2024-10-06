const express = require('express');
const app = express.Router()
const collection = require('../models/user')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(session({secret: "Your secret key" , saveUninitialized:false , resave:false}));
app.use(express.static("views"))
app.use(express.static("views/customer"))


// Middleware to serve static files
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render('login')
})

app.post("/", async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await collection.findOne({ name: name });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            
                req.session.user = { name: name ,userId: user.id};
                res.redirect('/home');
                
            } 
        else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = app