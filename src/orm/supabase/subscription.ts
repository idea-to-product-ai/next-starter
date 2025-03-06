import supabase from "./instance";

export const isActive = async (userId: string) => {
    const { data, error } = await supabase.from("user_subscriptions").select("*").eq("user_id", userId);
    if (error) {
        console.error("Error getting subscription:", error);
    }
    return {
        data,
        error
    }
}

export const createSubscription = async (params: {
    userId: string,
    productId: string,
    status: string,
    startDate: Date,
    endDate: Date,
}) => {
    const { data, error } = await supabase.from('user_subscriptions').insert({
        user_id: params.userId,
        plan_id: params.productId,
        status: params.status,
        start_date: params.startDate,
        end_date: params.endDate,
    });
    return {
        data,
        error
    }
}