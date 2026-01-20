import React from 'react';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from 'axios';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import UseAuth from '../hook/UseAuth';

const UploadPrescription = () => {
    const { register, handleSubmit, reset } = useForm();
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    
    // ১. API Key এনভায়রনমেন্ট ভেরিয়েবল থেকে আনা
    const image_hosting_key = import.meta.env.VITE_image_key;
    // নোট: expiration=600 দিলে ১০ মিনিট পর ছবি ডিলিট হয়ে যাবে। পার্মানেন্ট রাখতে চাইলে এটা সরাও।
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const onSubmit = async (data) => {
        if(!user){
             return Swal.fire("Please Login first!");
        }

        // ২. FormData তৈরি করা (খুবই গুরুত্বপূর্ণ ধাপ)
        const formData = new FormData();
        formData.append('image', data.image[0]);

        try {
            // ৩. ImgBB তে আপলোড করা
            const res = await axios.post(image_hosting_api, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                const prescriptionURL = res.data.data.display_url;
                
                // ৪. ডাটাবেসে ইনফো সেভ করা
                const prescriptionInfo = {
                    userEmail: user.email,
                    image: prescriptionURL, // ImgBB লিংক
                    note: data.note,
                    status: "pending", // স্ট্যাটাস অ্যাড করা ভালো
                    createdAt: new Date()
                };
                console.log(prescriptionInfo);

                const dbRes = await axiosSecure.post('/prescriptions', prescriptionInfo);
                
                if(dbRes.data.insertedId){
                    reset();
                    Swal.fire({
                        icon: 'success',
                        title: 'Request Sent!',
                        text: 'We will check your prescription soon.',
                    });
                }
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Something went wrong while uploading image.',
            });
        }
    };

    return (
        <div className="bg-emerald-50 p-10 rounded-xl my-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Upload Prescription</h2>
                <p className="text-slate-600 mb-6">
                    Don't know which medicine to choose? Just upload your doctor's prescription.
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="form-control">
                        <input 
                            type="file" 
                            {...register("image", { required: true })} 
                            className="file-input file-input-bordered file-input-accent w-full" 
                        />
                    </div>
                    <div className="form-control">
                        <textarea 
                            {...register("note")} 
                            placeholder="Any specific instructions? (Optional)" 
                            className="textarea textarea-bordered h-24"
                        ></textarea>
                    </div>
                    <button className="btn bg-emerald-600 text-white w-full hover:bg-emerald-700">
                        Submit Prescription
                    </button>
                </form>
            </div>
            <div className="flex-1">
               <img src="https://i.ibb.co/presc-demo.png" alt="Prescription" className="w-full rounded-lg shadow-2xl" />
            </div>
        </div>
    );
};

export default UploadPrescription;