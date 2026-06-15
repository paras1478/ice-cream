const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAll(req.query);
  return ApiResponse.paginated(res, 'Products retrieved', products, pagination);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  return ApiResponse.success(res, 'Product retrieved', product);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getBySlug(req.params.slug);
  return ApiResponse.success(res, 'Product retrieved', product);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  return ApiResponse.created(res, 'Product created', product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  return ApiResponse.success(res, 'Product updated', product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.delete(req.params.id);
  return ApiResponse.success(res, 'Product deleted');
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await productService.getFeatured(limit);
  return ApiResponse.success(res, 'Featured products', products);
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { page, limit } = req.pagination || { page: 1, limit: 12 };
  const { products, pagination } = await productService.getByCategory(req.params.categoryId, page, limit);
  return ApiResponse.paginated(res, 'Category products', products, pagination);
});

const searchProducts = asyncHandler(async (req, res) => {
  const { q, ...options } = req.query;
  const { products, pagination } = await productService.getAll({ search: q, ...options });
  return ApiResponse.paginated(res, 'Search results', products, pagination);
});

const updateStock = asyncHandler(async (req, res) => {
  const { stock, operation } = req.body;
  const product = await productService.updateStock(req.params.id, stock, operation);
  return ApiResponse.success(res, 'Stock updated', { stock: product.stock });
});

module.exports = { getAllProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getProductsByCategory, searchProducts, updateStock };
