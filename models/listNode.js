const mongoose = require('mongoose');

const topicList = ["Musings", "Jap", "RealTalk"];

const listNode = new mongoose.Schema({
    topic: {
        type: String,
        enum: topicList
    },
    entry: Number,
    data: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

/* listNode.statics.addTopic = function (newTopic) {
    topicList.push(newTopic);
}

listNode.statics.delTopic = async function (delTopic) {
    topicList.find(element => element === delTopic);
    await this.deleteMany({ topic: delTopic });
} */

const Node = mongoose.model('Node', listNode);
module.exports = { Node, topicList };

