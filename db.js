const mongoose = require("mongoose");



mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb://localhost/el_twitter');




module.exports = mongoose;