const Category = require('../models/Category');
const { NotFoundError, ConflictError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('productCount')
    .sort('sortOrder name');
  return ApiResponse.success(res, 'Categories retrieved', categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('productCount');
  if (!category) throw new NotFoundError('Category');
  return ApiResponse.success(res, 'Category retrieved', category);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('productCount');
  if (!category) throw new NotFoundError('Category');
  return ApiResponse.success(res, 'Category retrieved', category);
});

const createCategory = asyncHandler(async (req, res) => {
  const exists = await Category.findOne({ name: new RegExp(`^${req.body.name}$`, 'i') });
  if (exists) throw new ConflictError('Category already exists');

  const category = await Category.create(req.body);
  return ApiResponse.created(res, 'Category created', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new NotFoundError('Category');
  return ApiResponse.success(res, 'Category updated', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const Product = require('../models/Product');
  const hasProducts = await Product.exists({ category: req.params.id, isActive: true });
  if (hasProducts) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete category with active products. Deactivate products first.',
    });
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new NotFoundError('Category');
  return ApiResponse.success(res, 'Category deleted');
});

module.exports = { getAllCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
