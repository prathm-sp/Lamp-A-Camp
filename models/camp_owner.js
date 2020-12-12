const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const campOwnerSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email Address" });
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: (value) => {
        if (!validator.isMobilePhone(value, "en-IN")) {
          throw new Error("Invalid Mobile Number");
        }
      },
    },
    address: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    campsListed: [
      {
        camp: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Camps",
        },
      },
    ],
    camp_booking: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings",
        autopopulate: true,
      },
    ],
  },
  { timestamp: true }
);

campOwnerSchema.pre("save", async function (next) {
  const user = this;
  console.log("HELLO", user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 14);
  }
  next();
});

campOwnerSchema.pre("findOneAndUpdate", async function () {
  this._update.password = await bcrypt.hash(this._update.password, 10);
});

campOwnerSchema.methods.genAuthToken = async function () {
  const user = this;
  console.log(user);
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: 3600,
  });
  return token;
};

campOwnerSchema.statics.findByCredentials = async function (email, pass) {
  const user = await CampOwner.findOne({ email: email });
  if (!user) {
    throw new Error("No User Found");
  } else {
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new Error("Invalid Credentials");
    } else {
      return user;
    }
  }
};

campOwnerSchema.plugin(require("mongoose-autopopulate"));
const CampOwner = mongoose.model("CampOwner", campOwnerSchema);
module.exports = CampOwner;
