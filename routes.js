const express = require("express");
const router = express();
const controllers = require('./controllers/controllers')

//RUTAS
router.get("/articulo/:id/css/styles.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("/articulo/:id/js/app.js", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});

router.get('/', (req, res) => {
    res.render("home")
})

module.exports = router;