const express = require('express');
const app = express();
const path = require('path')
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const homeRouter = require("./routes/home");
const session = require('express-session');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));

app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/home', homeRouter);

app.listen(3000, () => {
    console.log("welcome to my web page");
});

