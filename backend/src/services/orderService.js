import { sequelize, Order, OrderItem, Cart, CartItem, Product } from '../models/index.js';

export const createOrder = async ({ userId, fullName, phone, address, paymentMethod, items }) => {
  // We use a transaction to ensure all or nothing
  const transaction = await sequelize.transaction();

  try {
    let orderItemsData = [];
    let totalAmount = 0;

    if (items && items.length > 0) {
      // Buy Now Flow: Use provided items
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        
        totalAmount += (Number(product.price) * (item.quantity || 1));
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity || 1,
          priceAtPurchase: product.price
        });
      }
    } else {
      // Standard Flow: Use Cart
      const cart = await Cart.findOne({
        where: { userId },
        include: [{ model: CartItem, include: [Product] }]
      });

      if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      cart.CartItems.forEach(item => {
        totalAmount += (Number(item.Product.price) * item.quantity);
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.Product.price
        });
      });
      
      // We'll clear the cart later if this is the standard flow
    }

    const order = await Order.create({
      userId,
      totalAmount,
      paymentMethod,
      fullName,
      phone,
      address
    }, { transaction });

    // Create individual order line items
    for (const itemData of orderItemsData) {
      await OrderItem.create({
        orderId: order.id,
        ...itemData
      }, { transaction });
    }

    // Clear cart ONLY if we didn't use the explicit items list (Standard Flow)
    if (!items || items.length === 0) {
      const cart = await Cart.findOne({ where: { userId } });
      if (cart) {
        await CartItem.destroy({ where: { cartId: cart.id }, transaction });
      }
    }

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ]
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

export const getOrdersByUserId = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return orders;
};
