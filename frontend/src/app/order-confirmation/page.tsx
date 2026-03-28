'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrderData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Success Header */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-sm text-center border-t-[6px] border-[#26a541] border-x-transparent border-b-transparent dark:border-x-gray-800 dark:border-b-gray-800">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/10 text-[#26a541] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Your order has been confirmed and we're getting it ready.</p>
          
          {orderId && (
            <div className="inline-block bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-sm text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-2">Order ID:</span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{orderId}</span>
            </div>
          )}
        </div>

        {/* Order Details & Items */}
        {orderData && orderData.OrderItems && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-sm relative border border-transparent dark:border-gray-800">
             {/* Shipping Specifics placed elegantly at top corner or inline */}
            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:justify-between items-start gap-4">
               <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Delivery Address</h2>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize">{orderData.fullName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-sm">{orderData.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Phone: <span className="font-medium text-gray-800 dark:text-gray-200">{orderData.phone}</span></p>
               </div>
               <div className="bg-[#f0f9f4] dark:bg-green-900/10 text-[#26a541] px-4 py-2 rounded-sm border border-[#d6eedc] dark:border-green-800/20">
                 <span className="text-sm font-semibold uppercase tracking-wide">Status: Paid & Confirmed</span>
               </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Items in your Order</h2>
            
            <div className="space-y-4">
              {orderData.OrderItems.map((item: any) => (
                <div key={item.id} className="flex gap-4 border border-gray-100 dark:border-gray-800 p-4 rounded-sm hover:shadow-xs transition-shadow bg-white dark:bg-gray-900">
                  <div className="w-20 h-20 flex-shrink-0 p-1 flex items-center justify-center bg-white dark:bg-gray-100/10 rounded-sm">
                    <img 
                      src={item.Product?.images?.[0] || 'https://placehold.co/100'} 
                      alt={item.Product?.name} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-grow">
                    <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.Product?.name || 'Product Details Unavailable'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Qty: <span className="font-bold text-gray-700 dark:text-gray-300">{item.quantity}</span></p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">₹{Number(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

             {/* Order Total Information */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-800">
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                <span>Total Amount Paid</span>
                <span>₹{Number(orderData.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping CTA */}
        <div className="pt-4 text-center">
          <Link href="/" className="bg-[#2874f0] text-white px-10 py-3.5 rounded-sm font-semibold hover:bg-blue-600 transition-colors inline-block shadow-sm">
            CONTINUE SHOPPING
          </Link>
        </div>

      </div>
    </div>
  );
}
