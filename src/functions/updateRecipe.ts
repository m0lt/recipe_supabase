//? Funktion zum Aktualisieren eines Rezepts mit Zutaten

import supabase from "../utils/supabase"
import type { IRecipe } from "../interfaces/IRecipe"
import type { ICreateRecipeData } from "./createRecipe"

//? Diese Funktion aktualisiert ein bestehendes Rezept mit Zutaten
//? recipeId: Die ID des zu aktualisierenden Rezepts
//? recipeData: Die neuen Rezept-Daten
//? Return: Das aktualisierte Rezept mit ID oder null bei Fehler
export async function updateRecipe(recipeId: string, recipeData: ICreateRecipeData): Promise<IRecipe | null> {
  //? SCHRITT 1: Hole den aktuell eingeloggten User
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User wurde nicht gefunden - Login erforderlich")
    return null
  }

  //? SCHRITT 2: Prüfe ob das Rezept dem User gehört
  const { data: existingRecipe, error: checkError } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .single()

  if (checkError || !existingRecipe) {
    console.error("❌ Rezept wurde nicht gefunden:", checkError)
    return null
  }

  if (existingRecipe.user_id !== user.id) {
    console.error("❌ Du darfst nur deine eigenen Rezepte bearbeiten!")
    return null
  }

  //? SCHRITT 3: Aktualisiere das Rezept in der recipes Tabelle
  const { data: updatedRecipe, error: recipeError } = await supabase
    .from("recipes")
    .update({
      name: recipeData.name,
      description: recipeData.description,
      servings: recipeData.servings,
      instructions: recipeData.instructions,
      image_url: recipeData.image_url,
      additional_info: recipeData.additional_info,
      category_id: recipeData.category_id,
    })
    .eq("id", recipeId)
    .select()
    .single()

  if (recipeError || !updatedRecipe) {
    console.error("❌ Fehler beim Aktualisieren des Rezepts:", recipeError)
    return null
  }

  console.log("✅ Rezept aktualisiert:", updatedRecipe)

  //? SCHRITT 4: Lösche alle alten Zutaten
  const { error: deleteIngredientsError } = await supabase.from("ingredients").delete().eq("recipe_id", recipeId)

  if (deleteIngredientsError) {
    console.error("❌ Fehler beim Löschen der alten Zutaten:", deleteIngredientsError)
    return null
  }

  //? SCHRITT 5: Erstelle die neuen Zutaten
  const ingredientsToInsert = recipeData.ingredients.map((ingredient) => ({
    recipe_id: recipeId,
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
    console.error("❌ Fehler beim Erstellen der neuen Zutaten:", ingredientsError)
    return null
  }

  console.log("✅ Zutaten aktualisiert:", newIngredients)

  //? SCHRITT 6: Gib das vollständige Rezept mit Zutaten zurück
  return {
    ...updatedRecipe,
    ingredients: newIngredients,
  } as IRecipe
}
