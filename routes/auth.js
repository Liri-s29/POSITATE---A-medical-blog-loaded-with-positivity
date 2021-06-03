const express = require("express");
const router = express.Router();
const passport = require("passport");


const User = require("../database/models/user_model");

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/secrets");
  } else {
    res.render("login");
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get(
  "/auth/google/positate",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  }
);
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
router.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        User.findOneAndUpdate(
          { username: req.body.username },
          { $set: { name: req.body.name, image: "https://image.shutterstock.com/shutterstock/photos/1677509740/display_1500/stock-vector-default-avatar-profile-icon-social-media-user-vector-1677509740.jpg" } },
          (err, foundData) => {
            if (err) {
              console.log(err);
            }
          }
        );
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});
router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

module.exports = router;
