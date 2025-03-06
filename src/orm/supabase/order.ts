import supabase from "./instance";

export const createOrder = async ({ userId, productId, price }: { userId: string, productId: string, price: number }) => {
    const { data, error } = await supabase.from("orders").insert({
        user_id: userId,
        total_amount: price * 100,
        currency: 'usd',
        status: 'pending',
        product_id: productId,
    }).select().single();
    return {
        data,
        error
    }
}

export const getOrder = async (orderId: string) => {
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    return {
        data,
        error
    }
}

export const updateOrder = async (orderId: string, params: {
    status: string,
}) => {
    const { data, error } = await supabase.from("orders").update(params).eq("id", orderId);
    return {
        data,
        error
    }
}