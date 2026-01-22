import React from 'react';
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../hook/UseAuth";
import UseAxiosSecure from "../../hook/UseAxiosSecure";
import { FaFileInvoiceDollar, FaHistory, FaCalendarAlt, FaHashtag } from "react-icons/fa";

const PaymentHistory = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { isLoading, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`)
            return res.data.data;
        }
    });

    // Loading Skeleton (Better UX than just text)
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto mt-10 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-slate-50 min-h-screen">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        <FaHistory className="text-emerald-600" /> Payment History
                    </h2>
                    <p className="text-slate-500 mt-1">Track all your past transactions securely.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-emerald-100 mt-4 md:mt-0">
                    <span className="text-slate-500 text-sm">Total Transactions</span>
                    <p className="text-2xl font-bold text-emerald-600">{payments.length}</p>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Table Head */}
                            <thead className="bg-emerald-50 text-emerald-800">
                                <tr>
                                    <th className="p-5 text-sm font-semibold uppercase tracking-wider">#</th>
                                    <th className="p-5 text-sm font-semibold uppercase tracking-wider">Transaction ID</th>
                                    <th className="p-5 text-sm font-semibold uppercase tracking-wider">Amount</th>
                                    <th className="p-5 text-sm font-semibold uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarAlt /> Date
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((pay, index) => (
                                    <tr 
                                        key={pay._id} 
                                        className="hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="p-5 text-slate-500 font-medium">
                                            {index + 1}
                                        </td>
                                        
                                        <td className="p-5">
                                            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                                                <FaHashtag className="inline mr-1 text-[10px]"/>
                                                {pay.transactionId}
                                            </span>
                                        </td>

                                        <td className="p-5">
                                            <span className="text-emerald-600 font-bold text-lg">
                                                ${pay.priceTk}
                                            </span>
                                        </td>

                                        <td className="p-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        </td>

                                        <td className="p-5 text-slate-500 text-sm">
                                            {new Date(pay.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Empty State Design
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <FaFileInvoiceDollar className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700">No Payment History</h3>
                        <p className="text-slate-500 mt-2">You haven't made any transactions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;