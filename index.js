const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { Node, topicList } = require('./models/listNode');
const mongoose = require('mongoose');
const { execPath } = require("process");

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { NodeSchema } = require("./models/validationSchemas");

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


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

const validateNode = (req, res, next) => {
    const { error } = NodeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else
        next();
}

//express route handling

app.listen('3333', () => {
    console.log("App is listening on 3333 port.");
})


app.get('/', (req, res) => {
    res.send('<h1> Welcome to "/" </h1> <a href="/nodes">Lets go</a >');
})

app.get('/nodes', catchAsync(async (req, res, next) => {
    let { topic } = req.query;
    let allNodes;
    if (topic) { allNodes = await Node.find({ topic }); }
    else { topic = "all"; allNodes = await Node.find({}); }

    res.render('all', { allNodes, topic, "title": `${topic} Nodes` })
}))

app.get('/nodes/new', (req, res) => {
    res.render('new', { 'title': 'Create new node' });
})


app.post('/nodes', validateNode, catchAsync(async (req, res) => {
    req.body.entry = await Node.countDocuments({ topic: req.body.topic }) + 1;
    // basic error handling
    // if (!(req.body))
    //     throw new ExpressError('400', "Invalid Node data received..")
    const { topic, entry, data } = req.body;
    const newNode = new Node({ topic, entry, data });
    await newNode.save();
    console.log(newNode);
    res.redirect(`/nodes/${newNode.id}`);
}))

app.get('/nodes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    res.render('showNode', { getNode, 'title': 'Show' });
}))

app.get('/nodes/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    if (!getNode)
        return next(new AppError('404', "Node not found. Invalid _id."));

    res.render('edit', { getNode, 'title': 'Edit node', topicList });
}))

app.put('/nodes/:id', validateNode, catchAsync(async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(getNode);
    res.redirect(`/nodes/${getNode._id}`);
}))

app.delete('/nodes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const output = await Node.findOneAndDelete({ "_id": id });
    const list = await Node.find({ "topic": output.topic, "entry": { $gt: output.entry } });
    for (let i of list) {
        i.entry--;
        await i.save();
    }
    console.log(output);
    res.redirect('/nodes');
}))

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