//? Funktionen zum Hinzufügen und Entfernen von Favoriten

import supabase from "../utils/supabase"

//? Prüft ob ein Rezept bereits in den Favoriten eines Users ist
//? userId: Die ID des eingeloggten Users
//? recipeId: Die ID des Rezepts
//? Return: true wenn das Rezept in den Favoriten ist, sonst false
export const checkIfFavorite = async (userId: string, recipeId: string): Promise<boolean> => {
  console.log("🔍 checkIfFavorite called:", { userId, recipeId })

  //? SCHRITT 1: Hole die Favoriten-Liste des Users
  //? WICHTIG: Die Spalte heißt "user_id" nicht "customer_id"!
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .single()

  console.log("📋 Favorites list result:", { favorites, favoritesError })

  if (favoritesError || !favorites) {
    console.log("❌ No favorites list found")
    return false
  }

  //? SCHRITT 2: Prüfe ob das Rezept in der favorite_items Tabelle existiert
  //? WICHTIG: Die Spalte heißt "recipe_id" nicht "recipes_id"!
  const { data: favoriteItem, error: itemError } = await supabase
    .from("favorite_items")
    .select("id")
    .eq("favorite_id", favorites.id)
    .eq("recipe_id", recipeId)
    .single()

  console.log("🔎 Favorite item result:", { favoriteItem, itemError })

  if (itemError || !favoriteItem) {
    console.log("❌ Recipe not in favorites")
    return false
  }

  console.log("✅ Recipe is in favorites")
  return true
}

//? Fügt ein Rezept zu den Favoriten eines Users hinzu
//? userId: Die ID des eingeloggten Users
//? recipeId: Die ID des Rezepts das hinzugefügt werden soll
//? Return: true bei Erfolg, false bei Fehler
export const addToFavorites = async (userId: string, recipeId: string): Promise<boolean> => {
  try {
    console.log("➕ addToFavorites called:", { userId, recipeId })

    //? SCHRITT 1: Hole oder erstelle die Favoriten-Liste des Users
    //? WICHTIG: Die Spalte heißt "user_id" nicht "customer_id"!
    let { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .single()

    console.log("📋 Existing favorites list:", { favorites, favoritesError })

    //? Falls der User noch keine Favoriten-Liste hat, erstelle eine neue
    if (favoritesError || !favorites) {
      console.log("🆕 Creating new favorites list")
      const { data: newFavorites, error: createError } = await supabase
        .from("favorites")
        .insert({ user_id: userId })
        .select("id")
        .single()

      console.log("📝 New favorites list result:", { newFavorites, createError })

      if (createError || !newFavorites) {
        console.error("❌ Error creating favorites list:", createError)
        return false
      }

      favorites = newFavorites
    }

    //? SCHRITT 2: Prüfe ob das Rezept bereits in den Favoriten ist
    const alreadyFavorite = await checkIfFavorite(userId, recipeId)
    if (alreadyFavorite) {
      console.log("ℹ️ Recipe is already in favorites")
      return true
    }

    //? SCHRITT 3: Füge das Rezept zu den favorite_items hinzu
    //? WICHTIG: Die Spalte heißt "recipe_id" nicht "recipes_id"!
    console.log("💾 Inserting into favorite_items:", { favorite_id: favorites.id, recipe_id: recipeId })
    const { error: insertError } = await supabase
      .from("favorite_items")
      .insert({
        favorite_id: favorites.id,
        recipe_id: recipeId,
      })

    console.log("📥 Insert result:", { insertError })

    if (insertError) {
      console.error("❌ Error adding to favorites:", insertError)
      return false
    }

    console.log("✅ Successfully added to favorites")
    return true
  } catch (error) {
    console.error("❌ Error in addToFavorites:", error)
    return false
  }
}

//? Entfernt ein Rezept aus den Favoriten eines Users
//? userId: Die ID des eingeloggten Users
//? recipeId: Die ID des Rezepts das entfernt werden soll
//? Return: true bei Erfolg, false bei Fehler
export const removeFromFavorites = async (userId: string, recipeId: string): Promise<boolean> => {
  try {
    //? SCHRITT 1: Hole die Favoriten-Liste des Users
    //? WICHTIG: Die Spalte heißt "user_id" nicht "customer_id"!
    const { data: favorites, error: favoritesError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (favoritesError || !favorites) {
      console.error("No favorites list found")
      return false
    }

    //? SCHRITT 2: Lösche das Rezept aus den favorite_items
    //? WICHTIG: Die Spalte heißt "recipe_id" nicht "recipes_id"!
    const { error: deleteError } = await supabase
      .from("favorite_items")
      .delete()
      .eq("favorite_id", favorites.id)
      .eq("recipe_id", recipeId)

    if (deleteError) {
      console.error("Error removing from favorites:", deleteError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in removeFromFavorites:", error)
    return false
  }
}
