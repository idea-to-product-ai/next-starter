import supabase from "./instance";

export const SignIn = async (user: any, account: any) => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();
    if (!data) {
        // 如果用户不存在，则插入
        const { error } = await supabase.from("users").insert([
            {
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                provider: account?.provider,
                provider_id: user.id,
                created_at: new Date(),
            },
        ])

        if (error) {
            console.error("Error inserting user:", error);
            return false; // 终止登录
        }
    }
    return true;
}

export const getUser = async (email: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();
    if (error) {
        console.error("Error getting user:", error);
        return null;
    }
    return data;
}