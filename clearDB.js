const mongoose = require('mongoose');
const { Node } = require('./models/node');
const { User } = require('./models/user');

const deleteUsers = async function () {
    await User.deleteMany({});
    console.log("Deleted all users")
}

const deleteNodes = async function () {
    await Node.deleteMany({});
    console.log("Deleted all nodes")
}

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

module.exports = { deleteUsers, deleteNodes };