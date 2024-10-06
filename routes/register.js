const express = require('express');
const app = express.Router();
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
    res.render('register')
})

app.post("/",async(req,res)=>{
    const name = req.body.username
    const password = req.body.password
    const exist = await collection.findOne({name:name})
    if(exist){
        res.send("Choose onther name please")  
    }else{
        const encryptionPass = await bcrypt.hash(password,10)
        session.user = {name:name}
        await collection.insertMany({name:name,password:encryptionPass})
        res.redirect('/')
    }
})
module.exports = app