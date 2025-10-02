import type { IRecipe } from "../interfaces/IRecipe"
import supabase from "../utils/supabase"

export async function getRecipesWithCategory(): Promise<IRecipe[]> {
  const { data: recipes, error } = await supabase.from("recipes").select(
    `
        id,
        name,
        description,
        servings,
        instructions,
        created_at,
        category:categories(name)
      `
  )

  if (error) {
    console.error("Error fetching recipes:", error)
    return []
  }

  console.log(recipes)
  return recipes as unknown as IRecipe[]
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

// export async function getCart(): Promise<ICart> {
//   const { data: cart, error } = await supabase.from("cart_items").select(
//     `
//         id,
//         cart_id,
//         quantity,
//         products:products(
//         id,
//         title,
//         price,
//         quality,
//         category:categories(category_name)
//         )
//         `
//   )
//   if (error) {
//     console.error(error)
//   }
//   console.log(cart)
//   return cart as unknown as ICart
// }

// export async function getCategory(): Promise<ICategory> {
//   const { data: category, error } = await supabase.from("categories").select(`
//         category_name,
//         id,
//         products_table:products(*)
//         `)

//   if (error) {
//     console.error(error)
//   }
//   console.log(category)
//   return category as unknown as ICategory
// }
