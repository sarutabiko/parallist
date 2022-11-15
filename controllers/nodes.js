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

    req.body.entry = await Node.countDocuments({ topic: req.body.topic }) + 1;
    // basic error handling
    // if (!(req.body))
    //     throw new ExpressError('400', "Invalid Node data received..")
    const { topic, entry, data } = req.body;
    const newNode = new Node({ topic, entry, data });
    console.log("req,files is: ", req.files);
    console.log("req,.body is: ", req.body);
    // newNode.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newNode.author = req.user._id;
    await newNode.save();
    console.log(newNode);
    res.redirect(`/nodes/${newNode.id}`);
}

module.exports.renderNewForm = (req, res) => {
    res.render('new', { 'title': 'Create new node' });
}

module.exports.showNode = async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findById(id).populate('author');
    console.log("after pop: ", getNode);
    res.render('showNode', { getNode, 'title': 'Show' });
}

module.exports.updateNode = async (req, res) => {
    const { id } = req.params;
    const getNode = await Node.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(getNode);
    res.redirect(`/nodes/${getNode._id}`);
}

module.exports.deleteNode = async (req, res) => {
    const { id } = req.params;
    const output = await Node.findOneAndDelete({ "_id": id });
    const list = await Node.find({ "topic": output.topic, "entry": { $gt: output.entry } });
    for (let i of list) {
        i.entry--;
        await i.save();
    }
    console.log(output);
    res.redirect('/nodes');
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const getNode = await Node.findById(id);
    if (!getNode)
        return next(new AppError('404', "Node not found. Invalid _id."));

    res.render('edit', { getNode, 'title': 'Edit node', topicList });
}