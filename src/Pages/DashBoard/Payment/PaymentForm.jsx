import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import UseAxiosSecure from '../../../hook/UseAxiosSecure';
import UseAuth from '../../../hook/UseAuth';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const navigate = useNavigate();
    const { cartId } = useParams();

    const { isPending, data: cartItem = {} } = useQuery({
        queryKey: ['cart-item', cartId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts/${cartId}`);
            return res.data;
        },
        enabled: !!cartId
    });

    if (isPending) {
        return <div className="flex justify-center py-10"><span className="loading loading-spinner loading-md text-emerald-500"></span></div>;
    }

    const priceTk = cartItem.price * (cartItem.quantity || 1);
    const amountCents = Math.round(priceTk * 100);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card == null) return;

        // --- STEP 1: Create Payment Method ---
        const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
            billing_details: {
                name: user?.displayName || 'Anonymous',
                email: user?.email || 'unknown',
            },
        });

        if (methodError) {
            setError(methodError.message);
            return;
        }

        setError('');

        try {
            // --- STEP 2: Create Intent on Backend ---
            const res = await axiosSecure.post('/create-payment-intent', { amountCents });
            const clientSecret = res.data.clientSecret;

            // --- STEP 3: Confirm Payment using the paymentMethod ID ---
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id, // ✅ Now using the paymentMethod we created
            });

            if (confirmError) {
                setError(confirmError.message);
            } else if (paymentIntent.status === "succeeded") {
                
                // --- STEP 4: Prepare Data for History ---
                const paymentData = {
                    cartId: cartItem._id, 
                    userEmail: user.email,
                    sellerEmail: cartItem.sellerEmail, 
                    priceTk,
                    transactionId: paymentIntent.id,
                    paymentMethodId: paymentMethod.id, // ✅ Saving the method ID
                    cardBrand: paymentMethod.card.brand, // Optional: useful for invoice
                    status: "success",
                    paidAt: new Date()
                };

                // --- STEP 5: Save to Database ---
                const paymentRes = await axiosSecure.post('/payments', paymentData);
                
                if (paymentRes.data.insertedId) {
                    Swal.fire({
                        title: "Payment Successful",
                        text: `${cartItem.itemName} - Paid ${priceTk}৳`,
                        icon: "success",
                        confirmButtonColor: "#10b981",
                    }).then(() => {
                        navigate(`/invoice/${paymentRes.data.insertedId}`);
                    });
                }
            }
        } catch (err) {
            setError("Server Error: Payment could not be processed.");
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-2">Checkout</h2>
            <p className="text-slate-500 text-sm mb-6">Paying for: <strong>{cartItem.itemName}</strong></p>

            <form onSubmit={handleSubmit}>
                <div className="p-4 border-2 border-slate-100 rounded-2xl mb-6">
                    <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                </div>
                <button
                    type='submit'
                    className="btn btn-primary w-full bg-emerald-500 border-none hover:bg-emerald-600 text-white rounded-xl font-bold h-12 transition-all shadow-lg shadow-emerald-100"
                    disabled={!stripe || amountCents < 50}
                >
                    Pay {priceTk}৳ Now
                </button>
                {error && <p className='text-red-500 text-xs mt-4 bg-red-50 p-3 rounded-lg font-medium'>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;