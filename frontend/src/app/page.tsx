'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/services/productService';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';
import { useFilter } from '@/context/FilterContext';
import api from '@/lib/axios';

const PAGE_LIMIT = 20;

async function getProductsWithMeta(params: { category?: string; search?: string; page?: number; limit?: number }) {
  const queryParams: Record<string, any> = { page: params.page || 1, limit: params.limit || PAGE_LIMIT };
  if (params.category && params.category !== 'All' && params.category !== 'For You') queryParams.category = params.category;
  if (params.search) queryParams.search = params.search;
  const { data: body } = await api.get('/products', { params: queryParams });
  return { products: (body.data || []) as Product[], totalPages: body.totalPages || 1 };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slowResponse, setSlowResponse] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(2);

  const { searchQuery, selectedCategory } = useFilter();

  const fetchProductsItems = useCallback(async (isAutoRetry: boolean = false) => {
    let slowTimeoutId: NodeJS.Timeout | null = null;
    let autoRetryTimeoutId: NodeJS.Timeout | null = null;
    
    try {
      setLoading(true);
      setError(null);
      if (!isAutoRetry) setSlowResponse(false);
      setPage(1);

      slowTimeoutId = setTimeout(() => {
        setSlowResponse(true);
        // Auto-retry 10 seconds after detecting cold start
        autoRetryTimeoutId = setTimeout(() => {
          fetchProductsItems(true);
        }, 10000);
      }, 5000);

      const { products: data, totalPages: tp } = await getProductsWithMeta({
        category: selectedCategory,
        search: searchQuery,
        page: 1,
        limit: PAGE_LIMIT,
      });

      if (slowTimeoutId) clearTimeout(slowTimeoutId);
      if (autoRetryTimeoutId) clearTimeout(autoRetryTimeoutId);
      if (!isAutoRetry) setSlowResponse(false);

      setProducts(data || []);
      setTotalPages(tp);
    } catch (err: any) {
      if (slowTimeoutId) clearTimeout(slowTimeoutId);
      if (autoRetryTimeoutId) clearTimeout(autoRetryTimeoutId);
      setSlowResponse(false);
      setError('⚠️ Server is in cold start mode. Please refresh or retry in a few seconds.');
    } finally {
      if (slowTimeoutId) clearTimeout(slowTimeoutId);
      if (!isAutoRetry) setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProductsItems(false);
  }, [fetchProductsItems]);

  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth >= 1024) setItemsPerRow(4);      // lg/md
      else if (window.innerWidth >= 640) setItemsPerRow(3);  // sm
      else setItemsPerRow(2);                                // mobile
    };

    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, []);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      const { products: more } = await getProductsWithMeta({
        category: selectedCategory,
        search: searchQuery,
        page: nextPage,
        limit: PAGE_LIMIT,
      });
      setProducts(prev => [...prev, ...more]);
      setPage(nextPage);
    } catch (err: any) {
      setError(err.message || 'Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <BannerCarousel />
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <span className="text-xl">⚠️</span>
                <p className="font-medium text-sm sm:text-base">{error}</p>
              </div>
              <button onClick={() => fetchProductsItems(false)} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-colors text-sm whitespace-nowrap active:scale-95">
                Retry Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slow API Alert */}
        <AnimatePresence>
          {slowResponse && loading && !error && (
            <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm relative">
                <div className="absolute bottom-0 left-0 h-[3px] bg-yellow-400/50 w-full animate-pulse" />
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <span className="text-xl animate-bounce">🚀</span>
                  <p className="font-medium text-sm sm:text-base">Server is waking up (cold start). This may take up to 60 seconds.</p>
                </div>
                <button onClick={() => fetchProductsItems(false)} className="px-5 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-100 font-semibold rounded-md transition-colors text-sm whitespace-nowrap border border-yellow-300 dark:border-yellow-600 active:scale-95">
                  Retry Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Header */}
        <div className="mt-4 mb-1 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">
            Products <span className="text-[#2874f0]">For You</span>
          </h2>
          {!loading && products.length > 0 && (
            <span className="text-xs text-gray-400 font-medium">{products.length} items</span>
          )}
        </div>
        <div className="w-full h-px bg-gray-200 mb-4" />

        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="bg-white border border-gray-100 h-[370px] p-4 flex flex-col animate-pulse rounded-sm">
                  <div className="w-full h-44 bg-gray-100 rounded-sm mb-4" />
                  <div className="w-full h-3 bg-gray-100 rounded-sm mb-2" />
                  <div className="w-4/5 h-3 bg-gray-100 rounded-sm mb-4" />
                  <div className="w-1/4 h-3 bg-gray-100 rounded-sm mb-3" />
                  <div className="w-2/5 h-4 bg-gray-100 rounded-sm mt-auto mb-3" />
                  <div className="w-full h-9 bg-gray-100 rounded-sm" />
                </div>
              ))}
            </div>
          ) : !error && products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm border border-gray-100 shadow-sm">
              <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty state" className="w-48 h-48 mx-auto mb-4 object-contain opacity-70" />
              <h2 className="text-xl font-medium text-gray-800 mb-2">Sorry, no products found!</h2>
              <p className="text-gray-500">Please check your spelling or try searching for something else</p>
            </div>
          ) : !error && (
            <>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <AnimatePresence mode="popLayout">
                  {products.map((product, index) => {
                    const rowIndex = Math.floor(index / itemsPerRow);
                    let bgWrapperClass = "bg-transparent";
                    if (rowIndex < 2) bgWrapperClass = "bg-gray-100/60 dark:bg-gray-900/50";
                    else if (rowIndex < 4) bgWrapperClass = "bg-blue-50/50 dark:bg-blue-900/20";
                    else bgWrapperClass = "bg-transparent";

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.22, type: 'spring', stiffness: 260, damping: 22 }}
                        className={`h-full rounded-2xl p-1.5 sm:p-2 transition-colors duration-500 ${bgWrapperClass}`}
                      >
                        <Link href={`/product/${product.id}`} className="block h-full cursor-pointer outline-none">
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={Number(product.price)}
                            originalPrice={product.originalPrice ? Number(product.originalPrice) : undefined}
                            rating={product.rating}
                            reviews={product.reviews}
                            imageUrl={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400/eeeeee/999999?text=No+Image'}
                          />
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Load More Button */}
              {page < totalPages && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-10 py-3 bg-[#2874f0] text-white font-semibold rounded-sm shadow hover:bg-[#1a5dc8] transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Loading...
                      </>
                    ) : `Load More (${products.length} of ${totalPages * PAGE_LIMIT}+)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
