'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { getProductById, Product } from '@/lib/services/productService';
import { ShoppingCart, Zap, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
const GUEST_USER_ID = '00000000-0000-4000-a000-000000000000';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: any) {
        console.error('Failed to fetch product details', err);
        setError(err.message || 'Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-4 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-white dark:bg-gray-900 flex flex-col md:flex-row shadow-sm min-h-[80vh] p-8 gap-8 animate-pulse border border-transparent dark:border-gray-800">
            <div className="w-full md:w-2/5 flex gap-4 h-[400px]">
              <div className="w-16 h-full bg-gray-100 rounded-sm"></div>
              <div className="flex-1 h-full bg-gray-200 rounded-sm"></div>
            </div>
            <div className="w-full md:w-3/5 space-y-6 py-4">
              <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-800 rounded-sm mb-8"></div>
              <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
              <div className="w-1/3 h-8 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
              <div className="w-1/4 h-12 bg-gray-200 dark:bg-gray-800 rounded-sm mt-4"></div>
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-sm mt-8 border border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-32 transition-colors duration-300">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white dark:bg-gray-900 p-12 text-center rounded-sm border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Error Loading Product</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#2874f0] text-white px-8 py-2 rounded-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 bg-white dark:bg-gray-900 max-w-7xl mx-auto my-6 border border-gray-200 dark:border-gray-800 shadow-sm rounded-sm transition-colors duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Product not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://placehold.co/600x600/ffffff/dddddd?text=No+Image', 'https://placehold.co/600x600/ffffff/dddddd?text=Image+2'];

  const discountPercent = 18; 
  const originalPrice = Math.round(Number(product.price) / (1 - discountPercent / 100));

  return (
    <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-4 overflow-x-hidden transition-colors duration-300">
      <div className="container mx-auto max-w-7xl space-y-4">
        
        <div className="bg-white dark:bg-gray-900 flex flex-col md:flex-row shadow-sm min-h-[80vh] border border-transparent dark:border-gray-800 transition-colors">
          
          {/* Left Side: Images & Buttons */}
          <div className="w-full md:w-2/5 p-4 flex flex-col items-center border-r border-[#f0f0f0] dark:border-gray-800 self-start sticky top-20">
            
            <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-auto md:h-[400px] mb-6">
              {/* Thumbnails */}
              <div className="w-full h-16 md:w-16 md:h-full flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto hide-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onMouseEnter={() => setActiveImage(idx)}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 border rounded-sm overflow-hidden flex-shrink-0 bg-white dark:bg-gray-100/10 ${activeImage === idx ? 'border-[#2874f0]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                  </button>
                ))}
              </div>

              {/* Main Image View */}
              <div className="flex-1 flex items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-sm bg-white dark:bg-gray-100/10 relative group cursor-crosshair">
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="w-full hidden md:flex gap-3">
              <button 
                onClick={async () => {
                  try {
                    await api.post('/cart/add', { userId: GUEST_USER_ID, productId: product.id, quantity: 1 });
                    toast.success('Item added to cart!');
                  } catch (e) {
                    toast.error('Failed to add to cart. Database server may be down.');
                  }
                }}
                className="flex-1 bg-[#ff9f00] text-white py-[15px] px-2 rounded-sm font-semibold flex items-center justify-center shadow-md active:scale-95 transition-transform text-lg gap-2"
              >
                <ShoppingCart fill="white" size={20} /> ADD TO CART
              </button>
              <button 
                onClick={() => {
                   router.push(`/checkout?type=buyNow&productId=${product.id}`);
                }}
                className="flex-1 bg-[#fb641b] text-white py-[15px] px-2 rounded-sm font-semibold flex items-center justify-center shadow-md active:scale-95 transition-transform text-lg gap-2"
              >
                <Zap fill="white" size={20} /> BUY NOW
              </button>
            </div>

          </div>

          {/* Right Side: Product Info */}
          <div className="w-full md:w-3/5 p-6 pb-20 md:pb-6 text-gray-800 dark:text-gray-200">
            
            {/* Breadcrumbs */}
            <div className="text-xs text-gray-500 mb-2 hover:text-[#2874f0] cursor-pointer inline-block font-medium">
              Home {'>'} {product.category || 'Electronics'} {'>'} {product.name.substring(0, 20)}...
            </div>

            {/* Title */}
            <h1 className="text-lg md:text-xl font-normal text-gray-900 dark:text-gray-100 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[#26a541] text-white text-[12px] px-1.5 py-0.5 rounded-sm flex items-center font-semibold">
                4.4 <Star size={10} fill="white" className="ml-0.5" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                12,504 Ratings & 1,402 Reviews
              </span>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="w-20 ml-2" alt="fassured"/>
            </div>

            {/* Price section */}
            <div className="flex items-end space-x-3 mb-2">
              <span className="text-3xl font-medium text-gray-900 dark:text-gray-100 leading-none">₹{Number(product.price).toLocaleString('en-IN')}</span>
              <span className="text-base text-[#878787] dark:text-gray-500 line-through mb-0.5">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-base font-semibold text-[#388e3c] mb-0.5">{discountPercent}% off</span>
            </div>
            
            <div className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-6 flex items-center gap-1">
               <span>+ ₹69 Secured Packaging Fee</span>
            </div>

            {/* Stock */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <span className="text-base font-medium text-[#26a541]">In Stock ({product.stock} items left)</span>
              ) : (
                <span className="text-base font-medium text-[#ff6161]">Out of Stock</span>
              )}
            </div>

            {/* Offers Section */}
            <div className="mb-6 space-y-2">
               <div className="text-sm font-medium mb-3 dark:text-gray-100">Available offers</div>
               <div className="text-sm flex items-start gap-2">
                  <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" alt="tag"/>
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-gray-100">Bank Offer:</span> 5% Cashback on Flipkart Axis Bank Card <span className="text-[#2874f0] font-medium cursor-pointer">T&C</span></span>
               </div>
               <div className="text-sm flex items-start gap-2">
                  <img src="https://rukminim2.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-0.5" alt="tag"/>
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-semibold text-gray-900 dark:text-gray-100">Special Price:</span> Get extra 18% off (price inclusive of cashback/coupon) <span className="text-[#2874f0] font-medium cursor-pointer">T&C</span></span>
               </div>
            </div>

            {/* Details Table */}
            <div className="border border-[#f0f0f0] dark:border-gray-800 rounded-sm mt-8">
              <div className="border-b border-[#f0f0f0] dark:border-gray-800 p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Specifications</h3>
              </div>
              
              <div className="p-6">
                <div className="text-lg font-medium mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 dark:text-gray-100">General</div>
                <div className="grid grid-cols-3 gap-y-4 text-sm mb-8">
                  <div className="text-[#878787] dark:text-gray-500">Category</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-200 capitalize">{product.category || 'Uncategorized'}</div>
                  <div className="text-[#878787] dark:text-gray-500">Sales Package</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-200">1 unit of {product.name.substring(0, 25)}, User Manual</div>
                  <div className="text-[#878787] dark:text-gray-500">Model Name</div>
                  <div className="col-span-2 text-gray-900 dark:text-gray-200">{product.name}</div>
                </div>

                <div className="text-lg font-medium mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 dark:text-gray-100">Description</div>
                <p className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {product.description || 'Experience premium quality and absolute reliability with this amazing product. Designed with precision to meet all your needs.'}
                </p>
              </div>
            </div>

            {/* Mobile Action Buttons (Sticky Bottom) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 w-full flex bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 transition-colors">
              <button 
                onClick={async () => {
                  try {
                    await api.post('/cart/add', { userId: GUEST_USER_ID, productId: product.id, quantity: 1 });
                    toast.success('Item added to cart!');
                  } catch (e) {
                    toast.error('Failed to add to cart. Database server may be down.');
                  }
                }}
                className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-4 px-2 font-semibold flex items-center justify-center transition-colors"
              >
                <ShoppingCart fill="currentColor" size={18} className="mr-2 text-gray-800 dark:text-gray-200" /> ADD TO CART
              </button>
              <button 
                onClick={() => {
                   router.push(`/checkout?type=buyNow&productId=${product.id}`);
                }}
                className="flex-1 bg-[#fb641b] text-white py-4 px-2 font-semibold flex items-center justify-center"
              >
                <Zap fill="white" size={18} className="mr-2" /> BUY NOW
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
