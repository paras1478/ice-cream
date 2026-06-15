const Review = require('../models/Review');
const Order = require('../models/Order');
const { NotFoundError, ForbiddenError, ConflictError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta } = require('../middleware/pagination');

const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  // Check for duplicate
  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) throw new ConflictError('You have already reviewed this product');

  // Check verified purchase
  const hasPurchased = await Order.exists({
    user: userId,
    'items.product': productId,
    orderStatus: 'delivered',
  });

  const review = await Review.create({
    ...req.body,
    user: userId,
    product: productId,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'name avatar');
  return ApiResponse.created(res, 'Review submitted', review);
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments({ product: productId }),
  ]);

  const ratingDist = await Review.aggregate([
    { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  return ApiResponse.paginated(
    res,
    'Reviews retrieved',
    { reviews, ratingDistribution: ratingDist },
    buildPaginationMeta(total, Number(page), Number(limit))
  );
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new NotFoundError('Review');
  if (review.user.toString() !== req.user._id.toString()) throw new ForbiddenError();

  Object.assign(review, req.body);
  await review.save();
  await review.populate('user', 'name avatar');
  return ApiResponse.success(res, 'Review updated', review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new NotFoundError('Review');

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ForbiddenError();

  await Review.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 'Review deleted');
});

const getMyReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ user: req.user._id })
      .populate('product', 'name images slug')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments({ user: req.user._id }),
  ]);

  return ApiResponse.paginated(res, 'My reviews', reviews, buildPaginationMeta(total, Number(page), Number(limit)));
});

module.exports = { createReview, getProductReviews, updateReview, deleteReview, getMyReviews };
