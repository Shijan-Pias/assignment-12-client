import React from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import UseAuth from "../../../hook/UseAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Wallet, CheckCircle } from "lucide-react";

const CartPage = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const queryClient = useQueryClient();

    // 1. Fetch current cart items
    const { data: cartItems = [], isLoading } = useQuery({
        queryKey: ["carts", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?userEmail=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // 2. Fetch all successful payments for this user (To show total spent)
    const { data: paymentHistory = [] } = useQuery({
        queryKey: ["payments-history", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data.data; // Accessing the data array from your backend response
        },
        enabled: !!user?.email
    });

    const updateQuantity = useMutation({
        mutationFn: ({ id, quantity }) =>
            axiosSecure.patch(`/carts/${id}`, { quantity }),
        onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    });

    const removeItem = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/carts/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    });

    // const clearCart = useMutation({
    //     mutationFn: () => axiosSecure.delete(`/carts/user/${user.email}`),
    //     onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    // });

    // const pendingItems = cartItems.filter(item => item.status === "pending");
    
    // Total Spent Calculation (Historical data)
    const totalSpent = paymentHistory.reduce((acc, curr) => acc + parseFloat(curr.priceTk || 0), 0);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-dots loading-lg text-emerald-500"></span></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ShoppingBag className="text-emerald-500" /> My Shopping Cart
                        </h1>
                        <p className="text-slate-500 mt-1">Manage your prescriptions and payments</p>
                    </div>
                    
                    {/* --- TOTAL SPENT CARD --- */}
                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Spent</p>
                            <p className="text-2xl font-black text-slate-900">{totalSpent.toFixed(2)}৳</p>
                        </div>
                    </div>
                </header>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
                        <Link to="/shop" className="btn btn-primary bg-emerald-500 border-none mt-6">Browse Pharmacy</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className={`bg-white p-6 rounded-[1.5rem] shadow-sm border ${item.status === 'paid' ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100'} flex flex-col md:flex-row items-center gap-6 transition-all`}>
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${item.status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {item.status === 'paid' ? <CheckCircle size={28} /> : item.itemName.charAt(0)}
                                    </div>
                                    
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="font-bold text-lg text-slate-800">{item.itemName}</h3>
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.company}</p>
                                    </div>

                                    {item.status !== 'paid' && (
                                        <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                            <button 
                                                disabled={item.quantity <= 1}
                                                onClick={() => updateQuantity.mutate({ id: item._id, quantity: item.quantity - 1 })}
                                                className="p-2 bg-red-400 text-black rounded-lg transition-colors disabled:opacity-30"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-slate-700 ">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity.mutate({ id: item._id, quantity: item.quantity + 1 })}
                                                className="p-2 bg-amber-400 text-black rounded-lg transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-right min-w-[100px]">
                                        <p className="text-xs text-slate-400 font-bold mb-1">Total Price</p>
                                        <p className="font-black text-xl text-slate-900">{(item.price * item.quantity).toFixed(2)}৳</p>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-3">
                                        {item.status === 'paid' ? (
                                            <span className="px-6 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm">
                                                Transaction Successful
                                            </span>
                                        ) : (
                                            <>
                                                <Link to={`/dashBoard/payment/${item._id}`}>
                                                    <button className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-lg text-sm flex items-center gap-2">
                                                        <CreditCard size={16} /> Pay Now
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => removeItem.mutate(item._id)}
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;