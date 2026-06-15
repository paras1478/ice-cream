const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home',
    },
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    street: { type: String, required: [true, 'Street address is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    zipCode: { type: String, required: [true, 'Zip code is required'], trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true, default: 'US' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1 });

// Ensure only one default per user
addressSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
