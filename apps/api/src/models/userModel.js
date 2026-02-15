import mongoose from "mongoose";
import bcrypt from "bcrypt";

const licenseSchema = new mongoose.Schema(
  {
    licensesType: { type: String, required: true },
    totalGenerations: { type: String, required: true },
  },
  {
    _id: false
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: false, // Optional for OAuth users
      select: false // Don't include in queries by default
    },
    profilePicture: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null
    },
    company: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    authProvider: {
      type: String,
      enum: ['google', 'email', 'github'],
      default: 'google'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockoutUntil: {
      type: Date,
      default: null
    },
    licenses: {
      type: [licenseSchema],
      required: true,
      default: () => [
        {
          licensesType: "trial",
          totalGenerations: "5"
        }
      ]
    },
    // Security fields
    passwordChangedAt: {
      type: Date,
      select: false
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ 'licenses.licensesType': 1 });

/**
 * Password hashing middleware
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it was modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // Hash password with strong salt
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Update password changed timestamp
  this.passwordChangedAt = new Date();

  next();
});

/**
 * Compare password method
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if password was changed after token was issued
 */
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

/**
 * Check if account is locked
 */
userSchema.methods.isAccountLocked = function () {
  return this.lockoutUntil && this.lockoutUntil > Date.now();
};

/**
 * Increment failed login attempts
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // Reset if lockout has expired
  if (this.lockoutUntil && this.lockoutUntil < Date.now()) {
    this.failedLoginAttempts = 1;
    this.lockoutUntil = null;
  } else {
    this.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts
    if (this.failedLoginAttempts >= 5 && !this.lockoutUntil) {
      // Lock for 15 minutes
      this.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
  }

  await this.save();
};

/**
 * Reset failed login attempts on successful login
 */
userSchema.methods.resetLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockoutUntil = null;
  this.lastLogin = new Date();
  await this.save();
};

/**
 * Generate password reset token
 */
userSchema.methods.createPasswordResetToken = async function () {
  const crypto = await import('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await this.save({ validateBeforeSave: false });

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
