import { Op } from 'sequelize';
import { Product } from '../models/index.js';

export const getAllProducts = async (query) => {
  const { search, category, page = 1, limit = 8 } = query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 8;
  const offset = (pageNum - 1) * limitNum;

  const whereCondition = {};

  if (category && category !== 'All' && category !== 'For You') {
    whereCondition.category = category;
  }

  if (search) {
    whereCondition.name = {
      [Op.iLike]: `%${search}%`
    };
  }

  const { count, rows } = await Product.findAndCountAll({ 
    where: whereCondition,
    limit: limitNum,
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    products: rows,
    totalCount: count,
    currentPage: pageNum,
    totalPages: Math.ceil(count / limitNum),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findByPk(id);
  return product;
};
