import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";

const Shop = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();
  const [category, setCategory] = useState(""); // selected category

  // ✅ Fetch medicines with optional category filter
  const { data: medicines = [], isLoading, error } = useQuery({
    queryKey: ["medicines", category],
    queryFn: async () => {
      let url = "/medicines";
      if (category) url += `/category/${category}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const handleSelect = async (medicine) => {
    try {
      if (!user) return;

      const cartItem = {
        userEmail: user.email,
        medicineId: medicine._id,
        itemName: medicine.itemName,
        company: medicine.company,
        price: medicine.finalPrice,
        quantity: 1,
        status: "pending",
      };

      await axiosSecure.post("/carts", cartItem);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${medicine.itemName} has been added to cart!`,
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not add to cart",
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading medicines...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load medicines</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Shop Different Category Medicines</h2>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All</option>
          <option value="Tablet">Tablet</option>
          <option value="Syrup">Syrup</option>
          <option value="Capsule">Capsule</option>
          <option value="Injection">Injection</option>
          <option value="Cream">Cream</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Medicines Table */}
      <table className="table-auto w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine._id} className="border-t">
              <td className="px-4 py-2">{medicine.itemName}</td>
              <td className="px-4 py-2">{medicine.company}</td>
              <td className="px-4 py-2">${medicine.price}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() =>
                    Swal.fire({
                      title: medicine.itemName,
                      text: `Company: ${medicine.company}, Price: $${medicine.price}`,
                      imageUrl: medicine.image,
                      imageWidth: 200,
                      imageHeight: 200,
                      imageAlt: "Medicine Image",
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  👁 Eye
                </button>

                <button
                  onClick={() => handleSelect(medicine)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  ✅ Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shop;
