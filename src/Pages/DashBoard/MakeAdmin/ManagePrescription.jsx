import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaPlus, FaTrash } from 'react-icons/fa';
import UseAxios from '../../../hook/UseAxios';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';

const ManagePrescriptions = () => {
    const axiosSecure = UseAxiosSecure();
    const axiosInstance = UseAxios();
    const [selectedPrescription, setSelectedPrescription] = useState(null); // Modal Data
    const [searchMedicine, setSearchMedicine] = useState('');
    const [addedMedicines, setAddedMedicines] = useState([]); // List created by Admin
    const [foundMedicines, setFoundMedicines] = useState([]);

    // 1. Fetch All Prescriptions
    const { data: prescriptions = [], refetch } = useQuery({
        queryKey: ['all-prescriptions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/prescriptions/admin');
            return res.data;
        }
    });

    // 2. Search Medicines Logic
    const handleSearchMedicine = async (e) => {
        e.preventDefault();
        const res = await axiosInstance.get(`/medicines?search=${searchMedicine}`);
        setFoundMedicines(res.data);
    };

    // 3. Add Medicine to List (Local State)
    const handleAddMedicine = (med) => {
        const alreadyAdded = addedMedicines.find(m => m._id === med._id);
        if (!alreadyAdded) {
            setAddedMedicines([...addedMedicines, { ...med, quantity: 1 }]); // Default qty 1
        }
    };

    // 4. Submit Final List to Backend
    const handleConfirmOrder = async () => {
        const updateInfo = {
            medicines: addedMedicines,
            status: "confirmed"
        };

        const res = await axiosSecure.patch(`/prescriptions/${selectedPrescription._id}/update`, updateInfo);
        
        if(res.data.modifiedCount > 0){
            Swal.fire("Success", "Prescription Confirmed & Medicines Added!", "success");
            refetch();
            document.getElementById('details_modal').close();
            setAddedMedicines([]);
        }
    };

    // Open Modal Function
    const openModal = (pres) => {
        setSelectedPrescription(pres);
        setAddedMedicines([]); // Reset previous
        setFoundMedicines([]);
        document.getElementById('details_modal').showModal();
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Manage Prescriptions</h2>
            
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((pres, index) => (
                            <tr key={pres._id}>
                                <td>{index + 1}</td>
                                <td>{pres.userEmail}</td>
                                <td>{new Date(pres.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${pres.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                                        {pres.status}
                                    </span>
                                </td>
                                <td>
                                    {pres.status === 'pending' && (
                                        <button onClick={() => openModal(pres)} className="btn btn-sm btn-info text-white">
                                            <FaEye /> Verify
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Verification */}
            <dialog id="details_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11/12 max-w-5xl h-[80vh]"> {/* Large Modal */}
                    <h3 className="font-bold text-lg mb-4">Verify Prescription</h3>
                    
                    <div className="flex flex-col lg:flex-row gap-6 h-full">
                        {/* Left: Image View */}
                        <div className="flex-1 border rounded-lg overflow-hidden">
                            <img 
                                src={selectedPrescription?.image} 
                                alt="Prescription" 
                                className="w-full h-full object-contain bg-black"
                            />
                        </div>

                        {/* Right: Add Medicine Section */}
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearchMedicine} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Search medicine..." 
                                    className="input input-bordered w-full"
                                    onChange={(e) => setSearchMedicine(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Search</button>
                            </form>

                            {/* Search Results */}
                            <div className="h-32 overflow-y-auto border p-2 rounded">
                                {foundMedicines.map(med => (
                                    <div key={med._id} className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer">
                                        <span>{med.itemName} (${med.price})</span>
                                        <button onClick={() => handleAddMedicine(med)} className="btn btn-xs btn-success text-white"><FaPlus/></button>
                                    </div>
                                ))}
                            </div>

                            {/* Added List */}
                            <div className="flex-1 border p-2 rounded bg-emerald-50">
                                <h4 className="font-bold border-b pb-2">Added for User:</h4>
                                <ul className="mt-2 space-y-2">
                                    {addedMedicines.map((med, idx) => (
                                        <li key={idx} className="flex justify-between text-sm">
                                            {med.itemName} - ${med.price}
                                            <span className="text-red-500 cursor-pointer"><FaTrash/></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={handleConfirmOrder} className="btn btn-success text-white w-full">
                                Confirm & Send to User
                            </button>
                        </div>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ManagePrescriptions;