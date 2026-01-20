import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router"; // useNavigate import koro
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { FaShoppingCart, FaEye, FaTimes, FaStar } from "react-icons/fa";
import Swal from "sweetalert2"; // SweetAlert import

// Custom Hooks // Secure hook for post
 // Auth hook

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import UseAxiosSecure from "../../hook/UseAxiosSecure";
import UseAuth from "../../hook/UseAuth";

const FeaturedMedicines = () => {
  const axiosSecure = UseAxiosSecure(); // Cart এ পোস্ট করার জন্য Secure Axios
  const { user } = UseAuth();
  const navigate = useNavigate();
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Fetch Data
  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axiosSecure.get("/medicines");
      return res.data;
    },
  });

  // ✅ Add to Cart Function
  const handleAddToCart = async (medicine) => {
    // ১. ইউজার লগইন না থাকলে লগইন পেজে পাঠাবো
    if (!user && !user?.email) {
      Swal.fire({
        title: "Please Login",
        text: "You need to login to add items to the cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: location.pathname } });
        }
      });
      return;
    }

    // ২. কার্ট অবজেক্ট তৈরি
    const cartItem = {
      medicineId: medicine._id,
      userEmail: user.email,
      itemName: medicine.itemName,
      company: medicine.company,
      image: medicine.MedicineImage,
      price: medicine.price, // অথবা ডিসকাউন্ট প্রাইস দিতে পারো
      quantity: 1,
      category: medicine.category
    };

    // ৩. ব্যাকএন্ডে পাঠানো
    try {
        const res = await axiosSecure.post('/carts', cartItem);
        
        if(res.data.insertedId){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${medicine.itemName} added to cart`,
                showConfirmButton: false,
                timer: 1500
            });
            // Optional: Refetch cart count here if you have a useCart hook
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Try again.",
        });
    }
  };

  if (isLoading) return <div className="text-center my-20"><span className="loading loading-dots loading-lg text-emerald-500"></span></div>;

  return (
    <section className="py-16 bg-slate-50">
      <Helmet>
        <title>Featured Medicines | PharmaHub</title>
      </Helmet>

      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Featured Products</h2>
                <p className="text-slate-500 mt-2">Check out our best-selling medicines with verified quality.</p>
            </div>
            <Link to='/shopPage'>
                <button className="hidden md:block btn btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-full px-6">
                    View All
                </button>
            </Link>
        </div>

        {/* Slider */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          freeMode={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="mySwiper pb-12"
        >
          {medicines.map((med) => (
            <SwiperSlide key={med._id}>
              <div className="card bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl group overflow-hidden h-[420px]">
                
                {/* Discount Badge */}
                {med.discount > 0 && (
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        -{med.discount}% OFF
                    </div>
                )}

                {/* Image */}
                <figure className="relative h-48 bg-gray-50 p-4 overflow-hidden">
                  <img
                    src={med.MedicineImage}
                    alt={med.itemName}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Hover Buttons */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button 
                        onClick={() => setSelectedMedicine(med)}
                        className="btn btn-sm btn-circle bg-white text-emerald-600 shadow-lg border-none hover:bg-emerald-500 hover:text-white"
                        title="Quick View"
                    >
                        <FaEye />
                    </button>
                    {/* ✅ Add to Cart Button (Slider) */}
                    <button 
                        onClick={() => handleAddToCart(med)}
                        className="btn btn-sm btn-circle bg-white text-emerald-600 shadow-lg border-none hover:bg-emerald-500 hover:text-white"
                        title="Add to Cart"
                    >
                        <FaShoppingCart />
                    </button>
                  </div>
                </figure>

                {/* Content */}
                <div className="card-body p-5">
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300"/>
                      <span className="text-gray-400 ml-1">(4.0)</span>
                  </div>
                  
                  <h3 className="card-title text-base font-bold text-slate-700 h-10 overflow-hidden">
                    {med.itemName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{med.category} • {med.company}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-emerald-600">৳{med.price}</span>
                    {med.discount > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                            ৳{Math.round(med.price + (med.price * med.discount / 100))}
                        </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex flex-col lg:flex-row">
                
                <div className="lg:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
                    <img
                        src={selectedMedicine.MedicineImage || "/default-medicine.png"}
                        alt={selectedMedicine.itemName}
                        className="max-h-64 object-contain drop-shadow-xl"
                    />
                    {selectedMedicine.discount > 0 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">SALE</span>
                    )}
                </div>

                <div className="lg:w-1/2 p-8 relative">
                    <button
                        onClick={() => setSelectedMedicine(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-xl"
                    >
                        <FaTimes />
                    </button>

                    <span className="badge badge-outline badge-primary mb-2 text-xs">{selectedMedicine.category}</span>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{selectedMedicine.itemName}</h2>
                    <p className="text-sm text-slate-500 mb-4">Generic: <span className="font-semibold text-slate-700">{selectedMedicine.genericName}</span></p>
                    <div className="divider my-2"></div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {selectedMedicine.description || "No description available for this medicine."}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <p className="text-sm text-slate-400">Total Price</p>
                            <p className="text-3xl font-bold text-emerald-600">৳{selectedMedicine.price}</p>
                        </div>
                        {/* ✅ Add to Cart Button (Modal) */}
                        <button 
                            onClick={() => handleAddToCart(selectedMedicine)}
                            className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full shadow-lg shadow-emerald-200"
                        >
                            <FaShoppingCart className="mr-2"/> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedMedicine(null)}>close</button>
          </form>
        </dialog>
      )}
    </section>
  );
};

export default FeaturedMedicines;