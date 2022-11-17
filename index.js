if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require('mongoose');

const ExpressError = require("./utils/ExpressError");

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const nodesRoutes = require('./routes/nodes');
const usersRoutes = require('./routes/users');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const session = require("express-session");
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 12,
        maxAge: 1000 * 60 * 60 * 12,
        sameSite: 'strict'
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongo connection
main()
    .then(() => {
        console.log("Connection Open!!!");
    })
    .catch(
        err => { console.log("Ooops error!!!"); console.log(err); });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/parallist');
}

//express route handling

app.listen('3333', () => {
    console.log("App is listening on 3333 port.");
})

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // res.locals.success = req.flash('success');
    // res.locals.error = req.flash('error');
    // res.locals.alert = req.flash('alert');
    // res.locals.message = '';
    // console.log("req.session is: ", req.session);
    // console.log("res.locals is: ", res.locals);
    next();
});

app.get('/', (req, res) => {
    res.redirect('/nodes');
})

app.use('/', usersRoutes);
app.use('/nodes', nodesRoutes);

app.get('/todo', (req, res) => {
    res.render('todo', { 'title': 'To-Do' });
})

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
})

app.use((err, req, res, next) => {
    if (!(err.statusCode))
        err.statusCode = 500;
    if (!err.message)
        err.message = "Oh no. Somethting went wrong."
    res.status(err.statusCode).render('error', { err, title: "Error" });
})