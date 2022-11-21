const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { Node } = require('./models/node');


const defaultTopicList = ["Musings", "Jap", "RealTalk"];

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    topics: {
        type: [String],
        default: defaultTopicList
    },
    NofTopics: {
        type: [Number],
        default: new Array(defaultTopicList.length).fill(0)
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.addTopic = function (newTopic) {
    UserSchema.topics.push(newTopic);
    UserSchema.NofTopics.push(1);
}

UserSchema.statics.delTopic = async function (delTopic) {

    if (delTopic in this.topics) {
        await Node.deleteMany({ 'author': this.username, 'topic': delTopic });

        const index = this.topics.indexOf(delTopic);
        this.topics.splice(index, 1); // 2nd parameter means remove one item only
    }
    else
        console.log("Topic doesn't exist"); // This should never run
}


const User = mongoose.model('User', UserSchema);
module.exports = { User };