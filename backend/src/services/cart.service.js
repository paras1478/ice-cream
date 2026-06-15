const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { NotFoundError, ApiError } = require('../utils/ApiError');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name images price stock isActive slug',
      populate: { path: 'category', select: 'name' },
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  }

  async addItem(userId, productId, quantity = 1) {
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) throw new NotFoundError('Product');
    if (product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} units available`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty) {
        throw new ApiError(400, `Only ${product.stock} units available`);
      }
      existingItem.quantity = newQty;
      existingItem.price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateItem(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new NotFoundError('Cart');

    const item = cart.items.id(itemId);
    if (!item) throw new NotFoundError('Cart item');

    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      throw new ApiError(400, `Only ${product.stock} units available`);
    }

    item.quantity = quantity;
    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new NotFoundError('Cart');

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId) {
    await Cart.findOneAndUpdate({ user: userId }, { items: [], couponCode: null, discountAmount: 0 });
  }

  async syncPrices(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) item.price = product.price;
    }
    await cart.save();
  }
}

module.exports = new CartService();
