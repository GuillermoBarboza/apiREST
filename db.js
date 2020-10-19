const mongoose = require("mongoose");



mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect("mongodb+srv://Guishe:AQRVl8IzS9Wt1rgC@twita.uxix3.mongodb.net/twita?retryWrites=true&w=majority");




module.exports = mongoose;