const User = require('../models/User');
const Order = require('../models/Order');
const { NotFoundError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta } = require('../middleware/pagination');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price slug');
  return ApiResponse.success(res, 'Profile retrieved', user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  return ApiResponse.success(res, 'Profile updated', user);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  return ApiResponse.success(res, 'Password changed successfully');
});

const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  return ApiResponse.success(res, 'Account deactivated successfully');
});

// Admin controllers
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, isActive, sort = '-createdAt' } = req.query;
  const filter = {};
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, 'Users retrieved', users, buildPaginationMeta(total, Number(page), Number(limit)));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  const orders = await Order.find({ user: user._id }).sort('-createdAt').limit(5).lean();
  return ApiResponse.success(res, 'User retrieved', { user, recentOrders: orders });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true }
  );
  if (!user) throw new NotFoundError('User');
  return ApiResponse.success(res, 'User role updated', user);
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new NotFoundError('User');
  return ApiResponse.success(res, 'User deactivated', user);
});

module.exports = { getProfile, updateProfile, changePassword, deleteAccount, getAllUsers, getUserById, updateUserRole, deactivateUser };
