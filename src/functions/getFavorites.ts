//! Neu - Getter-Funktion für die Favoriten eines Users

import type { IFavorites } from "../interfaces/IFavorites"
import supabase from "../utils/supabase"

//? Diese Funktion holt alle Favoriten-Rezepte eines Users aus der Datenbank
//? userId: Die ID des eingeloggten Users
//? Return: Ein Array von IFavorites-Objekten (jedes enthält ein Rezept)
export const getFavorites = async (userId: string | undefined): Promise<IFavorites[] | unknown> => {
  console.log("📖 getFavorites called with userId:", userId)

  //? SCHRITT 1: Hole die Favoriten-Liste des Users aus der "favorites" Tabelle
  //? Die "favorites" Tabelle enthält eine Liste pro User (verknüpft über user_id)
  //? WICHTIG: Die Spalte heißt "user_id" nicht "customer_id"!
  //? .single() wird verwendet, weil jeder User nur EINE Favoriten-Liste hat
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .single()

  console.log("📋 Favorites list:", { favorites, favoritesError })

  if (favoritesError) {
    console.error("❌ Error fetching favorites list:", favoritesError)
    return []
  }

  //? SCHRITT 2: Hole alle Favoriten-Items (Rezepte) aus der "favorite_items" Tabelle
  //? Die "favorite_items" Tabelle enthält die einzelnen Rezepte dieser Favoriten-Liste
  //? "recipes:recipe_id(*)" ist eine Supabase-Query die das verknüpfte Rezept mit allen Feldern holt
  //? WICHTIG: Die Spalte heißt "recipe_id" nicht "recipes_id"!
  const { data: items, error: itemsError } = await supabase
    .from("favorite_items")
    .select("id, favorite_id, recipe_id, recipes:recipe_id(*)")
    .eq("favorite_id", favorites?.id)

  console.log("📦 Favorite items:", { items, itemsError })
  console.log("📦 Full items data:", JSON.stringify(items, null, 2))

  if (itemsError) {
    console.error("❌ Error fetching favorite items:", itemsError)
    return []
  }

  return items || []
}

//? V1

// export async function getFavorites(): Promise<IFavorites> {
//   const { data: favorites, error } = await supabase.from("favorite_items").select(
//     `
//         id,
//         favorites_id,
//         recipes:recipes(
//         id,
//         name,
//         description,
//         servings,
//         instructions,
//         category:categories(category_name)
//         )
//         `
//   )
//   if (error) {
//     console.error(error)
//   }

//   return favorites as unknown as IFavorites
// }
