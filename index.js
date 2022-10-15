const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");


const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const { Node, topicList } = require('./models/listNode');
const mongoose = require('mongoose');

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

app.get('/nodes', async (req, res) => {
    const { topic } = req.query;
    if (topic) {
        const allNodes = await Node.find({ topic });
        res.render('all', { allNodes, topic: topic })
    }
    else {
        const allNodes = await Node.find();
        res.render('all', { allNodes, topic: 'all' });
    }
})

app.get('/nodes/new', (req, res) => {
    res.render('new');
})


app.post('/nodes', async (req, res) => {
    req.body.entry = await Node.countDocuments({ topic: req.body.topic }) + 1;
    const { topic, entry, data } = req.body;
    const newNode = new Node({ topic, entry, data });
    await newNode.save();
    console.log(newNode);
    res.redirect(`/nodes/${newNode.id}`);
})

app.get('/nodes/:id', async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    res.render('showNode', { getNode });
})

app.get('/nodes/:id/edit', async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    res.render('edit', { getNode });
})

app.put('/nodes/:id', async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(getNode);
    res.redirect(`/nodes/${getNode._id}`);
})

app.delete('/nodes/:id', async (req, res) => {
    const { id } = req.params;
    const output = await Node.findByIdAndDelete(id);
    console.log(output);
    res.redirect('/nodes');
})