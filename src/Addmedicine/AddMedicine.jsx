import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";
import axios from "axios";

// Generate unique medicine ID
const generateMedicineID = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `MED-${timestamp}-${randomStr}`.toUpperCase();
};

const AddMedicineForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },

    watch,
  } = useForm({
    defaultValues: {
      discount: 0, // default discount 0
    },
  });

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const axiosSecure = UseAxiosSecure();
  const [image, setImage] = useState(null);

  const price = watch("price");
  const discount = watch("discount");

  // price calculation
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
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const imageUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_key}`;
      const res = await axios.post(imageUrl, formData);
      console.log(res);
      if (res.data.success) {
        setImage(res.data.data.url);
        Swal.fire("Uploaded!", "Image uploaded successfully", "success");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", "Image upload failed!", "error");
    }
  };

  const onSubmit = (data) => {
    const medicineID = generateMedicineID();

    if (!image) {
      Swal.fire("Error", "Please upload an image!", "error");
      return;
    }

    // প্রথমে confirmation alert
    Swal.fire({
      title: "Confirm Medicine?",
      html: `
        <p><b>Item:</b> ${data.itemName}</p>
        <p><b>Price:</b> ${price}৳</p>
        <p><b>Discount:</b> ${discount || 0}% (৳${discountAmount.toFixed(2)})</p>
        <p><b>Final Price:</b> ${finalPrice.toFixed(2)}৳</p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const savedData = {
          ...data,
          MedicineImage: image,
          discountAmount,
          finalPrice,
          medicineID, // unique ID
          status: "available", // default status
          creation_date: new Date(), // add creation date
        };

        console.log("Saved to DB:", savedData);

        // DB তে পাঠানো

        axiosSecure.post('/medicines', savedData)
          .then(res => {
            console.log(res.data);
            if (res.data.medicineID) {
              Swal.fire({
                icon: "success",
                title: "Medicine Added",
                text: `${data.itemName} has been added successfully!`,
                confirmButtonColor: "#3085d6",
              });

            }



          })



      }
    });
  };



  return (
    <div className="p-8 bg-base-200 rounded-lg max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Item Name & Generic Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Item Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Napa"
              className="input input-bordered w-full"
              {...register("itemName", { required: "Item name is required" })}
            />
            {errors.itemName && (
              <span className="text-red-500 text-sm mt-1">
                {errors.itemName.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Item Generic Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Paracetamol"
              className="input input-bordered w-full"
              {...register("genericName", {
                required: "Generic name is required",
              })}
            />
            {errors.genericName && (
              <span className="text-red-500 text-sm mt-1">
                {errors.genericName.message}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Category & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("category", { required: "Category is required" })}
              defaultValue=""
            >
              <option disabled value="">
                Select a category
              </option>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Capsule">Capsule</option>
              <option value="Injection">Injection</option>
              <option value="Cream">Cream</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Company</span>
            </label>
            <input
              type="text"
              placeholder="Enter company name"
              className="input input-bordered w-full"
              {...register("company", { required: "Company is required" })}
            />
            {errors.company && (
              <span className="text-red-500 text-sm mt-1">
                {errors.company.message}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Mass Unit, Price, Discount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Item Mass Unit</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("massUnit", { required: "Mass unit is required" })}
              defaultValue=""
            >
              <option disabled value="">
                Select Unit
              </option>
              <option value="Mg">Mg</option>
              <option value="Ml">Ml</option>
            </select>
            {errors.massUnit && (
              <span className="text-red-500 text-sm mt-1">
                {errors.massUnit.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Per Unit Price</span>
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g., 100"
              className="input input-bordered w-full"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {errors.price && (
              <span className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </span>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Discount Percentage (%)</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 10"
              className="input input-bordered w-full"
              defaultValue={0}
              {...register("discount", {
                valueAsNumber: true,
                min: { value: 0, message: "Discount cannot be negative" },
                max: { value: 100, message: "Discount cannot exceed 100" },
              })}
            />
            {errors.discount && (
              <span className="text-red-500 text-sm mt-1">
                {errors.discount.message}
              </span>
            )}
          </div>
        </div>

        {/* Row 3.1: Discount Calculation (Read Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Discount Amount (Tk)</span>
            </label>
            <input
              type="text"
              value={discountAmount.toFixed(2)}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Final Price (After Discount)</span>
            </label>
            <input
              type="text"
              value={finalPrice.toFixed(2)}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
        </div>

        {/* Row 4: Image Upload */}
        <div className="form-control">
          <label className="label">Medicine Image</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleImage}
          />
        </div>

        {/* Row 5: Short Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Short Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Write a short description about the medicine"
            {...register("description", {
              required: "Description is required",
            })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Add Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicineForm;
