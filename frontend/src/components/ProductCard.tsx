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
    <div className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-[5/4] sm:aspect-square p-2 flex items-center justify-center bg-white dark:bg-gray-800/10 overflow-hidden border-b border-gray-50 dark:border-gray-800/50">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount badge */}
        {calculatedDiscount > 0 && (
          <div className="absolute top-2 left-0 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r border border-l-0 border-[#388e3c]">
            {calculatedDiscount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-2.5 sm:p-3 pt-1.5 sm:pt-2">
        {/* Title */}
        <h3 className="text-[13px] sm:text-sm leading-snug font-medium text-gray-800 dark:text-gray-200 line-clamp-2 h-[36px] sm:h-[40px] mb-1 group-hover:text-[#2874f0] transition-colors">
          {name}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={`inline-flex items-center gap-0.5 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded ${ratingBg}`}>
            {rating}
            <Star size={9} fill="white" strokeWidth={0} />
          </span>
          <span className="text-gray-500 text-[11px] sm:text-xs font-medium">({reviews.toLocaleString('en-IN')})</span>
        </div>

        <div className="flex-grow" />

        {/* Price Row */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-1">
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-none">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {displayOriginal && (
            <span className="text-[11px] sm:text-xs text-gray-500 line-through leading-none">
              ₹{displayOriginal.toLocaleString('en-IN')}
            </span>
          )}
          {calculatedDiscount > 0 && (
            <span className="text-[11px] sm:text-xs font-semibold text-[#388e3c] leading-none">{calculatedDiscount}% off</span>
          )}
        </div>
        
        {/* Free Delivery Label */}
        <div className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1.5">
          Free delivery
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full py-1.5 sm:py-2 px-2 flex items-center justify-center gap-1.5 bg-[#f0f5ff] hover:bg-[#2874f0] text-[#2874f0] hover:text-white dark:bg-gray-800 dark:hover:bg-[#2874f0] dark:text-gray-200 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-60 disabled:hover:bg-[#f0f5ff] disabled:hover:text-[#2874f0]"
        >
          <ShoppingCart size={15} className="stroke-[2.5px]" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
