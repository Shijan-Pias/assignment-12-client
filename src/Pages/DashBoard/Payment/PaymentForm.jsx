import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ArrowLeft, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';
import UseAuth from '../../../hook/UseAuth';

const PaymentForm = ({ cartItem, priceTk }) => {
    // ✅ Functional Stripe Hooks
    const stripe = useStripe();
    const elements = useElements();
    
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const navigate = useNavigate();

    const amountCents = Math.round(priceTk * 100);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card == null) return;

        setProcessing(true);
        setError('');

        // 1. Create Payment Method
        const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: {
                name: user?.displayName || 'Anonymous',
                email: user?.email || 'unknown',
            },
        });

        if (methodError) {
            setError(methodError.message);
            setProcessing(false);
            return;
        }

        try {
            // 2. Get Client Secret from Backend
            const res = await axiosSecure.post('/create-payment-intent', { amountCents });
            const clientSecret = res.data.clientSecret;

            // 3. Confirm the Payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
            } else if (paymentIntent.status === "succeeded") {
                
                // 4. Save Payment to Database
                const paymentData = {
                    cartId: cartItem._id, 
                    userEmail: user.email,
                    sellerEmail: cartItem.sellerEmail, 
                    priceTk,
                    transactionId: paymentIntent.id,
                    status: "success",
                    paidAt: new Date()
                };

                const paymentRes = await axiosSecure.post('/payments', paymentData);
                
                if (paymentRes.data.insertedId) {
                    Swal.fire({
                        title: "Secure Payment Verified",
                        text: `Transaction ID: ${paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: "#10b981",
                        customClass: { popup: 'rounded-[2rem]' }
                    }).then(() => {
                        navigate(`/dashboard/paymentHistory`);
                    });
                }
            }
        } catch (err) {
            setError("Bank server unreachable. Please try again.");
            setProcessing(false);
        }
    };

    const cardOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1e293b',
                '::placeholder': { color: '#94a3b8' },
            },
            invalid: { color: '#ef4444' },
        },
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                
                {/* --- LEFT: SIDEBAR SUMMARY --- */}
                <div className="w-full lg:w-[420px] bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between">
                    <div>
                        <Link to="/myCart" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm font-bold mb-12">
                            <ArrowLeft size={16} /> Back
                        </Link>
                        
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                            Verified Pharmacy
                        </div>
                        
                        <h2 className="text-3xl font-black mb-8 leading-tight">Billing<br/>Summary</h2>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Prescription Item</span>
                                <span className="font-bold">{cartItem?.itemName}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Quantity</span>
                                <span className="font-bold">x{cartItem?.quantity || 1}</span>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-xs font-black uppercase">Total Due</span>
                                <span className="text-4xl font-black text-emerald-400 tracking-tighter">৳{priceTk}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
                            <p className="text-[10px] text-slate-400 uppercase font-bold leading-relaxed tracking-tight">
                                Secured by Stripe 256-bit encryption. No card details are stored on our servers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: STRIPE INTERFACE --- */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <header className="mb-10">
                            <h3 className="text-2xl font-black text-slate-900">Credit Card</h3>
                            <p className="text-slate-500 text-sm">Please enter your payment details below.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Card Entry</label>
                                <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] transition-all focus-within:border-emerald-500 focus-within:bg-white shadow-inner">
                                    <CardElement options={cardOptions} />
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-tight">
                                    <ShieldAlert size={14} /> {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={!stripe || processing}
                                className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3 ${
                                    processing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200'
                                }`}
                            >
                                {processing ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <>
                                        <Lock size={16} /> Pay ৳{priceTk} Securely
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-12 flex justify-between items-center opacity-30 grayscale px-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;