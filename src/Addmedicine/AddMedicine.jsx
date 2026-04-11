import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import axios from "axios";
import { FaPills, FaTag, FaIndustry, FaImage, FaPlusCircle, FaCalculator } from "react-icons/fa";

const generateMedicineID = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `MED-${timestamp}-${randomStr}`.toUpperCase();
};

const AddMedicineForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: { discount: 0, price: 0 },
  });

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = UseAxiosSecure();

  const watchAllFields = watch(); // For the Live Preview
  const price = watch("price");
  const discount = watch("discount");

  useEffect(() => {
    if (price > 0) {
      const discountTk = (price * (discount || 0)) / 100;
      setDiscountAmount(discountTk);
      setFinalPrice(price - discountTk);
    } else {
      setDiscountAmount(0);
      setFinalPrice(0);
    }
  }, [price, discount]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`, formData);
      if (res.data.success) {
        setImage(res.data.data.url);
        Swal.fire({ icon: 'success', title: 'Image Processed', showConfirmButton: false, timer: 1000 });
      }
    } catch (err) {
      Swal.fire("Error", "Upload failed!", "error");
    } finally {
      setUploading(false);
    }
  };

 const onSubmit = async (data) => {
    if (!image) return Swal.fire("Required", "Please upload an image first", "warning");

    // Show a loading alert so the user knows something is happening
    Swal.fire({
      title: 'Launching Product...',
      html: 'Please wait while we sync with the store',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const medicineData = {
      ...data,
      MedicineImage: image,
      discountAmount,
      finalPrice,
      medicineID: generateMedicineID(),
      status: "available",
      creation_date: new Date(),
    };

    try {
      const res = await axiosSecure.post('/medicines', medicineData);
      
      // Close the loading alert
      Swal.close();

      if (res.data.insertedId || res.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Medicine Launched!",
          text: `${data.itemName} is now live and available for purchase.`,
          showConfirmButton: true,
          confirmButtonColor: "#10b981",
          timer: 3000 
        });
        
        reset(); 
        setImage(null);
      } else {
        Swal.fire("Backend Error", res.data.message || "The server rejected the data", "error");
      }
    } catch (err) {
      Swal.close();
      console.error("Submission Error:", err);
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: err.response?.data?.message || "Could not reach the server. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaPlusCircle /> Add New Medicine
            </h2>
            <p className="text-emerald-50 text-sm opacity-90">Enter details to list your product globally.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-b pb-2">
                <FaPills className="text-emerald-500" /> General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label font-bold text-slate-700">Medicine Name</label>
                  <input type="text" placeholder="e.g. Napa Extra" className={`input input-bordered focus:border-emerald-500 rounded-xl transition-all ${errors.itemName ? 'border-red-500' : ''}`}
                    {...register("itemName", { required: "Name is required" })} />
                </div>
                <div className="form-control">
                  <label className="label font-bold text-slate-700">Generic Name</label>
                  <input type="text" placeholder="e.g. Paracetamol" className="input input-bordered focus:border-emerald-500 rounded-xl"
                    {...register("genericName", { required: true })} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label font-bold text-slate-700">Category</label>
                <select className="select select-bordered focus:border-emerald-500 rounded-xl" {...register("category", { required: true })}>
                  <option value="">Select Category</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label font-bold text-slate-700 flex items-center gap-2"><FaIndustry /> Company</label>
                <input type="text" placeholder="e.g. Square Pharma" className="input input-bordered rounded-xl" {...register("company", { required: true })} />
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-200">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaCalculator className="text-emerald-500" /> Pricing Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label font-bold text-slate-700 text-xs">Unit Price (Tk)</label>
                  <input type="number" step="0.01" className="input input-bordered rounded-xl" {...register("price", { required: true, min: 0 })} />
                </div>
                <div className="form-control">
                  <label className="label font-bold text-slate-700 text-xs">Discount (%)</label>
                  <input type="number" className="input input-bordered rounded-xl" {...register("discount", { max: 100 })} />
                </div>
                <div className="form-control">
                  <label className="label font-bold text-emerald-600 text-xs">Final Price (Tk)</label>
                  <div className="h-12 bg-emerald-100 flex items-center px-4 rounded-xl font-black text-emerald-700 border border-emerald-200">
                    ৳ {finalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-control">
              <label className="label font-bold text-slate-700">Product Image</label>
              <div className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${image ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`}>
                {uploading ? <span className="loading loading-spinner text-emerald-500"></span> : 
                 image ? <img src={image} className="h-24 w-24 object-cover rounded-xl shadow-md border-2 border-white" alt="Preview" /> : 
                 <><FaImage className="text-4xl text-slate-300 mb-2" /><p className="text-xs text-slate-400 text-center">Click to upload or drag and drop<br/>PNG, JPG up to 5MB</p></>}
                <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div className="form-control">
              <label className="label font-bold text-slate-700 text-xs">Product Description</label>
              <textarea className="textarea textarea-bordered h-24 rounded-2xl" placeholder="Describe the medicine usage and side effects..." {...register("description")}></textarea>
            </div>

            <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 border-none w-full text-lg h-14 rounded-2xl shadow-xl shadow-emerald-200 transition-all text-white">
              Launch Product to Store
            </button>
          </form>
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-tighter">Real-time Preview</h3>
          <div className="sticky top-10 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 group">
             <div className="relative h-48 bg-slate-100 overflow-hidden">
                {image ? <img src={image} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="flex items-center justify-center h-full text-slate-300"><FaImage size={50}/></div>}
                {discount > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">SAVE {discount}%</div>}
             </div>
             <div className="p-6">
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">{watchAllFields.category || 'CATEGORY'}</p>
                <h4 className="text-xl font-bold text-slate-800 leading-tight">{watchAllFields.itemName || 'Medicine Name'}</h4>
                <p className="text-xs text-slate-400 mb-4">{watchAllFields.company || 'Manufacturing Co.'}</p>
                <div className="flex items-end gap-2">
                   <span className="text-2xl font-black text-slate-900">৳{finalPrice.toFixed(0)}</span>
                   {discount > 0 && <span className="text-xs text-slate-300 line-through mb-1">৳{price}</span>}
                </div>
                <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-1/3"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic font-medium text-center italic">Live view on store page</p>
             </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
             <p className="text-[10px] text-emerald-700 font-bold leading-tight">
                PRO TIP: High-quality images with white backgrounds increase medicine sales by up to 40%.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMedicineForm;