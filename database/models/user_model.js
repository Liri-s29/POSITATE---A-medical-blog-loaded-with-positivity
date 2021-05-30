const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");


const userSchema = new mongoose.Schema({  
    email: String,
    password: String,
    googleId: String,
    name: String,
    image: String
  });

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
userSchema.plugin(timestamp);

const User = mongoose.model('user', userSchema);



module.exports = User;
    
