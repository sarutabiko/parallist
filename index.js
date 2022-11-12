const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require('mongoose');

const ExpressError = require("./utils/ExpressError");
const { NodeSchema } = require("./models/validationSchemas");

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const nodesRoutes = require('./routes/nodes');
const usersRoutes = require('./routes/users');


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

app.get('/', (req, res) => {
    res.send('<h1> Welcome to "/" </h1> <a href="/nodes">Lets go</a >');
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