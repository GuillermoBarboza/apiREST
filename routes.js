const express = require("express");
const router = express();
const controllers = require('./controllers/controllers')
const passport = require('passport')
//RUTAS
router.get("/articulo/:id/css/styles.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("/articulo/:id/js/app.js", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});

router.get('/', (req, res) => {
    res.redirect("/home")
})

router.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("home");
      } else {
        return res.redirect("/login");
      }
})

// Login routes
router.get('/login', (req, res) =>{
    res.render('login')
})
router.post('/login', controllers.signIn)

// sign up routes
router.get('/registro', (req, res) =>{
    res.render('register')
})


module.exports = router;