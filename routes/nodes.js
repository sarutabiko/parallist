const catchAsync = require("../utils/catchAsync");

const express = require('express');
const router = express.Router();
const { Node, topicList } = require('../models/listNode');
const { validateNode } = require('../utils/middleware');

router.get('/', catchAsync(async (req, res, next) => {
    let { topic } = req.query;
    let allNodes;
    if (topic) { allNodes = await Node.find({ topic }); }
    else { topic = "all"; allNodes = await Node.find({}); }

    res.render('all', { allNodes, topic, "title": `${topic} Nodes` })
}))

router.get('/new', (req, res) => {
    res.render('new', { 'title': 'Create new node' });
})

router.post('/', validateNode, catchAsync(async (req, res) => {
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

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    res.render('showNode', { getNode, 'title': 'Show' });
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    if (!getNode)
        return next(new AppError('404', "Node not found. Invalid _id."));

    res.render('edit', { getNode, 'title': 'Edit node', topicList });
}))

router.put('/:id', validateNode, catchAsync(async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(getNode);
    res.redirect(`/nodes/${getNode._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
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

module.exports = router;
