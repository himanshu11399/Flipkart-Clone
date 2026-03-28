import { Cart, CartItem, Product, User } from '../models/index.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  
  if (!cart) {
    // Optionally create a dummy user if none exists for testing purposes
    // since we don't have full auth wired up globally yet
    let user = await User.findByPk(userId);
    if (!user) {
       user = await User.create({
         id: userId,
         name: 'Anonymous Shopper',
         email: `guest_${Date.now()}@example.com`,
         password: 'dummy_password'
       });
    }
    cart = await Cart.create({ userId: user.id });
  }
  return cart;
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        include: [{ model: Product }]
      }
    ]
  });
  return cart || { CartItems: [] };
};

export const addToCart = async ({ userId, productId, quantity = 1 }) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const cart = await getOrCreateCart(userId);

  let cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId }
  });

  if (cartItem) {
    // Update quantity explicitly appending the new quantity
    cartItem.quantity += parseInt(quantity, 10);
    await cartItem.save();
  } else {
    // Create new cart item
    await CartItem.create({
      cartId: cart.id,
      productId,
      quantity: parseInt(quantity, 10)
    });
  }

  // Refresh cart with product details loaded
  return await getCart(userId);
};

export const updateCartItem = async ({ cartItemId, quantity }) => {
  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [{ model: Cart }]
  });
  
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const userId = cartItem.Cart.userId;

  if (quantity <= 0) {
    await cartItem.destroy();
  } else {
    cartItem.quantity = parseInt(quantity, 10);
    await cartItem.save();
  }

  // Refresh cart with product details loaded
  return await getCart(userId);
};

export const removeCartItem = async (cartItemId) => {
  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [{ model: Cart }]
  });
  
  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  const userId = cartItem.Cart.userId;
  await cartItem.destroy();

  // Refresh cart with product details loaded
  return await getCart(userId);
};
