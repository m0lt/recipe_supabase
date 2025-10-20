//? Funktion zum Erstellen eines neuen Rezepts mit Zutaten

import supabase from "../utils/supabase"
import type { IRecipe } from "../interfaces/IRecipe"

//? Interface für die Eingabedaten beim Erstellen eines Rezepts
export interface ICreateRecipeData {
  name: string
  description: string
  servings: number
  instructions: string
  image_url?: string
  additional_info?: string
  category_id: string
  ingredients: {
    name: string
    quantity?: number
    unit?: string
    additional_info?: string
  }[]
}

//? Diese Funktion erstellt ein neues Rezept mit Zutaten
//? recipeData: Die Rezept-Daten (ohne user_id, wird automatisch gesetzt)
//? Return: Das erstellte Rezept mit ID oder null bei Fehler
export async function createRecipe(recipeData: ICreateRecipeData): Promise<IRecipe | null> {
  //? SCHRITT 1: Hole den aktuell eingeloggten User
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User wurde nicht gefunden - Login erforderlich")
    return null
  }

  //? SCHRITT 2: Erstelle das Rezept in der recipes Tabelle
  //? user_id wird automatisch gesetzt
  const { data: newRecipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      name: recipeData.name,
      description: recipeData.description,
      servings: recipeData.servings,
      instructions: recipeData.instructions,
      image_url: recipeData.image_url,
      additional_info: recipeData.additional_info,
      category_id: recipeData.category_id,
      user_id: user.id, //? Setze den aktuellen User als Ersteller
    })
    .select()
    .single()

  if (recipeError || !newRecipe) {
    console.error("❌ Fehler beim Erstellen des Rezepts:", recipeError)
    return null
  }

  console.log("✅ Rezept erstellt:", newRecipe)

  //? SCHRITT 3: Erstelle die Zutaten in der ingredients Tabelle
  //? Füge allen Zutaten die recipe_id hinzu
  const ingredientsToInsert = recipeData.ingredients.map((ingredient) => ({
    recipe_id: newRecipe.id,
    name: ingredient.name,
    quantity: ingredient.quantity || null,
    unit: ingredient.unit || null,
    additional_info: ingredient.additional_info || null,
  }))

  const { data: newIngredients, error: ingredientsError } = await supabase
    .from("ingredients")
    .insert(ingredientsToInsert)
    .select()

  if (ingredientsError) {
    console.error("❌ Fehler beim Erstellen der Zutaten:", ingredientsError)
    //? Wenn die Zutaten nicht erstellt werden konnten, sollten wir das Rezept löschen
    //? um inkonsistente Daten zu vermeiden (Rollback)
    await supabase.from("recipes").delete().eq("id", newRecipe.id)
    return null
  }

  console.log("✅ Zutaten erstellt:", newIngredients)

  //? SCHRITT 4: Gib das vollständige Rezept mit Zutaten zurück
  return {
    ...newRecipe,
    ingredients: newIngredients,
  } as IRecipe
}
