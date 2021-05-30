require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const timestamp = require("mongoose-timestamp");
const _ = require("lodash");

const auth = require("./routes/auth");
const User = require("./database/models/user_model");

const blogRoute = require("./routes/blogRoute");


mongoose.connect("mongodb+srv://admin-liri:"+process.env.DBPASS+"@cluster0.l3cay.mongodb.net/PositateDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://positate.herokuapp.com/auth/google/positate",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          name: profile.displayName,
          username: profile.emails[0].value,
          image: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);



app.use("/", auth);
app.use("/blog", blogRoute);
app.use("/", blogRoute);
app.use("/category", blogRoute);


app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
