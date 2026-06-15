const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return ApiResponse.success(res, 'Cart retrieved', cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(req.user._id, productId, quantity);
  return ApiResponse.success(res, 'Item added to cart', cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user._id, req.params.itemId, req.body.quantity);
  return ApiResponse.success(res, 'Cart updated', cart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.itemId);
  return ApiResponse.success(res, 'Item removed', cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  return ApiResponse.success(res, 'Cart cleared');
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
