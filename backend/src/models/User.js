const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    googleId: { type: String, sparse: true },
    avatar: { type: String, default: null },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, 'Please enter a valid phone number'],
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiry: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// email has unique:true; googleId has sparse:true — no duplicate index() calls
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpiry;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpiry;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
