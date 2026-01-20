import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';
import UseAuth from '../../../hook/UseAuth';

const MyPrescriptions = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: prescriptions = [] } = useQuery({
        queryKey: ['my-prescriptions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/prescriptions/user/${user.email}`);
            return res.data;
        }
    });

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">My Prescriptions</h2>
            
            <div className="grid grid-cols-1 gap-4">
                {prescriptions.map(pres => (
                    <div key={pres._id} className="card bg-base-100 shadow-xl border">
                        <div className="card-body flex-row items-center gap-6">
                            <img src={pres.image} alt="Rx" className="w-20 h-20 object-cover rounded-lg border" />
                            
                            <div className="flex-1">
                                <h3 className="font-bold">Prescription Date: {new Date(pres.createdAt).toDateString()}</h3>
                                <p className="text-sm mt-1">
                                    Status: 
                                    <span className={`ml-2 badge ${pres.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                                        {pres.status}
                                    </span>
                                </p>
                                
                                {/* যদি কনফার্ম হয়, তবে ঔষধের লিস্ট দেখাবে */}
                                {pres.status === 'confirmed' && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p className="font-bold">Medicines Added by Pharmacist:</p>
                                        <ul className="list-disc ml-5">
                                            {pres.medicines.map((m, idx) => (
                                                <li key={idx}>{m.itemName} - ${m.price}</li>
                                            ))}
                                        </ul>
                                        <p className="font-bold mt-1 text-emerald-600">
                                            Total: ${pres.medicines.reduce((total, item) => total + item.price, 0)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                {pres.status === 'confirmed' ? (
                                    <Link to="/dashboard/payment/:cartId" state={{ totalAmount: pres.medicines.reduce((total, item) => total + item.price, 0) }}>
                                        <button className="btn btn-primary btn-sm">Pay Now</button>
                                    </Link>
                                ) : (
                                    <button className="btn btn-disabled btn-sm">Wait for Check</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPrescriptions;