const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      required: true,
      enum: [
        'user.register',
        'user.login',
        'user.logout',
        'user.update',
        'user.delete',
        'user.password_change',
        'product.create',
        'product.update',
        'product.delete',
        'order.create',
        'order.cancel',
        'order.status_update',
        'payment.success',
        'payment.fail',
        'payment.refund',
        'coupon.create',
        'coupon.delete',
        'coupon.apply',
        'review.create',
        'review.delete',
        'upload.image',
        'upload.delete',
      ],
    },
    resourceType: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  {
    timestamps: true,
    capped: { size: 50 * 1024 * 1024, max: 50000 }, // 50MB capped collection
  }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;
