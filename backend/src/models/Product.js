const mongoose = require('mongoose');
const slugifyUtil = require('../utils/slugify');

const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    saturatedFat: { type: Number, default: 0 },
    transFat: { type: Number, default: 0 },
    cholesterol: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    totalCarbohydrates: { type: Number, default: 0 },
    dietaryFiber: { type: Number, default: 0 },
    sugars: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: { type: String, unique: true },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: { type: Number, min: [0, 'Compare price cannot be negative'] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    flavor: { type: String, trim: true },
    ingredients: [{ type: String, trim: true }],
    nutritionFacts: { type: nutritionSchema, default: () => ({}) },
    images: [{ type: String }],
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: { type: String, sparse: true, trim: true },
    weight: { type: Number, min: 0 },
    servingSize: { type: String, trim: true },
    allergens: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true, lowercase: true }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('discountPercentage').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// slug has unique:true; sku uses sparse; only add non-duplicate indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text', flavor: 'text' });

productSchema.pre('save', async function (next) {
  if (!this.isModified('name') && this.slug) return next();
  let slug = slugifyUtil(this.name);
  const exists = await mongoose.models.Product.findOne({ slug, _id: { $ne: this._id } });
  if (exists) slug = `${slug}-${Date.now()}`;
  this.slug = slug;
  next();
});

productSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true }).populate('category', 'name slug');
};

productSchema.statics.getFeatured = function (limit = 8) {
  return this.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort({ soldCount: -1 });
};

productSchema.statics.searchProducts = function (query, options = {}) {
  const { page = 1, limit = 12, sort = '-createdAt', minPrice, maxPrice, category, flavor } = options;
  const filter = { isActive: true };
  if (query) filter.$text = { $search: query };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  if (category) filter.category = category;
  if (flavor) filter.flavor = new RegExp(flavor, 'i');
  return this.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
