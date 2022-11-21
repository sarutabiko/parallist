const { use } = require('passport');
const { Node } = require('../models/node');
const { User } = require('../models/user');

module.exports.renderIndex = async (req, res, next) => {
    let { topic } = req.query;
    let allNodes;
    if (topic) { allNodes = await Node.find({ topic }); }
    else { topic = "all"; allNodes = await Node.find({}); }

    res.render('all', { allNodes, topic, "title": `${topic} Nodes` })
}

module.exports.createNode = async (req, res) => {

    const { topic, data } = req.body;
    const newNode = new Node({ topic, data });
    // console.log("req,files is: ", req.files);
    // console.log("req,.body is: ", req.body);
    newNode.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // console.log("req.user is: ", req.user);
    newNode.author = req.user._id;
    // console.log(newNode);

    const user = await User.findById(req.user._id);
    // console.log("user found: ", user);
    if (!(user.topics.find(top => top.title === topic))) {
        user.topics.push({ title: topic, count: 1 });
        newNode.entry = 1;
    }
    else {
        user.topics.forEach(top => {
            if (top.title === topic) {
                top.count++;
                newNode.entry = top.count;
            }
        });
    }
    await user.save();
    await newNode.save();
    req.flash("sucess", "Node created.");
    res.redirect(`/nodes/${newNode.id}`);
}

module.exports.renderNewForm = (req, res) => {
    console.log("currentuser..topics are: ", req.user.topics)
    res.render('new', { 'title': 'Create new node' });
}

module.exports.showNode = async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id).populate('author');
    // console.log("thumbs is: ", getNode.thumbs);
    res.render('showNode', { getNode, 'title': 'Show' });
}

module.exports.updateNode = async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // console.log(getNode);
    res.redirect(`/nodes/${getNode._id}`);
}

module.exports.deleteNode = async (req, res) => {
    const { id } = req.params;
    const node = await Node.findById(id);
    const updateNodes = await Node.find({ author: req.user._id, topic: node.topic, entry: { $gt: node.entry } });
    // console.log("nodes to be upddate: ", updateNodes);

    const user = await User.findById(req.user._id);
    user.topics.forEach((top, i) => {
        if (top.title === node.topic) {
            if (--top.count === 0)
                user.topics.splice(i, 1);
        }
    })
    await user.save();


    await node.remove();
    // const list = await Node.find({ "topic": output.topic, "entry": { $gt: output.entry } });
    for (let i of updateNodes) {
        i.entry--;
        await i.save();
    }

    res.redirect('/nodes');
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    if (!getNode)
        return next(new AppError('404', "Node not found. Invalid _id."));

    res.render('edit', { getNode, 'title': 'Edit node' });
}