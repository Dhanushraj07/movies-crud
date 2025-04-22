import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // 🔐 Import bcrypt
import crypto from "crypto"; // 🔐 Import crypto
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    set: (name) =>
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email"
    }
  },
  role:{
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // hide password from query results
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is required"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// 🔐 Password Hashing Middleware
userSchema.pre("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword field
  this.confirmPassword = undefined;
  next();
});


// 🔐 Password Comparison Method
userSchema.methods.correctPassword = async function (candidatePassword,userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};
  
userSchema.methods.createResetToken = function () {
  // Create a reset token (for password reset)
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hash the token and set it to the passwordResetToken field
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  // Set the expiration time for the token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  console.log(resetToken, this.passwordResetToken, this.passwordResetExpires);
  // Return the un-hashed token to send to the user
  return resetToken;
}
const User = model("User", userSchema);
export default User;
