import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { MdCloudUpload, MdCheckCircle, MdSecurity, MdAssignmentTurnedIn } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import UseAuth from '../hook/UseAuth';

const UploadPrescription = () => {
    const { register, handleSubmit, reset, watch } = useForm();
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [isUploading, setIsUploading] = useState(false);
    
    const selectedFile = watch("image");

    const image_hosting_key = import.meta.env.VITE_image_key;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const onSubmit = async (data) => {
        if (!user) {
            return Swal.fire({
                title: "Login Required",
                text: "Please sign in to securely upload medical documents.",
                icon: "info",
                confirmButtonColor: "#10B981"
            });
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            const res = await axios.post(image_hosting_api, formData);

            if (res.data.success) {
                const prescriptionInfo = {
                    userEmail: user.email,
                    userName: user.displayName,
                    image: res.data.data.display_url,
                    note: data.note,
                    status: "pending",
                    createdAt: new Date()
                };

                const dbRes = await axiosSecure.post('/prescriptions', prescriptionInfo);
                
                if (dbRes.data.insertedId) {
                    reset();
                    Swal.fire({
                        icon: 'success',
                        title: 'Upload Successful',
                        text: 'Our team will verify your prescription shortly.',
                        confirmButtonColor: "#10B981"
                    });
                }
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Something went wrong.' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
                    >
                        Upload <span className="text-emerald-500">Prescription</span>
                    </motion.h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg">
                        Quickly and securely send your medical documents to our licensed pharmacists for instant processing.
                    </p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-12 gap-12 items-start"
                >
                    {/* --- Left: Trust Info (3 columns) --- */}
                    <div className="lg:col-span-4 space-y-6">
                        {[
                            { icon: <MdSecurity />, title: "Secure Privacy", desc: "Your data is encrypted and handled only by doctors." },
                            { icon: <MdCheckCircle />, title: "Instant Review", desc: "Get verification within 30 minutes of uploading." },
                            { icon: <MdAssignmentTurnedIn />, title: "Easy Ordering", desc: "Medicines added to your cart automatically." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="text-emerald-500 text-3xl">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Right: Upload Form (8 columns) --- */}
                    <div className="lg:col-span-8 bg-white border-2 border-slate-50 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/40">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            
                            {/* Drag & Drop Area */}
                            <div className="group">
                                <label 
                                    htmlFor="file-upload"
                                    className={`
                                        relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-12 cursor-pointer transition-all
                                        ${selectedFile?.length > 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50'}
                                    `}
                                >
                                    <input 
                                        type="file" 
                                        id="file-upload"
                                        {...register("image", { required: true })} 
                                        className="hidden" 
                                    />
                                    <div className={`p-5 rounded-3xl mb-4 transition-colors ${selectedFile?.length > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-emerald-500'}`}>
                                        <MdCloudUpload size={40} />
                                    </div>
                                    <p className="font-black text-slate-800 text-lg">
                                        {selectedFile?.length > 0 ? selectedFile[0].name : "Select Prescription File"}
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2 italic">Support: JPG, PNG, PDF</p>
                                </label>
                            </div>

                            {/* Note Area */}
                            <div>
                                <label className="block text-slate-500 font-bold mb-3 uppercase text-[10px] tracking-widest ml-4">
                                    Special Instructions (Optional)
                                </label>
                                <textarea 
                                    {...register("note")} 
                                    placeholder="Tell our pharmacist anything important..." 
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-3xl p-6 text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all h-36 resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button 
                                disabled={isUploading}
                                className={`
                                    w-full py-5 rounded-full font-black text-white text-lg shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3
                                    ${isUploading ? 'bg-slate-300' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]'}
                                `}
                            >
                                {isUploading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    "Confirm Upload"
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default UploadPrescription;