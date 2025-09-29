import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../hook/UseAxiosSecure";
import UseAuth from "../hook/UseAuth";

const Shop = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = UseAuth();

  // Fetch medicines
  const { data: medicines = [], isLoading, error } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const res = await axiosSecure.get("/medicines");
      return res.data;
    },
  });

  // Add to cart
  const handleSelect = async (medicine) => {
    try {
      if (!user) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login to add items to your cart",
        });
        return;
      }

      const cartItem = {
        userEmail: user.email,
        sellerEmail: medicine.sellerEmail || "unknown@seller.com", // fallback
        medicineId: medicine._id,
        itemName: medicine.itemName,
        company: medicine.company,
        price: medicine.price, // or medicine.finalPrice if you have discounts
        quantity: 1,
        status: "pending",
      };

      await axiosSecure.post("/carts", cartItem);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${medicine.itemName} has been added to your cart!`,
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add item to cart",
      });
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading medicines...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Failed to load medicines</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Shop Medicines</h2>
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
                  👁 View
                </button>
                <button
                  onClick={() => handleSelect(medicine)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  ✅ Add to Cart
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
