const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  // Note: If you're using passport-local-mongoose, it will automatically add a unique 'username' field,
  // and you don't need to explicitly define it in the schema
  email: {
    type: String,
    unique: true
  },
  // Add any other fields you need
  googleId: String,
  displayName: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
