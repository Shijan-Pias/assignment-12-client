import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../hook/UseAxiosSecure";
import UseAuth from "../../../hook/UseAuth";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const CartPage = () => {
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const queryClient = useQueryClient();
    console.log(user);
    // const {medicineId} =useParams();
    // console.log(medicineId);

    // ✅ Fetch user's cart
    const { data: cartItems = [] } = useQuery({
        queryKey: ["carts", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts?userEmail=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email // only run when user exists
    });
   



    const updateQuantity = useMutation({
        mutationFn: ({ id, quantity }) =>
            axiosSecure.patch(`/carts/${id}`, { quantity }),
        onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    });

    const removeItem = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/carts/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    });

    const clearCart = useMutation({
        mutationFn: () => axiosSecure.delete(`/carts/user/${user.email}`),
        onSuccess: () => queryClient.invalidateQueries(["carts", user.email]),
    });




    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <table className="table-auto w-full border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Company</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Qty</th>
                                <th className="px-4 py-2">Total</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id} className="border-t">
                                    <td className="px-4 py-2">{item.itemName}</td>
                                    <td className="px-4 py-2">{item.company}</td>
                                    <td className="px-4 py-2">{item.price}৳</td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            className="input input-bordered w-20"
                                            onChange={(e) =>
                                                updateQuantity.mutate({
                                                    id: item._id,
                                                    quantity: parseInt(e.target.value),
                                                })
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        {(item.price * item.quantity).toFixed(2)}৳
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() =>
                                                removeItem.mutate(item._id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </td>
                                    <td>
                                        {item.status === "pending" ? (
                                            <Link to={`/dashBoard/payment/${item._id}`}>
                                                <button className="btn btn-primary">Checkout</button>
                                            </Link>
                                        ) : (
                                            <button className="btn btn-success cursor-default">Paid</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-between items-center">
                        <button
                            className="btn btn-warning"
                            onClick={() =>
                                Swal.fire({
                                    title: "Clear Cart?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, clear it!",
                                }).then((res) => {
                                    if (res.isConfirmed) clearCart.mutate();
                                })
                            }
                        >
                            Clear Cart
                        </button>

                        


                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
