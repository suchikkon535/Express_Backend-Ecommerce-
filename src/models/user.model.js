const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  const password =
    update.password || (update.$set && update.$set.password);

  if (!password) return;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  if (update.password) {
    update.password = hashed;
  } else {
    update.$set.password = hashed;
  }
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_TOKEN,
    { expiresIn: "7d" }
  );
};

module.exports = mongoose.model("User", userSchema);