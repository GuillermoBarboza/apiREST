const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const User = require('../twitter_clone/models/User');



function serializeDeserialize(passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    
      done(null, user);

  });
}

module.exports = {
  localStrategy: function () {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: "Datos Incorrectos."}); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: "Datos incorrectos."}); }
        return done(null, user);
      });
    }
  ));
  serializeDeserialize(passport);
  }
};


