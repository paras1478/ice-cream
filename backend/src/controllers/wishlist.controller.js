const User = require('../models/User');
const Product = require('../models/Product');
const { NotFoundError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { isActive: true },
    select: 'name images price comparePrice slug rating reviewCount stock',
    populate: { path: 'category', select: 'name' },
  });
  return ApiResponse.success(res, 'Wishlist retrieved', user.wishlist);
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new NotFoundError('Product');

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: productId } });
  return ApiResponse.success(res, 'Added to wishlist');
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
  return ApiResponse.success(res, 'Removed from wishlist');
});

const clearWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
  return ApiResponse.success(res, 'Wishlist cleared');
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
