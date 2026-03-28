import sequelize from '../config/database.js';
import User from './User.js';
import Product from './Product.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// 1. User <-> Cart (One-to-One)
// A User has exactly one active Cart.
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// 2. User <-> Order (One-to-Many)
// A User can have multiple past Orders.
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// 3. Cart <-> CartItem (One-to-Many)
// A Cart contains multiple CartItems.
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// 4. Product <-> CartItem (One-to-Many)
// A CartItem represents a specific Product.
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// 5. Order <-> OrderItem (One-to-Many)
// An Order contains many purchased OrderItems.
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// 6. Product <-> OrderItem (One-to-Many)
// An OrderItem represents a specific Product bought.
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem
};
