const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: { type: Number, required: true },
  },
  { _id: true }
);

cartItemSchema.virtual('total').get(function () {
  return this.price * this.quantity;
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// user has unique:true already; TTL index for abandoned carts after 30 days
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
