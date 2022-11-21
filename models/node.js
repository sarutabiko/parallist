const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    topic: {
        type: String,
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
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
    },
    public: {
        type: Boolean,
        default: false
    }
})

nodeSchema.virtual('thumbs').get(function () {
    const thumbArray = [];
    this.images.forEach(img => { thumbArray.push(img.url.replace('upload', 'upload/w_70,h_40,c_fit')) });
    return thumbArray;
});

// https://res.cloudinary.com/demo/image/upload/w_300,h_100,c_fit/flower.jpg


const Node = mongoose.model('Node', nodeSchema);
module.exports = { Node };

