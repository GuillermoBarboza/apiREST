require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const mongoose = require("mongoose");
const app = express();


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'twita',
        resave: true,
        saveUninitialized: true,// resave y save uninitialized
    }) 
)

app.use(routes)

mongoose.connect(`mongodb://localhost/${process.env.DATABASE_NAME}`);
mongoose.connection
 .once("open", () => console.log("¡Conexión con la base de datos establecida!"))
 .on("error", error => console.log(error));


app.listen(3000, () => {
    console.log("listening on 3000");
  });