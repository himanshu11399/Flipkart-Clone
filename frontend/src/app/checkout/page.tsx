'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronRight, User, Phone, MapPin } from 'lucide-react';
import { getProductById } from '@/lib/services/productService';
const GUEST_USER_ID = '00000000-0000-4000-a000-000000000000';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  
  const isBuyNow = searchParams.get('type') === 'buyNow';
  const buyNowProductId = searchParams.get('productId');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        if (isBuyNow && buyNowProductId) {
          // Buy Now Flow: Fetch specific product
          const product = await getProductById(buyNowProductId);
          setCartItems([{ 
            id: 'buynow-' + buyNowProductId,
            quantity: 1, 
            Product: product 
          }]);
        } else {
          // Standard Flow: Fetch Cart
          const response = await api.get('/cart', {
             headers: { 'x-user-id': GUEST_USER_ID }
          });
          if (response.data.success && response.data.data.CartItems) {
            setCartItems(response.data.data.CartItems);
          }
        }
      } catch (error) {
        console.error('Failed to load checkout data', error);
        toast.error('Failed to load checkout items.');
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutData();
  }, [isBuyNow, buyNowProductId]);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.Product.price) * item.quantity), 0);
  const discount = Math.round(totalAmount * 0.15);
  const finalAmount = totalAmount - discount;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
       toast.error('Cart is empty');
       return;
    }
    
    const loadingToast = toast.loading('Placing your order...');
    try {
      const orderPayload: any = {
        userId: GUEST_USER_ID,
        ...formData,
        paymentMethod: 'COD'
      };

      // If Buy Now, send items explicitly
      if (isBuyNow && buyNowProductId) {
        orderPayload.items = [{ productId: buyNowProductId, quantity: 1 }];
      }

      const response = await api.post('/orders', orderPayload);
      if (response.data.success) {
         toast.success('Order placed successfully!', { id: loadingToast });
         router.push(`/order-confirmation?orderId=${response.data.data.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order.', { id: loadingToast });
    }
  };

  if (loading) return (
      <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-8 flex justify-center items-start transition-colors duration-300">
        <div className="w-full max-w-5xl flex gap-6 animate-pulse px-4">
           <div className="w-full lg:w-2/3 h-96 bg-white dark:bg-gray-900 rounded-sm shadow-sm p-6 border border-transparent dark:border-gray-800">
              <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-800 mb-8 rounded-sm"></div>
              <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 mb-4 rounded-sm"></div>
              <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 mb-4 rounded-sm"></div>
              <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
           </div>
           <div className="hidden lg:block w-1/3 h-64 bg-white dark:bg-gray-900 rounded-sm shadow-sm p-6 border border-transparent dark:border-gray-800">
              <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-800 mb-6 rounded-sm"></div>
              <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 mb-4 rounded-sm"></div>
              <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
           </div>
        </div>
      </div>
  );

  if (cartItems.length === 0) return <div className="p-20 text-center text-lg font-medium text-gray-700 dark:text-gray-300 bg-[#f1f3f6] dark:bg-gray-950 min-h-screen transition-colors duration-300">Cart is empty. Please add items before checking out.</div>;

  return (
    <div className="bg-[#f1f3f6] dark:bg-gray-950 min-h-screen py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          
          <div className="w-full lg:w-2/3 space-y-4">
            
            {/* Step 1: Delivery Address */}
            <div className={`bg-white dark:bg-gray-900 shadow-sm rounded-sm overflow-hidden border border-transparent dark:border-gray-800 ${currentStep !== 1 ? 'opacity-90' : ''}`}>
              <div className={`p-4 flex items-center justify-between ${currentStep === 1 ? 'bg-[#2874f0] text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b dark:border-gray-800'}`}>
                <div className="flex items-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm mr-4 ${currentStep === 1 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 dark:bg-gray-800 text-[#2874f0]'}`}>
                    1
                  </span>
                  <span className="font-medium uppercase">Delivery Address</span>
                  {currentStep > 1 && <CheckCircle2 size={16} className="ml-3 text-[#2874f0]" />}
                </div>
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    className="text-[#2874f0] text-sm font-medium border border-gray-200 dark:border-gray-700 px-4 py-1.5 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 uppercase tracking-tight"
                  >
                    Change
                  </button>
                )}
              </div>

              {currentStep === 1 ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.fullName}
                        className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-sm p-3 focus:border-[#2874f0] focus:outline-none text-sm text-gray-800 dark:text-gray-100" 
                        onChange={e => setFormData({...formData, fullName: e.target.value})} 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-sm p-3 focus:border-[#2874f0] focus:outline-none text-sm text-gray-800 dark:text-gray-100" 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Address</label>
                    <textarea 
                      rows={4} 
                      value={formData.address}
                      className="w-full border border-gray-300 dark:border-gray-700 bg-transparent rounded-sm p-3 focus:border-[#2874f0] focus:outline-none text-sm text-gray-800 dark:text-gray-100" 
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Flat, House no., Building, Company, Apartment"
                    ></textarea>
                  </div>
                  <button 
                    onClick={() => {
                        if (!formData.fullName || !formData.phone || !formData.address) {
                            toast.error('Please fill in all address fields');
                            return;
                        }
                        setCurrentStep(2);
                    }}
                    className="bg-[#fb641b] text-white px-10 py-3.5 rounded-sm font-semibold shadow-sm hover:bg-[#f25e16] uppercase mt-4 w-full md:w-auto"
                  >
                    Deliver Here
                  </button>
                </div>
              ) : (
                <div className="p-4 px-12 text-sm text-gray-800 dark:text-gray-200">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-bold">{formData.fullName}</span>
                    <span className="text-gray-500 dark:text-gray-400">{formData.phone}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{formData.address}</p>
                </div>
              )}
            </div>

            {/* Step 2: Order Summary */}
            <div className={`bg-white dark:bg-gray-900 shadow-sm rounded-sm overflow-hidden border border-transparent dark:border-gray-800 ${currentStep < 2 ? 'pointer-events-none' : ''}`}>
              <div className={`p-4 flex items-center justify-between ${currentStep === 2 ? 'bg-[#2874f0] text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b dark:border-gray-800'}`}>
                <div className="flex items-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm mr-4 ${currentStep === 2 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 dark:bg-gray-800 text-[#2874f0]'}`}>
                    2
                  </span>
                  <span className="font-medium uppercase">Order Summary</span>
                  {currentStep > 2 && <CheckCircle2 size={16} className="ml-3 text-[#2874f0]" />}
                </div>
              </div>

              {currentStep === 2 && (
                <div className="p-0">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 border-b border-gray-100 dark:border-gray-800 flex gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className="w-20 h-20 shrink-0 bg-white dark:bg-gray-100/10 p-1 rounded-sm">
                        <img 
                          src={item.Product.images?.[0] || 'https://placehold.co/200?text=No+Image'} 
                          alt={item.Product.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">{item.Product.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quantity: {item.quantity}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-gray-900 dark:text-white">₹{Number(item.Product.price).toLocaleString('en-IN')}</span>
                          <span className="text-[#388e3c] text-xs font-semibold">1 Offer Applied</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Order confirmation email will be sent to your registered email.</p>
                    <button 
                        onClick={() => setCurrentStep(3)}
                        className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-semibold shadow-sm hover:bg-[#f25e16] uppercase"
                    >
                        Continue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Options */}
            <div className={`bg-white dark:bg-gray-900 shadow-sm rounded-sm overflow-hidden border border-transparent dark:border-gray-800 ${currentStep < 3 ? 'pointer-events-none' : ''}`}>
              <div className={`p-4 flex items-center ${currentStep === 3 ? 'bg-[#2874f0] text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b dark:border-gray-800'}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-sm mr-4 ${currentStep === 3 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 dark:bg-gray-800 text-[#2874f0]'}`}>
                  3
                </span>
                <span className="font-medium uppercase">Payment Options</span>
              </div>

              {currentStep === 3 && (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border rounded-sm cursor-pointer transition-colors border-[#2874f0] bg-blue-50/30 dark:bg-blue-900/10">
                      <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-[#2874f0] mr-4" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cash on Delivery</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Includes Secured Packaging Fee of ₹69</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border rounded-sm cursor-not-allowed opacity-60 dark:border-gray-800">
                      <input type="radio" name="payment" disabled className="w-4 h-4 text-gray-300 dark:text-gray-700 mr-4" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-400 dark:text-gray-600">Credit / Debit / ATM Card</p>
                        <p className="text-xs text-red-500 font-medium">Currently Unavailable</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                        onClick={handlePlaceOrder}
                        className="bg-[#fb641b] text-white px-12 py-4 rounded-sm font-bold shadow-lg hover:bg-[#f25e16] uppercase text-lg w-full md:w-auto transition-all active:scale-95"
                    >
                        Confirm & Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Summary Box */}
          <div className="w-full lg:w-1/3">
             <div className="bg-white dark:bg-gray-900 shadow-sm rounded-sm sticky top-24 border border-transparent dark:border-gray-800">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Price Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Price ({cartItems.length} items)</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Discount</span>
                  <span className="text-[#388e3c] font-medium">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-800 dark:text-gray-300">Delivery Charges</span>
                  <span className="text-[#388e3c] font-medium">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-4 mt-2 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total Payable</span>
                  <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-4">
                    <div className="flex items-center gap-2 text-[#388e3c] font-bold text-sm bg-green-50 dark:bg-green-900/10 p-2 rounded-sm border border-green-100 dark:border-green-800/30">
                        <CheckCircle2 size={16} />
                        You will save ₹{discount.toLocaleString('en-IN')} on this order
                    </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

