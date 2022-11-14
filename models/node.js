const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    topic: {
        type: String,
    },
    entry: Number,
    data: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

/* nodeSchema.statics.addTopic = function (newTopic) {
    topicList.push(newTopic);
}

nodeSchema.statics.delTopic = async function (delTopic) {
    topicList.find(element => element === delTopic);
    await this.deleteMany({ topic: delTopic });
} */

const Node = mongoose.model('Node', nodeSchema);
module.exports = { Node };

