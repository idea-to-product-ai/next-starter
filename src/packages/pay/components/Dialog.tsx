


import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PaymentForm } from "./Form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order } from "@/orm/supabase";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const PaymentDialog = (props: { price: number, productId: string, onSuccess?: () => void, onError?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState<string>('');
  const { data: session } = useSession();
  const [orderId, setOrderId] = useState<string | null>(null);

  const refreshSecret = async (price: number) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price, currency: "usd" }), // 10.00 USD
    });
    const { clientSecret } = await res.json();
    setSecret(clientSecret);
  };

  const createOrder = async () => {
    const { data, error } = await Order.createOrder({
      userId: session?.user?.id,
      productId: props.productId,
      price: props.price,
    });
    setOrderId(data.id);
  };

  useEffect(() => {
    refreshSecret(props.price);
  }, [props.price]);

  useEffect(() => {
    if (open) {
      createOrder();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 px-6 py-2 font-medium text-white transition-transform hover:scale-[1.02]">
          Pay
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Payment</DialogTitle>
        <DialogDescription>
          {
            secret && (
              <Elements stripe={stripePromise} options={{
                clientSecret: secret,
                appearance: {
                  theme: 'night',
                },
              }}>
                <PaymentForm price={props.price} orderId={orderId} onSuccess={() => {
                  setOpen(false);
                  props.onSuccess?.();
                }} onError={() => {
                  setOpen(false);
                  props.onError?.();
                }} />
              </Elements>
            )
          }
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
