import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    minlength: [5, "Name must be at least 5 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have a email"],
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    validate: {
      validator: function (v) {
        // Only validate if password is being modified or is new
        // and it's not already hashed (hashed passwords are long and don't match the regex)
        if (v.length > 50) return true; // Loose check for hashed password
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+/.test(v);
      },
      message: "Password must contain uppercase, lowercase, number and special character",
    },
    select: false,
  },
  photo: String,
  active: {
    default: true,
    type: Boolean,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  passwordResetVerified: {
    type: Boolean,
  },
  passwordChangeAt: {
    type: Date,
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password") || user.isNew) return next();
  // user.passwordChangeAt = Date.now() - 1000;
  user.passwordChangeAt = Date.now();
  next();
});
userSchema.methods.changePasswordAfter = function (JWTIAT) {
  const user = this;
  if (user.passwordChangeAt) {
    const time = Math.floor(user.passwordChangeAt / 1000);
    if (time > JWTIAT) return true;
  }
  return false;
};
userSchema.methods.isCorrectPassword = async function (
  enteredPassword,
  userPassword,
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};
const User = mongoose.model("User", userSchema);
export default User;
