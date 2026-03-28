'use client';

import { ShoppingCart, Star } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  rating?: number;
  reviews?: number;
}

const GUEST_USER_ID = '00000000-0000-4000-a000-000000000000';

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
  rating = 4.3,
  reviews = 1284,
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const calculatedDiscount =
    discountPercent ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  const displayOriginal = originalPrice && originalPrice > price ? originalPrice : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id || isAdding) return;
    try {
      setIsAdding(true);
      await axiosInstance.post('/cart/add', {
        userId: GUEST_USER_ID,
        productId: id,
        quantity: 1,
      });
      toast.success('Added to cart!', {
        icon: '🛒',
        style: { borderRadius: '4px', fontWeight: '500' },
      });
      router.refresh();
    } catch (error) {
      console.error('Add to cart failed', error);
      toast.error('Failed to add to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  // Rating color: green above 4, yellow-orange below
  const ratingBg =
    rating >= 4 ? 'bg-[#388e3c]' : rating >= 3 ? 'bg-[#ff9f00]' : 'bg-[#f44336]';

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.13)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer h-full rounded-sm">
      {/* Image */}
      <div className="relative w-full h-52 p-4 flex items-center justify-center overflow-hidden bg-white dark:bg-gray-100/10">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain max-w-[90%] max-h-[90%] group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
        />
        {calculatedDiscount > 0 && (
          <div className="absolute top-2 left-0 bg-[#388e3c] text-white text-[10px] font-bold px-2 py-1 rounded-r-full shadow-sm">
            {calculatedDiscount}% OFF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-[14px] leading-tight text-[#212121] dark:text-gray-100 line-clamp-2 h-9 mb-1 group-hover:text-[#2874f0] transition-colors duration-200">
          {name}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`inline-flex items-center gap-0.5 text-white text-[12px] font-bold px-1.5 py-0.5 rounded-[3px] ${ratingBg}`}
          >
            {rating}
            <Star size={10} fill="white" strokeWidth={0} />
          </span>
          <span className="text-[#878787] dark:text-gray-400 text-[12px] font-medium">({reviews.toLocaleString('en-IN')})</span>
        </div>

        <div className="flex-grow" />

        {/* Price Row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[16px] font-bold text-[#212121] dark:text-white">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {displayOriginal && (
            <span className="text-[14px] text-[#878787] dark:text-gray-500 line-through">
              ₹{displayOriginal.toLocaleString('en-IN')}
            </span>
          )}
          {calculatedDiscount > 0 && (
            <span className="text-[13px] font-semibold text-[#388e3c]">{calculatedDiscount}% off</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#ff9f00] hover:bg-[#fb641b] text-white text-sm font-bold uppercase rounded-[2px] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] hover:shadow-md"
        >
          <ShoppingCart size={16} strokeWidth={2.5} />
          {isAdding ? 'Adding…' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
