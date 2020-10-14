const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')


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
    passport.use(
      new LocalStrategy(
        { usernameField: "username", passwordField: "password", session: true },
        function (username, password, done) {
          
          
          done(null, username)

          
        }
      )
    );
    serializeDeserialize(passport);
  },

  
};
