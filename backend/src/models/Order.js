const mongoose = require('mongoose');

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, 'Order must have items'],
    },
    shippingAddress: { type: addressSnapshotSchema, required: true },
    billingAddress: { type: addressSnapshotSchema },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      required: true,
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    subtotal: { type: Number, required: true },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    stripePaymentIntentId: { type: String },
    stripeChargeId: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// orderNumber has unique:true already; only add non-duplicate indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ICE-${year}-${String(count + 1).padStart(6, '0')}`;
    this.statusHistory = [{ status: this.orderStatus, timestamp: new Date(), note: 'Order placed' }];
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
