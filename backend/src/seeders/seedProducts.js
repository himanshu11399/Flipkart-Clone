import sequelize from '../config/database.js';
import { Product, Order, OrderItem, Cart, CartItem } from '../models/index.js';

const categories = [
  "Fashion", "Mobiles", "Beauty", "Electronics", "Home", "Appliances", 
  "Toys, Baby", "Food & Health", "Auto Acc...", "2 Wheele...", 
  "Sports & More", "Books & More", "Furniture"
];

const categoryImages = {
  "Fashion": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
  "Mobiles": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
  "Beauty": ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600"],
  "Electronics": ["https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"],
  "Home": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
  "Appliances": ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=600"],
  "Toys, Baby": ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600"],
  "Food & Health": ["https://images.unsplash.com/photo-1498837167922-2f157ad21ea2?w=600"],
  "Auto Acc...": ["https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"],
  "2 Wheele...": ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600"],
  "Sports & More": ["https://images.unsplash.com/photo-1526512340740-9217d0159da9?w=600"],
  "Books & More": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"],
  "Furniture": ["https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600"]
};

const products = [];

categories.forEach((category) => {
  for (let i = 1; i <= 20; i++) {
    const price = Math.floor(Math.random() * (50000 - 500) + 500);
    const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.3));

    products.push({
      name: `Premium ${category} Item ${i}`,
      description: `High quality ${category.toLowerCase()} item for everyday use. Comes with standard warranty and excellent build quality.`,
      price: price,
      originalPrice: originalPrice,
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 5000) + 10,
      category: category,
      stock: Math.floor(Math.random() * 100) + 10,
      images: categoryImages[category] || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    });
  }
});

export async function seedProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connection established.');

    // Clear all related tables to avoid orphaned records
    console.log('🗑️  Clearing all existing data...');
    await OrderItem.destroy({ where: {}, truncate: false });
    await Order.destroy({ where: {}, truncate: false });
    await CartItem.destroy({ where: {}, truncate: false });
    await Cart.destroy({ where: {}, truncate: false });
    
    // Drop and recreate Product table
    await Product.sync({ force: true });
    console.log('🗑️  All tables cleared and Product table recreated.');

    const created = await Product.bulkCreate(products, { ignoreDuplicates: true });
    console.log(`🌱  Seeded ${created.length} products successfully.`);
  } catch (err) {
    console.error('❌  Seeding failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

// Allow running directly:  node src/seeders/seedProducts.js
seedProducts();
