const Address = require('../models/Address');
const { NotFoundError, ForbiddenError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const addAddress = asyncHandler(async (req, res) => {
  // If first address, set as default
  const count = await Address.countDocuments({ user: req.user._id });
  if (count === 0) req.body.isDefault = true;

  const address = await Address.create({ ...req.body, user: req.user._id });
  return ApiResponse.created(res, 'Address added', address);
});

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort('-isDefault -createdAt');
  return ApiResponse.success(res, 'Addresses retrieved', addresses);
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new NotFoundError('Address');

  Object.assign(address, req.body);
  await address.save();
  return ApiResponse.success(res, 'Address updated', address);
});

const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new NotFoundError('Address');

  await Address.findByIdAndDelete(req.params.id);

  // If deleted was default, set another as default
  if (address.isDefault) {
    await Address.findOneAndUpdate({ user: req.user._id }, { isDefault: true });
  }

  return ApiResponse.success(res, 'Address deleted');
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw new NotFoundError('Address');

  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  address.isDefault = true;
  await address.save();

  return ApiResponse.success(res, 'Default address set', address);
});

module.exports = { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress };
