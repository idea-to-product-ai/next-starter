import supabase from "./instance";

export const createPayment = async (params: {
    orderId: string,
    amount: number,
    currency: string,
    stripePaymentIntentId: string,
    status: string,
}) => {
    const { data: paymentData, error: paymentError } = await supabase.from('payments').insert({
        order_id: params.orderId,
        amount: params.amount,
        currency: params.currency,
        status: params.status,
        stripe_payment_intent_id: params.stripePaymentIntentId,
    });
    return {
        data: paymentData,
        error: paymentError
    }
}