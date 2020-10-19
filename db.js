const mongoose = require("mongoose");



mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(`mongodb+srv://Guishe:5e*q2$J8c9h3.6W@cluster0.uxix3.gcp.mongodb.net/el_twitter?retryWrites=true&w=majority`);




module.exports = mongoose;