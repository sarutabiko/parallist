const mongoose = require('mongoose');

const Node = require('./models/listNode');
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

N.save()
    .then(
        n => console.log(n)
    )

const fakeData = [{
    topic: "RealTalk",
    entry: 12,
    data: "Phue phue phue this text is legitimate.",
}, {
    topic: "Jap",
    entry: 364,
    data: "what am I doing nani nani",
}, {
    topic: "Musings",
    entry: 58,
    data: "Not bored at all.",
}, {
    topic: "Musings",
    entry: 315,
    data: "An unexamined life is not worth living - Hypocrites",
}, {
    topic: "RealTalk",
    entry: 468,
    data: "Still alive",
},
];

Node.insertMany(fakeData)
    .then(res => console.log(res))
    .catch(e => console.log(e));