"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package, MapPin, CreditCard, Calendar, Info, ChevronLeft } from "lucide-react";
import api from '@/lib/axios';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center bg-[#f1f3f6] dark:bg-gray-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-sm shadow-sm text-center max-w-md border border-transparent dark:border-gray-800">
          <Info size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">Order not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">The order you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => router.push('/orders')}
            className="bg-[#2874f0] text-white px-8 py-2 rounded-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-gray-950 pt-4 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-20 max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs text-gray-500 mb-4 px-1">
          <Link href="/orders" className="hover:text-[#2874f0] transition-colors flex items-center">
            My Orders
          </Link>
          <ChevronRight size={12} className="mx-2" />
          <span className="text-gray-400 line-clamp-1">Order ID: {order.id}</span>
        </div>

        {/* Header Block */}
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm p-4 mb-4 border border-transparent dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Order ID: <span className="font-medium text-gray-700 dark:text-gray-300 uppercase">{order.id.substring(0, 13)}</span>
              </p>
            </div>
            <div className="flex gap-3">
               <button className="text-[#2874f0] text-sm font-medium border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                 Invoice
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Delivery Address & Stats Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-transparent dark:border-gray-800 overflow-hidden">
               <div className="flex flex-col md:flex-row border-b border-gray-100 dark:border-gray-800">
                  {/* Address Section */}
                  <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <MapPin size={16} className="text-[#2874f0]" /> Delivery Address
                    </h3>
                    <div className="text-[14px]">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{order["customer name"]}</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {order.address}
                      </p>
                      <div className="mt-4">
                        <p className="text-gray-500 font-medium">Phone number</p>
                        <p className="text-gray-800 dark:text-gray-200">{order.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rewards/Payment Section */}
                  <div className="flex-1 p-6">
                    <h3 className="text-sm font-bold uppercase text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <CreditCard size={16} className="text-[#2874f0]" /> Payment Mode
                    </h3>
                    <div className="text-[14px]">
                       <p className="font-bold text-gray-800 dark:text-gray-200 uppercase">{order.paymentMethod}</p>
                       <div className="mt-4">
                         <p className="text-gray-500 font-medium">Payment Status</p>
                         <div className="flex items-center gap-2 mt-1">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {order.paymentStatus}
                           </span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="mt-8">
                       <h3 className="text-sm font-bold uppercase text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                         <Calendar size={16} className="text-[#2874f0]" /> Order Date
                       </h3>
                       <p className="text-sm text-gray-700 dark:text-gray-300">{orderDate}</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Items List Card */}
            <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-transparent dark:border-gray-800">
               <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                 <h3 className="text-sm font-bold uppercase text-gray-900 dark:text-gray-100 flex items-center gap-2">
                   <Package size={16} className="text-[#2874f0]" /> Items in this order ({order["order items"].length})
                 </h3>
               </div>
               
               <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {order["order items"].map((item: any) => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6">
                       {/* Product Image */}
                       <div className="w-[100px] h-[100px] flex-shrink-0 bg-white dark:bg-gray-100/10 p-2 rounded-sm">
                          <img 
                            src={item["product details"]?.images?.[0] || 'https://placehold.co/200?text=No+Image'} 
                            alt={item["product details"]?.name}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                       </div>

                       {/* Product Details */}
                       <div className="flex-1 min-w-0">
                          <Link href={`/product/${item["product details"]?.id}`} className="text-sm font-medium hover:text-[#2874f0] transition-colors dark:text-gray-200">
                            {item["product details"]?.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">Seller: Appario Retail Private Ltd</p>
                          <div className="mt-3 flex items-center gap-4">
                             <div className="text-base font-bold text-gray-900 dark:text-white">₹{Number(item.priceAtPurchase).toLocaleString('en-IN')}</div>
                             <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-sm">Qty: {item.quantity}</div>
                          </div>
                       </div>

                       {/* Tracking Status Simple */}
                       <div className="md:w-1/3 pt-4 md:pt-0">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                             <div className={`w-2 h-2 rounded-full ${order.status === 'DELIVERED' ? 'bg-[#26a541]' : 'bg-[#12b0e8]'}`}></div>
                             {order.status}
                          </div>
                          <p className="text-[12px] text-gray-500 dark:text-gray-400">
                             {order.status === 'DELIVERED' 
                               ? 'Your item has been delivered' 
                               : 'Your item is being processed and will be delivered soon.'}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Price Summary Column */}
          <div className="space-y-4">
             <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-transparent dark:border-gray-800 sticky top-24">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">Price Details</h3>
                </div>
                <div className="p-4 space-y-3">
                   <div className="flex justify-between text-[14px]">
                      <span className="text-gray-800 dark:text-gray-300">Total Item Price</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">₹{Number(order.total).toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-[14px]">
                      <span className="text-gray-800 dark:text-gray-300">Delivery Charges</span>
                      <span className="text-green-600 font-medium">FREE</span>
                   </div>
                   <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-800 flex justify-between">
                      <span className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase">Total Amount</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{Number(order.total).toLocaleString('en-IN')}</span>
                   </div>
                   <div className="pt-2">
                       <p className="text-[12px] text-green-600 font-semibold bg-green-50 dark:bg-green-900/10 p-2 rounded-sm text-center">
                         Yay! You saved some money on this order!
                       </p>
                   </div>
                </div>
             </div>

             {/* Help Card */}
             <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-transparent dark:border-gray-800 p-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center">
                     <Info size={16} className="text-[#2874f0]" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Need help with your order?</p>
                     <p className="text-xs text-[#2874f0] font-medium cursor-pointer mt-0.5">Contact Flipkart Customer Support</p>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center">
           <Link 
             href="/orders" 
             className="flex items-center gap-2 text-[#2874f0] text-sm font-bold uppercase tracking-tight hover:underline"
           >
             <ChevronLeft size={16} /> Back to all orders
           </Link>
        </div>

      </div>
    </div>
  );
}
