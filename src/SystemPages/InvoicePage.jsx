import { useParams } from "react-router";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Printer, Download, Pill, CheckCircle2, Calendar, Hash, User, Mail } from "lucide-react";

const InvoicePage = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    
    // 1. Fixed: Initialize with null
    const componentRef = useRef(null);

    const { data: invoice = {}, isLoading } = useQuery({
        queryKey: ["payment", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/${id}`);
            return res.data.data;
        },
    });

    // 2. Fixed: Changed 'content' to 'contentRef' for v3 compatibility
    const handlePrint = useReactToPrint({
        contentRef: componentRef, 
        documentTitle: `PharmaHub-Invoice-${id}`,
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <span className="loading loading-dots loading-lg text-emerald-500"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                {/* --- The Printable Area --- */}
                <div 
                    ref={componentRef} 
                    className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-slate-100 p-8 md:p-16 print:shadow-none print:p-4"
                >
                    {/* Invoice Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-10 mb-10 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                <Pill size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">PharmaHub</h1>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest leading-none">Official Receipt</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-black text-slate-200 uppercase mb-2">Invoice</h2>
                            <div className="flex items-center md:justify-end gap-2 text-slate-500 text-sm font-medium">
                                <Calendar size={14} />
                                <span>{new Date(invoice?.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Billed To</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-slate-800">
                                    <User size={16} className="text-emerald-500" />
                                    <span className="font-bold text-lg">{user?.displayName || "Valued Customer"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Mail size={16} />
                                    <span>{invoice?.finalEmail}</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Payment Info</h3>
                            <div className="space-y-2">
                                <div className="flex items-center md:justify-end gap-2">
                                    <span className="text-sm text-slate-500 font-medium">Status:</span>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={10} /> {invoice?.status || "Success"}
                                    </span>
                                </div>
                                <div className="flex items-center md:justify-end gap-2 text-slate-500 text-sm font-mono">
                                    <Hash size={14} />
                                    <span>TXN: {invoice?.transactionId?.slice(-12).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 mb-10 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-6 py-4">Item Description</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr className="border-b border-slate-50 last:border-0">
                                    <td className="px-6 py-6">
                                        <p className="font-bold text-slate-800">Online Medicine Purchase</p>
                                        <p className="text-xs text-slate-400 mt-1 italic">Payment ID: {invoice?.transactionId}</p>
                                    </td>
                                    <td className="px-6 py-6 text-right font-black text-slate-900 text-lg">
                                        {invoice?.priceTk} ৳
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Card */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-6 space-y-3">
                            <div className="flex justify-between text-slate-500 text-xs font-bold uppercase">
                                <span>Subtotal</span>
                                <span>{invoice?.priceTk} ৳</span>
                            </div>
                            <div className="flex justify-between text-slate-500 text-xs font-bold uppercase">
                                <span>VAT (0%)</span>
                                <span>0.00 ৳</span>
                            </div>
                            <div className="h-[1px] bg-slate-200 w-full" />
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-slate-900 font-black text-sm uppercase">Amount Paid</span>
                                <span className="text-3xl font-black text-emerald-600 leading-none tracking-tighter">
                                    {invoice?.priceTk} ৳
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Branding Footer */}
                    <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] mb-4">Thank you for trusting PharmaHub</p>
                        <div className="flex justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>PharmaHub.com</span>
                            <span>Support@pharmahub.com</span>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons (Fixed on screen) --- */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={handlePrint}
                        className="group flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-[1.2rem] font-bold transition-all transform active:scale-95 shadow-xl shadow-slate-200"
                        disabled={!invoice?.transactionId}
                    >
                        <Printer size={20} className="group-hover:rotate-12 transition-transform" /> 
                        Print Invoice
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-3 px-10 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-[1.2rem] font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Download size={20} /> 
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;