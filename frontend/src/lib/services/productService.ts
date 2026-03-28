import api from '@/lib/axios';

// ── Types ──────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Fetch products with optional filters and pagination.
 */
export async function getProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const queryParams: Record<string, any> = {};
  if (params?.category && params.category !== 'All' && params.category !== 'For You') {
    queryParams.category = params.category;
  }
  if (params?.search) queryParams.search = params.search;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  // Backend response: { success: true, data: Product[], totalCount, currentPage, totalPages }
  const { data: body } = await api.get('/products', { params: queryParams });

  return body.data || [];
}

/**
 * Fetch a single product by its UUID.
 */
export async function getProductById(id: string): Promise<Product> {
  const { data: response } = await api.get<ApiResponse<Product>>(`/products/${id}`);
  
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Product not found');
  }
  
  return response.data;
}
