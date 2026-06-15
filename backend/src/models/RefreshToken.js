const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
    ipAddress: { type: String },
    userAgent: { type: String },
    replacedBy: { type: String },
  },
  { timestamps: true }
);

// token has unique:true already; only add non-duplicate indexes
refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.methods.isActive = function () {
  return !this.isRevoked && this.expiresAt > new Date();
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
