const express = require("express");
const router = express();
const controllers = require("./controllers/controllers");
const path = require("path");
const jwtMiddleware = require("express-jwt");

//RUTAS
router.get("/css/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("js/app.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/app.js");
});

/* router.get('/', controllers.fillDb)  */

/* RUTAS API */
//RUTAS / TWITS
router.get(
  "/api/twits/feed",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.homeFeed
);

router.post(
  "/api/twits",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.createTwit
);

//delete twit
router.get("/api/twits/eliminar/:id", controllers.deleteTwit);

// LIKES
router.post(
  "/api/twits/like",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.like
);

router.get("/api/profile");
//

// RUTAS /USER

//LOGIN
router.post("/api/users/login", controllers.signIn);
router.get("/login", controllers.logInView);
//LOGOUT
router.get("/logout", controllers.logout);
//REGISTRO
router.post("/api/users/register", controllers.signUp);
router.get("/register", controllers.registerView);
// discover users route
router.get(
  "/api/users/discover",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.discoverFeed
);

// settings
router.get("/api/users/settings", controllers.userSettings);
// Follow someone
router.post(
  "/api/users/follow",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.followUnfollow
);

// USER PROFILE
router.get(
  "/api/users/:username",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.getUserProfile
);

module.exports = router;
