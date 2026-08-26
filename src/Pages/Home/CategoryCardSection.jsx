import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaEye,
  FaTimes,
  FaStar,
  FaArrowRight,
  FaTag,
  FaStore,
} from "react-icons/fa";
import Swal from "sweetalert2";

import UseAxiosSecure from "../../hook/UseAxiosSecure";
import UseAuth from "../../hook/UseAuth";

const HOMEPAGE_LIMIT = 3; // only 3 cards shown on the homepage

/* ── Star rating ─────────────────────────────────────────────── */
const StarRating = ({ value = 4.8 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        size={11}
        className={i < Math.round(value) ? "text-amber-400" : "text-slate-200"}
      />
    ))}
    <span className="ml-1.5 text-[11px] text-slate-400 font-medium">{value}</span>
  </div>
);

/* ── Main component ──────────────────────────────────────────── */
const FeaturedMedicines = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quickView, setQuickView] = useState(null);

  const { data: allMedicines = [], isLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axiosSecure.get("/medicines");
      return res.data;
    },
  });

  // Only take 3 for the homepage teaser
  const featured = allMedicines.slice(0, HOMEPAGE_LIMIT);

  const handleAddToCart = async (medicine, e) => {
    e?.stopPropagation();

    if (!user?.email) {
      Swal.fire({
        title: "Login required",
        text: "Please login to add items to your cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#059669",
        confirmButtonText: "Login",
      }).then((r) => {
        if (r.isConfirmed)
          navigate("/login", { state: { from: location.pathname } });
      });
      return;
    }

    const cartItem = {
      medicineId: medicine._id,
      userEmail: user.email,
      itemName: medicine.itemName,
      price: medicine.price,
      image: medicine.MedicineImage,
      quantity: 1,
    };

    try {
      const res = await axiosSecure.post("/carts", cartItem);
      if (res.data.insertedId) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `${medicine.itemName} added to cart`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="h-72 flex items-center justify-center bg-slate-50">
        <span className="loading loading-bars loading-lg text-emerald-500" />
      </div>
    );

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[1.5px] bg-emerald-500 rounded" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
                Best sellers
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured <span className="text-emerald-500">medicines</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Hand-picked top products from our pharmacy
            </p>
          </motion.div>

          <Link to="/shopPage">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm"
            >
              View all medicines <FaArrowRight size={11} />
            </motion.button>
          </Link>
        </div>

        {/* ── 3-card grid: 1 mobile / 2 tablet / 3 desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((med, idx) => (
            <MedicineCard
              key={med._id}
              med={med}
              idx={idx}
              onQuickView={setQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* ── Explore CTA ── */}
        <div className="flex flex-col items-center mt-10 gap-2">
          <Link to="/shopPage">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              <FaStore size={14} />
              Explore full shop
              <FaArrowRight size={12} />
            </motion.button>
          </Link>
          <p className="text-xs text-slate-400">
            Showing {HOMEPAGE_LIMIT} of {allMedicines.length}+ medicines available
          </p>
        </div>
      </div>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickView && (
          <QuickViewModal
            med={quickView}
            onClose={() => setQuickView(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

/* ── Card ────────────────────────────────────────────────────── */
const MedicineCard = ({ med, idx, onQuickView, onAddToCart }) => {
  const oldPrice = Math.round(med.price * 1.2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="group bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:border-slate-200 hover:shadow-md transition-all duration-200"
    >
      {/* Image panel */}
      <div className="relative h-48 bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
        <img
          src={med.MedicineImage}
          alt={med.itemName}
          className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {med.discount > 0 && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-red-50 border border-red-100 text-red-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
            <FaTag size={8} /> {med.discount}% off
          </span>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onQuickView(med)}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-colors shadow-sm"
            aria-label="Quick view"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={(e) => onAddToCart(med, e)}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-colors shadow-sm"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {med.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-500">
            {med.company}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-800 mb-1.5 truncate group-hover:text-emerald-600 transition-colors">
          {med.itemName}
        </h3>

        <StarRating />

        {/* Price + cart */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              Best price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                ৳{med.price}
              </span>
              {med.discount > 0 && (
                <span className="text-xs text-slate-300 line-through">
                  ৳{oldPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => onAddToCart(med, e)}
            className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

/* ── Quick View Modal ────────────────────────────────────────── */
const QuickViewModal = ({ med, onClose, onAddToCart }) => {
  const oldPrice = Math.round(med.price * 1.2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 14 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-100 shadow-xl overflow-hidden flex flex-col md:flex-row relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <FaTimes size={12} />
        </button>

        {/* Image */}
        <div className="md:w-2/5 bg-slate-50 flex items-center justify-center p-8 min-h-[220px]">
          <img
            src={med.MedicineImage}
            alt={med.itemName}
            className="max-h-[220px] w-auto object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-6 flex flex-col">
          <span className="self-start text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
            Verified quality
          </span>

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {med.itemName}
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Generic: {med.genericName}
          </p>

          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            {med.description ||
              "A clinically verified pharmaceutical product formulated to high standards for effective and reliable results."}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { label: "Category", value: med.category },
              { label: "Company", value: med.company },
              { label: "Per unit", value: `৳${med.price} / strip` },
              { label: "Availability", value: "In stock", green: true },
            ].map(({ label, value, green }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 rounded-lg p-2.5"
              >
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                  {label}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    green ? "text-emerald-600" : "text-slate-800"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
                Unit price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-emerald-600">
                  ৳{med.price}
                </span>
                {med.discount > 0 && (
                  <span className="text-xs text-slate-300 line-through">
                    ৳{oldPrice}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                onAddToCart(med, e);
                onClose();
              }}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              <FaShoppingCart size={13} /> Add to cart
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeaturedMedicines;