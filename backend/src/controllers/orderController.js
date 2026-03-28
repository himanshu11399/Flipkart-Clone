import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { userId, fullName, phone, address, paymentMethod, items } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const order = await orderService.createOrder({ userId, fullName, phone, address, paymentMethod, items });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    if (error.message === 'Cart is empty') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await orderService.getOrderById(id);

    // Map to the specific format requested by the user
    const formattedOrder = {
      id: order.id,
      status: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      address: order.address,
      phone: order.phone,
      "customer name": order.fullName,
      total: order.totalAmount,
      createdAt: order.createdAt,
      "order items": order.OrderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        "product details": item.Product
      }))
    };

    res.status(200).json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required as a query parameter' });
    }

    const orders = await orderService.getOrdersByUserId(userId);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
