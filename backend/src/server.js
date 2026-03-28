import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running normally.' });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Attempt to sync database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced successfully.');
}).catch(err => {
  console.error('\n=============================================================');
  console.error('DATABASE ERROR: Unable to connect to PostgreSQL.');
  console.error('Please ensure that:');
  console.error('1. PostgreSQL is installed and running on your local machine.');
  console.error('2. Your PostgreSQL credentials match what is in config/database.js or .env');
  console.error('3. If PostgreSQL is not installed, you will need to install it to use this backend.');
  console.error('Error details:', err.message);
  console.error('=============================================================\n');
});
