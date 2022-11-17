const mongoose = require('mongoose');
const { Node } = require('./models/node');

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
    data: "First entry, Wooooo!",
    author: '6373c46de90b30edda32f4ca'
})

const saveMany = async function () {
    const fakeData = [{
        topic: "RealTalk",
        entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
        data: "Phue phue phue this text is legitimate.",
        author: '6373c46de90b30edda32f4ca'
    }, {
        topic: "Jap",
        entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
        data: "what am I doing nani nani",
        author: '6373c46de90b30edda32f4ca'
    }, {
        topic: "Musings",
        entry: await Node.find({ 'topic': `${this.topic}` }).countDocuments() + 1,
        data: "An unexamined life is not worth living - Hypocrites",
        author: '6373c46de90b30edda32f4ca'
    },
    ];

    Node.insertMany(fakeData)
        .then(res => console.log(res))
        .catch(e => console.log(e));

}
saveMany();
N.save();
