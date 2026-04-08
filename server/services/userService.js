import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export function generateJWT(id) {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

export const constantTimeCompare = (a, b) => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

export const sendOTPCode = async (userEmail) => {
  const OTP_Code = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  console.log(OTP_Code);
  const otp = hashOtp(OTP_Code);
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); //after 10 min
  
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: userEmail,
      subject: "✅ Verify Your Email - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP code is: <strong style="font-size: 24px;">${OTP_Code}</strong></p>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #d32f2f;">⚠️ Don't share this code with anyone.</p>
        </div>
      `,
    });
    return { otp, expiryTime };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export class AppError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const signUpUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new AppError("An account with this email already exists.", 409);
    }
    const { otp, expiryTime } = await sendOTPCode(existingUser.email);
    existingUser.otp = otp;
    existingUser.otpExpiry = expiryTime;
    existingUser.otpAttempts = 0;

    existingUser.password = password;
    existingUser.name = name;

    await existingUser.save();

    return {
      message: "We found your account! A new OTP has been sent to your email.",
      action: "redirect_to_verify",
      data: {
        email: existingUser.email,
        name: existingUser.name,
      },
    };
  }

  const user = await User.create({ name, email, password });
  const { otp, expiryTime } = await sendOTPCode(user.email);
  user.otp = otp;
  user.otpExpiry = expiryTime;
  await user.save();
  return {
    message: "OTP sent successfully. Please check your email.",
    data: {
      email: user.email,
      name: user.name,
    },
  };
};

export const requestNewOTP = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("You should Signup First", 400);
  }
  const { otp, expiryTime } = await sendOTPCode(email);
  user.otp = otp;
  user.otpExpiry = expiryTime;
  user.otpAttempts = 0;
  await user.save();
  return { user };
};

export const verifyUserAccount = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new AppError("email or otp in not in body", 401);
  }
  const user = await User.findOne({ email });
  if (user && user.isVerified) {
    throw new AppError("this user has already Verified", 401);
  }
  if (!user || !user.otp || !user.otpExpiry) {
    throw new AppError("Invalid request", 400);
  }
  // Check expiry
  if (user.otpExpiry < Date.now()) {
    throw new AppError("OTP has expired", 400);
  }
  if (user.otpAttempts >= 5) {
    throw new AppError("Too many failed attempts. Request a new OTP.", 429);
  }
  
  const hashedOTP = hashOtp(otp);
  if (!constantTimeCompare(user.otp, hashedOTP)) {
    console.log("heeellllo");
    user.otpAttempts += 1;
    await user.save();
    throw new AppError("Invalid OTP", 400, { attemptsLeft: 5 - user.otpAttempts });
  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = undefined;
  user.isVerified = true;
  await user.save();
  const token = generateJWT(user.id);
  
  return { token, expiresInMs: +process.env.JWT_EXPIRES_IN_MS };
};

export const signInUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isVerified) {
    throw new AppError("User not verified , you should verify you account first", 401);
  }
  const isCorrectPassword = await user.isCorrectPassword(password, user.password);

  if (!isCorrectPassword) {
    console.log({ message: "Invalid email or password" });
    throw new AppError("Invalid email or password", 401);
  }
  const token = generateJWT(user.id);
  
  return { token, expiresInMs: Number(process.env.JWT_EXPIRES_IN_MS) || undefined };
};

export const verifyToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("the user that belong to this token become not found", 401);
  }
  const userChangePasswordAfter = user.changePasswordAfter(decoded.iat);
  if (userChangePasswordAfter) {
    throw new AppError("Password changed, please login again", 401);
  }
  return user;
};

export const requestPasswordReset = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("this user not found , please login", 401);
  }

  const { otp, expiryTime } = await sendOTPCode(email);
  user.otp = otp;
  user.otpExpiry = expiryTime;
  user.passwordResetVerified = false;
  user.otpAttempts = 0;
  await user.save({ validateBeforeSave: false });
  return { email };
};

export const verifyPasswordResetCode = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new AppError("email or otp in not in body", 401);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("this user not found , please login", 401);
  }
  if (!user.otp || !user.otpExpiry) {
    throw new AppError("Invalid request", 400);
  }
  // Check expiry
  if (user.otpExpiry < Date.now()) {
    throw new AppError("OTP has expired", 400);
  }
  if (user.otpAttempts >= 5) {
    throw new AppError("Too many failed attempts. Request a new OTP.", 429);
  }
  
  const hashedOTP = hashOtp(otp);
  if (!constantTimeCompare(user.otp, hashedOTP)) {
    console.log("heeellllo");
    user.otpAttempts += 1;
    await user.save();
    throw new AppError("Invalid OTP", 400, { attemptsLeft: 5 - user.otpAttempts });
  }
  user.otp = undefined;
  user.otpAttempts = undefined;
  user.passwordResetVerified = true;
  await user.save();
  return true;
};

export const resetUserPassword = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("email or password is in not in body", 401);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("this user not found , please signUp", 401);
  }
  if (!user.passwordResetVerified) {
    throw new AppError("Please verify OTP first", 403);
  }
  if (!user.otpExpiry || user.otpExpiry < Date.now()) {
    user.passwordResetVerified = undefined;
    user.otpExpiry = undefined;
    await user.save();
    throw new AppError("Reset session expired. Request a new OTP.", 400);
  }

  user.password = password;
  user.passwordResetVerified = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = undefined;

  await user.save();
  return true;
};

export const updateUserPassword = async (userObj, currentPassword, newPassword) => {
  const user = await User.findOne({ email: userObj.email }).select("+password");
  
  const correctPassword = await user.isCorrectPassword(currentPassword, user.password);

  if (!correctPassword) {
    throw new AppError("your currentPassword is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();
  return true;
};

export const updateUserData = async (userId, body, filename) => {
  if (body.password) {
    throw new AppError("This route is not for password updates. Please use /updatePassword.", 400);
  }

  const filteredObj = (objBody, ...filtersData) => {
    const obj = {};
    filtersData.forEach((property) => {
      if (Object.keys(objBody).includes(property)) {
        obj[property] = objBody[property];
      }
    });
    return obj;
  };

  const filterBody = filteredObj(body, "name", "email");
  if (filename) filterBody.photo = filename;

  const newUser = await User.findByIdAndUpdate(userId, filterBody, {
    runValidators: true,
    new: true,
  });

  return newUser;
};

export const deleteUserData = async (userId) => {
  await User.findByIdAndUpdate(userId, { active: false });
  return true;
};
