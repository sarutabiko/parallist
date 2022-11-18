const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const topicList = ["Musings", "Jap", "RealTalk"];

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    topics: {
        type: [String],
        default: topicList
    }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = { User };