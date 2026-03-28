import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function check() {
  try {
    const [products] = await sequelize.query('SELECT id, name FROM "Products" LIMIT 5');
    console.log('Products:', products);

    const [orderItems] = await sequelize.query('SELECT "productId", "orderId" FROM "OrderItems" LIMIT 5');
    console.log('Order Items:', orderItems);

    if (orderItems.length > 0) {
        const productId = orderItems[0].productId;
        const [foundProduct] = await sequelize.query(`SELECT id, name FROM "Products" WHERE id = '${productId}'`);
        console.log(`Checking if Product ${productId} exists:`, foundProduct.length > 0 ? 'Yes' : 'No');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

check();
