const User = require("../models/User");
const Twit = require("../models/Twit");
const faker = require("faker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}

module.exports = {
  fillDb: (req, res) => {
    for (let i = 0; i < 20; i++) {
      let user = new User({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        password: bcrypt.hashSync(faker.lorem.word(), 10),
        email: faker.internet.email(),
        description: faker.lorem.sentence(),
        avatar: faker.image.avatar(),
      });

      user.save();
      for (let i = 0; i < 20; i++) {
        let twit = new Twit({
          author: user._id,
          body: faker.lorem.paragraph(),
          dateOfCreation: randomDate(new Date(2020, 0, 1), new Date(), 0, 24),
        });

        twit.save(function (err, twit) {
          User.findById(user._id, function (err, user) {
            user.twits.push(twit);
            user.save();
          });
        });
      }
    }
    console.log("back end log");
    res.send("ok en tu front");
  },

  homeFeed: (req, res) => {
    console.log("req.params", req.user);

    if (req.user.userId) {
      User.findById(req.user.userId).then((loggedUser) => {
        Twit.find({ author: { $in: loggedUser.following } })
          .limit(20)
          .sort("-dateOfCreation")
          .populate("author")
          //.populate('likes')
          .then((feedResults) => {
            loggedUser.password = "Top-Secret";
            res.json(feedResults);
          });
      });
    } else {
      res.json({});
    }
  },

  discoverFeed: (req, res) => {
    console.log(req.session);

    let userSession = {
      _id: "voidUsername",
      following: [],
      likes: [],
    };
    if (req.isAuthenticated()) {
      User.findById(req.session.passport.user._id).then((loggedUser) => {
        Twit.find({ author: { $nin: loggedUser.following } })
          .limit(20)
          .sort("-dateOfCreation")
          .populate("author")
          //.populate('likes')
          .then((feedResults) => {
            res.json({
              userSession: loggedUser,
              feedResults,
            });
          });
      });
    } else {
      res.json({ userSession });
    }
  },

  logInView: (req, res) => {
    let userSession = {
      _id: "voidUsername",
      following: [],
      likes: [],
    };
    res.json({ userSession });
  },

  registerView: (req, res) => {
    let userSession = {
      _id: "voidUsername",
      following: [],
      likes: [],
    };
    res.json({ userSession });
  },

  signIn: (req, res) => {
    console.log("req body", req.body);
    User.findOne({
      username: req.body.username,
    }).then((result) => {
      console.log("result", result);
      let user = result;
      bcrypt
        .compare(req.body.password, result.password)
        .then((passwordCheck) => {
          console.log("passwordCheck", passwordCheck);
          if (passwordCheck) {
            let token = jwt.sign({ userId: user._id }, process.env.JWTKEY);
            console.log("token en back", token);

            User.findOneAndUpdate(
              { username: req.body.username },
              { token: token },
              { new: true }
            ).then((response) => {
              console.log("user", response);
              let user = {
                username: response.username,
              };
              console.log("pass deleted", response);
              res.json({ user, token: response.token });
            });
          } else {
            res.json({});
          }
        });
    });
  },

  signUp: (req, res) => {
    console.log("pista 1");
    let token = jwt.sign(
      { username: req.body.username, email: req.body.email },
      process.env.JWTKEY
    );
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, process.env.SALT),
      email: req.body.email,
      avatar:
        "https://cms.qz.com/wp-content/uploads/2017/03/twitter_egg_blue.png?w=1100&h=619&strip=all&quality=75",
      token: token,
    });
    user.save();
    res.json({});
  },

  createTwit: (req, res) => {
    console.log(req.user);

    let twit = new Twit(req.body);
    console.log("twit en el back", twit);

    twit.save(function (err, twit) {
      if (err) return res.send(err);
      //console.log("author id", req.body.author);
      //console.log('twit', twit);

      User.findById(req.user.userId, function (err, user) {
        if (err) return res.send(err);
        console.log("user", user);

        user.twits.push(twit);
        user.save();
      });
    });

    res.json({});
  },

  getUserProfile: (req, res) => {
    //console.log(req.params)
    let username = req.params.username;
    let userSession = {
      _id: "voidUsername",
      following: [],
      likes: [],
    };

    User.findById(userSession._id).then((result) => {
      if (result != null) {
        userSession = result;
      }

      User.findOne({ username })
        .populate("twits")
        .then((userProfile) => {
          res.json({ userProfile, userSession });
        });
    });
  },

  like: (req, res) => {
    let newLike = req.body.author;
    console.log(" new like", newLike);

    Twit.findById(newLike).then((twit) => {
      console.log(twit);

      if (twit.likes.indexOf(req.session.passport.user._id) != -1) {
        twit.likes.splice(twit.likes.indexOf(req.session.passport.user._id), 1);
        twit.markModified("twit.likes");
        twit.save();
        res.redirect("/");
      } else {
        twit.likes.push(req.session.passport.user._id);
        twit.markModified("twit.likes");
        twit.save();
        res.redirect("/");
      }
    });
  },

  followUnfollow: (req, res) => {
    //console.log(req.session);
    let newFollowing = req.body.author;

    User.findById(req.session.passport.user._id, function (err, user) {
      if (err) return res.send(err);

      if (user.following.indexOf(newFollowing) != -1) {
        user.following.splice(
          user.following.indexOf(req.session.passport.user._id),
          1
        );
        user.markModified("user.following");
        user.save();
      } else {
        user.following.push(newFollowing);
        user.markModified("user.following");
        user.save();
      }
    });
    User.findById(newFollowing, function (err, user) {
      if (err) return res.send(err);

      if (user.followers.indexOf(req.session.passport.user._id) != -1) {
        user.followers.splice(user.followers.indexOf(newFollowing), 1);
        user.markModified("user.followers");
        user.save();
      } else {
        user.followers.push(req.session.passport.user._id);
        user.markModified("user.followers");
        user.save();
      }
    });

    res.redirect("/");
  },

  logout: function (req, res) {
    res.redirect("/login");
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/login");
    }
  },

  deleteTwit: async (req, res) => {
    const twit = await Twit.findById(req.params.id.toString());
    await Twit.deleteOne({ _id: req.params.id.toString() });
    const user = await User.findById(twit.author._id);
    const index = user.twits.indexOf(req.params.id.toString());
    user.twits.splice(index, 1);
    user.save();
    res.redirect("back");
  },

  //change profile picture
  changeProfilePicture: (req, res) => {},

  userSettings: (req, res) => {
    let userSession = {
      _id: "voidUsername",
      following: [],
      likes: [],
    };
    if (req.isAuthenticated()) {
      userSession = req.session.passport.user;
    }
    User.findById(userSession._id).then((result) => {
      if (result != null) {
        userSession = result;
        console.log(typeof userSession._id);
      }

      res.json({ userSession });
    });
  },
};
