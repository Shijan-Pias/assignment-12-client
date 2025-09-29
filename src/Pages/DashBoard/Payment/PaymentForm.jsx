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

    // ✅ Cart থেকে সেই medicine এর info আনছি
    const { isPending, refetch, data: medicineInfo = {} } = useQuery({
        queryKey: ['carts', cartId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts/${cartId}`);
            return res.data;
        }
    });

    if (isPending) {
        return '...loading';
    }

    const priceTk = medicineInfo.price;
    const amountCents = priceTk * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');
            console.log('paymentMethod', paymentMethod);

            // step -2 : create payment intent 
            const res = await axiosSecure.post('/create-payment-intent', {
                amountCents,
                cartId
            });
            const clientSecret = res.data.clientSecret;

            //STEP-3 :confirm payment 
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                setError('');
                console.log('payment successfully');
                console.log(result);

                // step -4 : payment save and history show 
                const paymentData = {
                    cartId,
                    userEmail: user.email,                    // কে কিনলো
                    sellerEmail: medicineInfo.sellerEmail,    // seller কে
                    priceTk,
                    transactionId: result.paymentIntent.id,
                    paymentMethod: result.paymentIntent.payment_method_types,
                    status: "success",
                    paidAt: new Date()
                };

                const paymentRes = await axiosSecure.post('/payments', paymentData);
                if (paymentRes.data.insertedId) {
                    Swal.fire({
                        title: "Payment Successful ",
                        text: "Your Medicine has been marked as paid.",
                        icon: "success",
                        confirmButtonText: "Go to invoice",
                    }).then(() => {
                        // ✅ Redirect to invoice
                        navigate(`/invoice/${paymentRes.data.insertedId}`);
                    });
                    refetch();
                }
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
                <CardElement className='p-2 ' />
                <button
                    type='submit'
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    disabled={!stripe}
                >
                    Pay {priceTk} tk
                </button>
                {error && <p className='text-red-400'>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;
