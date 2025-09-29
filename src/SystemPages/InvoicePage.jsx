// import { useParams } from "react-router";
// import { useQuery } from "@tanstack/react-query";
// import UseAxiosSecure from "../../../hook/UseAxiosSecure";
// import UseAuth from "../../../hook/UseAuth";
// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

import { useParams } from "react-router";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const InvoicePage = () => {
    const { id } = useParams(); // paymentId
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const componentRef = useRef();

    // Fetch invoice data
    const { data: invoice = {}, isLoading } = useQuery({
        queryKey: ["payment", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/${id}`);
            return res.data.data;
        },
    });
    console.log(invoice);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice-${id}`,
        onBeforeGetContent: () => {
            if (!componentRef.current) {
                console.warn("Nothing to print yet");
            }
        },
    });

    if (isLoading) return <p>Loading invoice...</p>;

    return (
        <div className="p-8">
            <div ref={componentRef}>
                {isLoading ? (
                    <p>Loading invoice...</p>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h1 className="text-2xl font-bold">💊 Medicine E-Commerce</h1>
                            <span className="text-gray-500">Invoice</span>
                        </div>

                        <div className="mb-6">
                            <p><strong>User:</strong> {user?.displayName}</p>
                            <p><strong>Email:</strong> {invoice?.finalEmail}</p>
                            <p><strong>Date:</strong> {new Date(invoice?.Paid_at_string).toLocaleDateString()}</p>
                        </div>

                        <table className="table-auto w-full border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Transaction ID</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="px-4 py-2">{invoice?.transactionId}</td>
                                    <td className="px-4 py-2">{invoice?.priceTk} ৳</td>
                                    <td className="px-4 py-2 text-green-600 font-semibold">{invoice?.status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={handlePrint}
                    className="btn btn-primary"
                    disabled={isLoading || !invoice.transactionId}
                >
                    Print / Download PDF
                </button>
            </div>
        </div>

    );
};

export default InvoicePage;
