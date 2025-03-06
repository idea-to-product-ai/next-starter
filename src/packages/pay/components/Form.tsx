import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner"
import { useState } from "react";
import FullScreenLoading from "@/components/ui/fullscreen-loading";
import { Order } from "@/orm/supabase";

export const PaymentForm = (props: { price: number, orderId: string | null, onSuccess?: () => void, onError?: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const {error: submitError} = await elements.submit();
        if (submitError) {
            return;
        }

        setLoading(true);

        // 1. 调用后端 API 获取 clientSecret
        const res = await fetch("/api/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: props.price, currency: "usd", orderId: props.orderId }), // 10.00 USD
        });
        const { clientSecret } = await res.json();

        // 2. 触发 Stripe 付款
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_URL}/order/${props.orderId}/complete`,
            },
            redirect: "if_required",
            clientSecret,
        });

        if (result.error) {
            setLoading(false);
            toast.error(result.error.message);
            return;
        }

        // 轮询订单状态
        const checkOrderStatus = async () => {
            const { data: order, error } = await Order.getOrder(props.orderId);
            if (error) {
                toast.error("Payment status confirmation timed out, please refresh the page to see the latest status");
                props?.onError?.();
                return false;
            }
            
            if (order.status === 'paid') {
                toast.success('Payment successful');
                props?.onSuccess?.();
                return true;
            }
            return false;
        };

        // 每3秒检查一次订单状态,最多检查10次
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(async () => {
            const isPaid = await checkOrderStatus();
            attempts++;
            
            if (isPaid || attempts >= maxAttempts) {
                setLoading(false);
                clearInterval(interval);
                if (!isPaid && attempts >= maxAttempts) {
                    toast.error("Payment status confirmation timed out, please refresh the page to see the latest status");
                    props?.onError?.();
                }
            }
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 px-6 py-2 font-medium text-white transition-transform hover:scale-[1.02]" disabled={!stripe}>Submit</button>
            <FullScreenLoading show={loading} />
        </form>
    );
}