const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    stripePaymentIntentId: { type: String, required: true, unique: true },
    stripeChargeId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    refundedAmount: { type: Number, default: 0 },
    stripeRefundId: { type: String },
    paymentMethod: { type: String },
    receiptUrl: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// stripePaymentIntentId has unique:true already
paymentSchema.index({ user: 1 });
paymentSchema.index({ order: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
