const mongoose = require('../db');
const Schema = mongoose.Schema;

const twitSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    body: String,
    dateOfCreation: Date,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User'}],
})



module.exports = mongoose.model('Twit', twitSchema)