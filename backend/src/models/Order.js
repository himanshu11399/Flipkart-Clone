import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('COD', 'UPI', 'CARD'),
    allowNull: false,
    defaultValue: 'COD'
  },
  paymentStatus: {
    type: DataTypes.ENUM('PENDING', 'PAID'),
    defaultValue: 'PENDING'
  },
  orderStatus: {
    type: DataTypes.ENUM('CONFIRMED', 'SHIPPED', 'DELIVERED'),
    defaultValue: 'CONFIRMED'
  },
  fullName: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT }
}, {
  hooks: {
    beforeCreate: (order) => {
      if (order.paymentMethod === 'COD') {
        order.paymentStatus = 'PENDING';
      } else {
        order.paymentStatus = 'PAID';
      }
    }
  }
});

export default Order;
