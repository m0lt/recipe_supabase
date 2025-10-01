import type { IProduct } from "../interfaces/IProduct";
import supabase from "../utils/supabase";


// SELECT * FROM products 

export async function getProduct_store(): Promise<IProduct[]> {
    const { data: products, error } = await supabase.
        from("products")
        .select("*")
        .textSearch("title", "laptop | maus")
    if (error) {
        console.error(error);
    }
    return products as IProduct[]
}


// ! selectQueries Filter Supbase Methoden


// lt => lower than => kleiner als
// gt => greater than => großer als

// Filtern mit eq(), lt(), gt(), like() , between() , in , OR


// = 1. SQL CODE
// SELECT * FROM products WHERE quality = "High"


// = REACT CODE
// const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .eq("quality", "High")



// = 1.1

// const { data: products, error } = await supabase
//     .from("products")
//     .select("*")
//     .neq("quality", "Low")



// = 2 SQL CODE

// SELECT * FROM products WHERE quality = "High" AND price < 500


// = 2.1
// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .eq("quality", "high")
//     .lt("price", 500)



// = 3 SQL CODE

// SELECT * FROM products WHERE price >= 50 AND price <= 200


// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .eq("quality", "High")
//     .gte("price", 50)
//     .lte("price", 200)


// = 3.1 Alternative

// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .between("price", 50, 200)




// = 4 SQL CODE

// SELECT * FROM products WHERE quality IN ("High", "Medium")


// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .in("quality", ["High", "Medium"])





// = 5 SQL CODE

//  SELECT * FROM products WHERE quality = "High" OR price < 50


// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .or("quality.eq.High, price.lt.50")


// = 6 SQL CODE

// SELECT * FROM products WHERE price >= 50 AND quality = "High"


// filter
// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .filter("price", "gte", 50)
//     .filter("quality", "eq", "High")



// = 7 SQL CODE


// SELECT * FROM products WHERE title LIKE "%laptop%"


// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .ilike("title", "%laptop%")



// = 8

// const { data: products, error } = await supabase.
//     from("products")
//     .select("title, price")
//     .eq("quality", "High")



// = 9 just to know


// const { data: products, error } = await supabase.
//     from("products")
//     .select("*")
//     .textSearch("title", "laptop | maus")




