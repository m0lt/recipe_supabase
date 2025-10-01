import type { ICart } from "../interfaces/ICart";
import type { ICategory } from "../interfaces/ICategory";
import type { IProduct } from "../interfaces/IProduct";
import supabase from "../utils/supabase";

// = Produkten + Kategorien


// = SQL CODE

// SELECT products.id, products.title, products.price, products.quality, categories.categoryname
// FROM products
// JOIN categories ON products.categoryid = categories.id;

export async function getProductANDCategory(): Promise<IProduct[]> {
    const { data: products, error } = await supabase.from("products")
        .select(
            `
                id,
                title,
                price,
                quality,
                category:categories(category_name)
                `
        )
    if (error) {
        console.error(error);
    }
    console.log(products);
    return products as unknown as IProduct[]
}



// Cart_items mit Produkten + Kategorien

// = SQL CODE

// SELECT 
//     cart_items.id,
//     cart_items.cart_id,
//     cart_items.quantity,
//     products.id,
//     products.title,
//     products.price,
//     products.quality,
//     categories.id,
//     categories.categoryName
// FROM cart_items
// JOIN products ON cart_items.product_id = products.id
// JOIN categories ON products.categoryID = categories.id;



export async function getCart(): Promise<ICart> {
    const { data: cart, error } = await supabase.from
        ("cart_items")
        .select(
            `
        id,
        cart_id,
        quantity,
        products:products(
        id,
        title,
        price,
        quality,
        category:categories(category_name)
        )
        `
        )
    if (error) {
        console.error(error);
    }
    console.log(cart);
    return cart as unknown as ICart
}



export async function getCategory(): Promise<ICategory> {
    const { data: category, error } = await supabase.from("categories")
        .select(`
        category_name,
        id,
        products_table:products(*)
        `)

    if (error) {
        console.error(error);
    }
    console.log(category);
    return category as unknown as ICategory
}