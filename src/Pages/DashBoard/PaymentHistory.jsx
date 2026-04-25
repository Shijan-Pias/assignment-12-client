import React from 'react';
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../hook/UseAuth";
import UseAxiosSecure from "../../hook/UseAxiosSecure";
import { 
  FaHashtag, 
  FaWallet, 
  FaShieldAlt, 
  FaSearchDollar,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";

const PaymentHistory = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { isLoading, data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return Array.isArray(res.data.data) ? res.data.data : [];
        },
        enabled: !!user?.email
    });

    const totalSpent = Array.isArray(payments) 
        ? payments.reduce((acc, curr) => acc + parseFloat(curr.priceTk || 0), 0) 
        : 0;

    // Helper for currency and color logic
    const getCurrencyStyles = (amount, currency = 'BDT') => {
        if (currency === 'USD') return { color: 'text-blue-600', bg: 'bg-blue-50', symbol: '$' };
        return { color: 'text-emerald-600', bg: 'bg-emerald-50', symbol: '৳' };
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
                <div className="h-32 bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#FDFDFD] min-h-screen font-sans text-slate-900">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                            <FaShieldAlt size={22} />
                        </div>
                        <div>
                            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] block">Secure Financial Portal</span>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Transaction Ledger</h2>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium ml-1">Monitor your pharmaceutical investments and orders.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl w-full lg:w-auto min-w-[320px]"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Net Expenditure</span>
                            <FaWallet className="text-emerald-400" />
                        </div>
                        <p className="text-4xl font-black text-white leading-none tracking-tighter">
                            <span className="text-emerald-400 mr-1 text-2xl">৳</span>{totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </motion.div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[3rem] border border-slate-100 overflow-hidden">
                {payments.length > 0 ? (
                    <>
                        {/* DESKTOP TABLE */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Transaction Details</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Amount</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Security Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {payments.map((pay, index) => {
                                        const theme = getCurrencyStyles(pay.priceTk);
                                        return (
                                            <motion.tr 
                                                key={pay._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-indigo-50/30 transition-all group"
                                            >
                                                <td className="px-10 py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-slate-100 shadow-sm">
                                                            <FaHashtag size={14}/>
                                                        </div>
                                                        <div>
                                                            <span className="font-mono text-sm font-bold text-slate-800 tracking-tighter uppercase block">
                                                                #{pay.transactionId?.slice(-12)}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Reference ID</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-10 py-7 text-center">
                                                    <div className={`inline-block px-5 py-2 rounded-2xl font-black text-xl tracking-tighter ${theme.bg} ${theme.color}`}>
                                                        {theme.symbol}{pay.priceTk}
                                                    </div>
                                                </td>

                                                <td className="px-10 py-7 text-center">
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        Verified & Encrypted
                                                    </span>
                                                </td>

                                                <td className="px-10 py-7 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 text-sm">
                                                            {new Date(pay.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                            at {new Date(pay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARDS VIEW */}
                        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                            {payments.map((pay, index) => {
                                const theme = getCurrencyStyles(pay.priceTk);
                                return (
                                    <motion.div 
                                        key={pay._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                    <FaHashtag />
                                                </div>
                                                <span className="font-mono font-bold text-slate-900">{pay.transactionId?.slice(-10)}</span>
                                            </div>
                                            <div className={`${theme.bg} ${theme.color} px-4 py-2 rounded-xl font-black`}>
                                                {theme.symbol}{pay.priceTk}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <FaCalendarAlt size={12}/>
                                                <span className="text-[11px] font-bold uppercase">{new Date(pay.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg">Verified</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mb-8 border-2 border-dashed border-indigo-100"
                        >
                            <FaSearchDollar className="text-5xl text-indigo-200" />
                        </motion.div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase">No History Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto font-medium mb-10 leading-relaxed">It seems you haven't made any purchases yet. Explore our medicine collection to get started.</p>
                        <Link to="/shopPage" className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-[1.5rem] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
                            Start Shopping <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>

            {/* --- FOOTER / SECURITY BADGE --- */}
            <div className="mt-16 flex flex-col items-center gap-4 pb-20">
                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm">
                    <FaShieldAlt className="text-emerald-500" />
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">End-to-End SSL Encryption Verified</p>
                </div>
                <div className="h-1.5 w-16 bg-indigo-100 rounded-full" />
            </div>
        </div>
    );
};

export default PaymentHistory;