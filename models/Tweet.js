const mongoose = require('../db');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    body: String,
    dateOfCreation: Date,
    likes: Number,
})



module.exports = mongoose.model('Tweet', tweetSchema)