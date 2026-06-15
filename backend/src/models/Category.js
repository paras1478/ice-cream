const mongoose = require('mongoose');
const slugifyUtil = require('../utils/slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: { type: String, unique: true },
    description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'] },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugifyUtil(this.name);
  }
  next();
});

// slug has unique:true already; only add non-duplicate indexes
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
