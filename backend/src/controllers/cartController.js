import * as cartService from '../services/cartService.js';

export const getCart = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required via query or headers' });
    }

    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'userId and productId are required in body' });
    }

    const cart = await cartService.addToCart({ userId, productId, quantity });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'cartItemId and quantity are required in body' });
    }

    const cart = await cartService.updateCartItem({ cartItemId, quantity });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    if (error.message === 'Cart item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.body.cartItemId || req.query.cartItemId;

    if (!cartItemId) {
      return res.status(400).json({ success: false, message: 'cartItemId is required' });
    }

    const cart = await cartService.removeCartItem(cartItemId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    if (error.message === 'Cart item not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};
