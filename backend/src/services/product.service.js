const Product = require('../models/Product');
const Category = require('../models/Category');
const { NotFoundError, ConflictError } = require('../utils/ApiError');
const { buildPaginationMeta } = require('../middleware/pagination');

class ProductService {
  async getAll(query = {}) {
    const { search, category, minPrice, maxPrice, flavor, sort = '-createdAt', page = 1, limit = 12, featured, inStock } = query;

    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    if (flavor) filter.flavor = new RegExp(flavor, 'i');
    if (featured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    return { products, pagination: buildPaginationMeta(total, Number(page), Number(limit)) };
  }

  async getById(id) {
    const product = await Product.findOne({ _id: id, isActive: true }).populate('category', 'name slug');
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async getBySlug(slug) {
    const product = await Product.findBySlug(slug);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  _normalizeData(data) {
    const d = { ...data };

    // Normalize weight: "500g" → strip non-numeric, or just store as-is if not parseable
    if (d.weight !== undefined && d.weight !== null && d.weight !== '') {
      const num = parseFloat(String(d.weight).replace(/[^\d.]/g, ''));
      d.weight = isNaN(num) ? undefined : num;
    } else {
      delete d.weight;
    }

    // Map frontend nutritionFacts keys to model keys
    if (d.nutritionFacts) {
      const nf = d.nutritionFacts;
      d.nutritionFacts = {
        calories: nf.calories ?? 0,
        totalFat: nf.totalFat ?? nf.fat ?? 0,
        saturatedFat: nf.saturatedFat ?? 0,
        transFat: nf.transFat ?? 0,
        cholesterol: nf.cholesterol ?? 0,
        sodium: nf.sodium ?? 0,
        totalCarbohydrates: nf.totalCarbohydrates ?? nf.carbs ?? 0,
        dietaryFiber: nf.dietaryFiber ?? 0,
        sugars: nf.sugars ?? nf.sugar ?? 0,
        protein: nf.protein ?? 0,
      };
    }

    return d;
  }

  async create(data) {
    const normalized = this._normalizeData(data);

    if (normalized.sku) {
      const exists = await Product.findOne({ sku: normalized.sku });
      if (exists) throw new ConflictError('SKU already exists');
    }
    const category = await Category.findById(normalized.category);
    if (!category) throw new NotFoundError('Category');

    const product = await Product.create(normalized);
    return product.populate('category', 'name slug');
  }

  async update(id, data) {
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError('Product');
    data = this._normalizeData(data);

    if (data.sku && data.sku !== product.sku) {
      const exists = await Product.findOne({ sku: data.sku, _id: { $ne: id } });
      if (exists) throw new ConflictError('SKU already exists');
    }

    Object.assign(product, data);
    await product.save();
    return product.populate('category', 'name slug');
  }

  async delete(id) {
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError('Product');
    product.isActive = false;
    await product.save();
  }

  async updateStock(id, stock, operation = 'set') {
    const product = await Product.findById(id);
    if (!product) throw new NotFoundError('Product');

    if (operation === 'set') product.stock = stock;
    else if (operation === 'increment') product.stock += stock;
    else if (operation === 'decrement') product.stock = Math.max(0, product.stock - stock);

    await product.save();
    return product;
  }

  async getFeatured(limit = 8) {
    return Product.getFeatured(limit);
  }

  async getByCategory(categoryId, page = 1, limit = 12) {
    const filter = { category: categoryId, isActive: true };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return { products, pagination: buildPaginationMeta(total, page, limit) };
  }
}

module.exports = new ProductService();
