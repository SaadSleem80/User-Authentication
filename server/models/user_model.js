const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter an email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Minimum password length is 6 characters "],
  },
});

// fire before user save to db
Schema.pre("save", async function (next) {
  const Salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, Salt);
  next();
});

Schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect Password");
  }
  throw Error("incorrect Email");
};

const User = mongoose.model("user", Schema);

module.exports = User;
