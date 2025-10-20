import supabase from "../utils/supabase";

export async function addCart(userId: string | undefined, productId: number) {



    // = Wir prüfen ob den Warenkorb für den User da ist

    // ! NEW
    const { data: cart, error: cartError } = await supabase.from("carts").select("*").eq("customer_id", userId)

    if (cartError) {
        console.error("Fehler beim Anrufen des Warenkorbs", cartError);
    }

    console.log(cart);

    const cartId = cart?.[0].id

    // = wir prüfen, ob Product schon im Warenkorb bereits liegt

    const { data: itemExists, error: ErrorItem } = await supabase
        .from("cart_items")
        .select("*")
        // diese cart_id, 1 ist hardcodiert, weil wir kein User noch haben
        // ! NEW
        .eq("cart_id", cartId)
        .eq("product_id", productId)

    if (ErrorItem) {
        console.error("Fehler beim Prüfen des Warenkorbs", ErrorItem);
    }

    console.log(itemExists);

    const existingItem = itemExists?.[0]

    if (existingItem) {
        const { error: UpdateError } = await supabase
            .from("cart_items")
            .update({
                quantity: existingItem.quantity + 1
            })
            .eq("id", existingItem.id)
        if (UpdateError) {
            console.error("Fehler beim Aktualisieren", UpdateError);
        } else {
            console.log("Menge erhöht");
        }
    } else {
        // = Falls nicht vorhanden ist, neue Item bzw Product hinzufügen
        const { error: InsertError } = await supabase
            .from("cart_items")
            .insert({
                // ! NEW
                cart_id: cartId,
                product_id: productId,
                quantity: 1
            })
        if (InsertError) {
            console.error("Fehler beim Einfügen", InsertError);
        } else {
            console.log("Product wurde zum Warenkorb hinzugefügt");
        }
    }



}