'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Minus, Plus } from 'lucide-react';

const GUEST_USER_ID = '00000000-0000-4000-a000-000000000000';

interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
}

interface CartItem {
  id: string;
  quantity: number;
  Product: Product;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await api.get(`/cart`, {
        headers: { 'x-user-id': GUEST_USER_ID }
      });
      if (response.data.success && response.data.data.CartItems) {
        setCartItems(response.data.data.CartItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
      
      await api.put('/cart/update', {
        cartItemId,
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Failed to update quantity', error);
      fetchCart();
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      await api.delete('/cart/remove', {
        data: { cartItemId }
      });
    } catch (error) {
      console.error('Failed to remove item', error);
      fetchCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
        return total + (Number(item.Product.price) * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-7xl animate-pulse">
           <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 p-6 rounded-sm shadow-sm space-y-6 border border-transparent dark:border-gray-800">
                 {[1,2].map(n => (
                   <div key={n} className="flex gap-6">
                     <div className="w-1/4 h-28 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                     <div className="flex-1 space-y-4">
                        <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                        <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="hidden lg:block w-1/3 h-64 bg-white dark:bg-gray-900 rounded-sm shadow-sm p-6 border border-transparent dark:border-gray-800">
                 <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-800 rounded-sm mb-8"></div>
                 <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-sm mb-4"></div>
                 <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-sm mb-4"></div>
                 <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded-sm mt-8"></div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  const totalAmount = calculateTotal();
  const discount = Math.round(totalAmount * 0.15); 
  const finalAmount = totalAmount - discount;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 bg-[#f1f3f6] dark:bg-gray-950 min-h-screen transition-colors duration-300">
        <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 shadow-sm flex flex-col items-center justify-center py-16 min-h-[50vh] rounded-sm">
          <img 
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" 
            alt="Empty Cart" 
            className="w-56 mb-6 opacity-90"
          />
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add items to it now.</p>
          <Link href="/" className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-medium shadow-sm hover:bg-blue-600 transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-sm mb-4 border border-transparent dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Flipkart ({cartItems.length})
                </h1>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
                  <div className="flex flex-col items-center gap-4 w-full sm:w-1/4 shrink-0">
                    <Link href={`/product/${item.Product.id}`} className="h-28 flex items-center justify-center p-2 bg-white dark:bg-gray-100/10 rounded-sm">
                      <img 
                        src={item.Product.images?.[0] || 'https://placehold.co/200?text=No+Image'} 
                        alt={item.Product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-2">
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         disabled={item.quantity <= 1}
                         className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                       >
                         <Minus size={14} />
                       </button>
                       <div className="w-10 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-sm text-sm font-medium text-gray-900 dark:text-gray-100">
                         {item.quantity}
                       </div>
                       <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                       >
                         <Plus size={14} />
                       </button>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <Link href={`/product/${item.Product.id}`} className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#2874f0] line-clamp-2 mb-2 transition-colors">
                      {item.Product.name}
                    </Link>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Seller: SuperComNet | <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="w-12 inline ml-1" alt="fassured"/></div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm text-gray-500 dark:text-gray-500 line-through">₹{Math.round(Number(item.Product.price) * 1.15).toLocaleString('en-IN')}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">₹{Number(item.Product.price).toLocaleString('en-IN')}</span>
                      <span className="text-sm font-semibold text-[#388e3c]">15% Off</span>
                    </div>

                    <div className="flex gap-6 mt-auto">
                      <button className="text-base font-medium text-gray-900 dark:text-gray-300 hover:text-[#2874f0] dark:hover:text-[#2874f0] transition-colors uppercase">
                        Save for later
                      </button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-base font-medium text-gray-900 dark:text-gray-300 hover:text-[#2874f0] dark:hover:text-[#2874f0] transition-colors uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-white dark:bg-gray-900 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] sticky bottom-0 flex justify-end z-10 border-t border-gray-100 dark:border-gray-800">
                <Link href="/checkout" className="bg-[#fb641b] text-white px-10 py-3.5 rounded-sm font-medium text-base shadow-sm hover:bg-[#f25e16] transition-colors">
                  PLACE ORDER
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-900 shadow-sm rounded-sm sticky top-24 border border-transparent dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base font-medium text-gray-500 dark:text-gray-400 uppercase">Price Details</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Price ({cartItems.length} items)</span>
                  <span className="text-gray-900 dark:text-gray-100">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                 <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Discount</span>
                  <span className="text-[#388e3c] font-medium">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Delivery Charges</span>
                  <span className="text-[#388e3c] font-medium">Free</span>
                </div>

                <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-4 mt-2 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <p className="text-[#388e3c] font-medium text-base">
                    You will save ₹{discount.toLocaleString('en-IN')} on this order
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
