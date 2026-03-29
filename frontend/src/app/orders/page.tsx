"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, CheckCircle2 } from "lucide-react";
import api from '@/lib/axios';
const GUEST_USER_ID = '00000000-0000-4000-a000-000000000000';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/orders?userId=${GUEST_USER_ID}`);
      setOrders(data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error.response || error.message);
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

  return (
    <div className="min-h-screen bg-[#f1f3f6] dark:bg-gray-950 pt-4 pb-12 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-20 flex flex-col lg:flex-row gap-4">
        
        {/* Left Sidebar Filters */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm p-4 sticky top-24 border border-transparent dark:border-gray-800">
            <h2 className="text-[16px] font-medium text-[#212121] dark:text-gray-100 mb-3">Filters</h2>
            
            <div className="border-t border-gray-100 dark:border-gray-800 py-4 mt-2">
              <h3 className="text-[13px] font-medium text-[#212121] dark:text-gray-300 mb-3 tracking-wide">ORDER STATUS</h3>
              <div className="space-y-3">
                {['On the way', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-[#2874f0] rounded-[3px] border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-[#2874f0]" />
                    <span className="text-[14px] text-[#212121] dark:text-gray-400 group-hover:text-[#2874f0] transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 py-4">
              <h3 className="text-[13px] font-medium text-[#212121] dark:text-gray-300 mb-3 tracking-wide">ORDER TIME</h3>
              <div className="space-y-3">
                {['Last 30 days', '2023', '2022', 'Older'].map((time) => (
                  <label key={time} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-[#2874f0] rounded-[3px] border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-[#2874f0]" />
                    <span className="text-[14px] text-[#212121] dark:text-gray-400 group-hover:text-[#2874f0] transition-colors">{time}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {/* Search Bar for Orders */}
          <div className="bg-white dark:bg-gray-900 rounded-sm shadow-sm p-2 mb-2 flex items-center border border-gray-200 dark:border-gray-800 focus-within:border-[#2874f0] transition-colors">
            <div className="px-3 flex-1 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search your orders here" 
                className="w-full text-[14px] px-2 py-1.5 outline-none bg-transparent text-[#212121] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
            <button className="bg-[#2874f0] text-white px-6 py-2 rounded-sm text-[14px] font-medium hover:bg-[#2874f0]/95 transition-colors flex items-center gap-2">
              <Search size={16} /> <span className="hidden sm:inline">Search Orders</span>
            </button>
            <button className="lg:hidden ml-2 px-3 py-2 text-gray-600 dark:text-gray-400 flex items-center gap-1 border border-gray-200 dark:border-gray-800 rounded-sm">
               <Filter size={16} /> <span className="hidden xs:inline">Filters</span>
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-2">
            {orders.length === 0 ? (
              <div className="bg-white p-10 flex flex-col items-center justify-center rounded-sm shadow-sm min-h-[400px]">
                <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="empty orders" className="w-[180px] h-auto mb-6 opacity-90" />
                <h3 className="text-[18px] font-medium text-[#212121] mb-2">You have no orders</h3>
                <p className="text-[14px] text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
                <Link href="/" className="bg-[#2874f0] text-white px-8 py-3 rounded-sm text-[14px] font-medium shadow-sm hover:shadow-md transition-all">
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order: any) => (
                <div key={order.id} className="bg-white dark:bg-gray-900 rounded-sm shadow-sm hover:shadow-md transition-shadow group overflow-hidden border border-gray-100/50 dark:border-gray-800">
                  
                  {/* Order Top Strip (Mobile visibility / Desktop subtle) */}
                  <div className="bg-[#f0f5ff]/30 dark:bg-blue-900/10 px-4 py-2.5 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[12px] font-medium text-gray-500 tracking-wider flex items-center gap-1">
                      ORDER ID: <span className="text-[#212121] dark:text-gray-300 font-bold">#{order.id.split('-')[0].toUpperCase()}</span>
                    </span>
                    <span className="text-[12px] font-medium text-gray-500 flex items-center gap-1">
                      Ordered on <span className="text-[#212121] dark:text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </span>
                  </div>

                  {/* Order Items */}
                  {order.OrderItems?.map((item: any, idx: number) => {
                    const isProductAvailable = !!item.Product;
                    const content = (
                      <div className={`flex flex-col md:flex-row p-4 gap-6 transition-colors ${idx !== order.OrderItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} ${isProductAvailable ? 'cursor-pointer hover:bg-blue-50/20 dark:hover:bg-blue-900/10' : 'cursor-default opacity-80'}`}>
                        {/* Image */}
                        <div className="w-[80px] h-[80px] flex-shrink-0 relative mx-auto md:mx-0 bg-white dark:bg-gray-100/10 p-1 rounded-sm">
                          <Image
                            src={item.Product?.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"}
                            alt={item.Product?.name || 'Product Image'}
                            fill
                            className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal"
                            sizes="80px"
                          />
                        </div>

                        {/* Title & Details Column */}
                        <div className="flex-1 md:pr-10 text-center md:text-left mt-2 md:mt-0">
                          <h3 className={`text-[14px] font-medium text-[#212121] dark:text-gray-100 transition-colors leading-relaxed line-clamp-2 pr-4 ${isProductAvailable ? 'group-hover:text-[#2874f0]' : ''}`}>
                            {item.Product?.name || 'Product No Longer Available'}
                          </h3>
                          <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-[12px] text-gray-500 dark:text-gray-400">
                            <span>Color: Standard</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                            <span>Qty: <b>{item.quantity}</b></span>
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="w-full md:w-[120px] flex-shrink-0 text-center md:text-left mt-2 md:mt-0">
                          <span className="text-[14px] font-bold text-[#212121] dark:text-gray-100">₹{Number(item.priceAtPurchase).toLocaleString('en-IN')}</span>
                        </div>

                        {/* Status Tracking Column */}
                        <div className="w-full md:w-[350px] flex-shrink-0 mt-3 md:mt-0 border-t border-gray-100 dark:border-gray-800 md:border-none pt-3 md:pt-0">
                          <div className="mb-4 text-center md:text-left">
                            <h4 className="text-[14px] font-bold text-[#212121] dark:text-gray-100">
                              {order.orderStatus === 'DELIVERED' 
                                ? 'Delivered on ' + new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) 
                                : 'Arriving by ' + new Date(new Date(order.createdAt).getTime() + 4*24*60*60*1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </h4>
                            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                              Your item has been {order.orderStatus === 'CONFIRMED' ? 'placed' : order.orderStatus.toLowerCase()}.
                            </p>
                          </div>

                          {/* Flipkart Timeline UI */}
                          <div className="relative w-full max-w-[280px] mx-auto md:mx-0 px-2">
                            {(() => {
                              const steps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
                              let currentIndex = 1;
                              if (order.orderStatus === 'SHIPPED') currentIndex = 3;
                              if (order.orderStatus === 'DELIVERED') currentIndex = 4;
                              if (order.orderStatus === 'CONFIRMED' && (new Date().getTime() - new Date(order.createdAt).getTime() > 600000)) currentIndex = 2;

                              return (
                                <div className="flex justify-between items-center relative pb-6">
                                  <div className="absolute top-2 left-0 w-full h-[3px] bg-gray-200 z-0"></div>
                                  <div 
                                    className="absolute top-2 left-0 h-[3px] bg-[#26a541] z-0 transition-all duration-700 ease-in-out"
                                    style={{ width: `${((currentIndex - 1) / (steps.length - 1)) * 100}%` }}
                                  ></div>
                                  {steps.map((step, index) => {
                                    const isCompleted = currentIndex >= index + 1;
                                    const isCurrent = currentIndex === index + 1;
                                    return (
                                      <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm ${isCompleted ? 'bg-[#26a541]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                          {isCompleted && <div className="w-[6px] h-[6px] bg-white rounded-full"></div>}
                                        </div>
                                        <span className={`absolute top-6 text-[11px] font-medium whitespace-nowrap transition-colors duration-500 ${isCompleted ? (isCurrent ? 'text-[#212121] dark:text-gray-100 font-bold' : 'text-[#26a541]') : 'text-gray-400 dark:text-gray-600'}`}>
                                          {step}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    );

                    return isProductAvailable ? (
                      <Link href={`/orders/${order.id}`} key={item.id} className="block">
                        {content}
                      </Link>
                    ) : (
                      <div key={item.id} className="block">
                        {content}
                      </div>
                    );
                  })}
                  
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
