import type { ICart } from "../interfaces/ICart";
import supabase from "../utils/supabase";

export const getCart_V2 = async (userId: string | undefined): Promise<ICart[] | unknown> => {


    const { data: cart } = await supabase.from("carts")
        .select("id")
        .eq("customer_id", userId)
        .single()


    const { data: items } = await supabase.from("cart_items")
        .select("id, quantity, products:product_id(*)")
        .eq("cart_id", cart?.id)

    return items
}