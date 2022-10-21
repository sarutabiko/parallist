const mongoose = require('mongoose');
const { Node, topicList } = require('./models/listNode');

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

const N = new Node({
    topic: "RealTalk",
    entry: 1,
    data: "First entry, Wooooo!"
})

await N.save();

const fakeData = [{
    topic: "RealTalk",
    entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
    data: "Phue phue phue this text is legitimate.",
}, {
    topic: "Jap",
    entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
    data: "what am I doing nani nani",
}, {
    topic: "Musings",
    entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
    data: "An unexamined life is not worth living - Hypocrites",
},
];


Node.insertMany(fakeData)
    .then(res => console.log(res))
    .catch(e => console.log(e));
