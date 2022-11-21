const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { Node } = require('./node');


// const defaultTopicList = ["Musings", "Jap", "RealTalk"];

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    topics: [{
        title: {
            type: String,
        },
        count: {
            type: Number,
        }
    }],
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = { User };