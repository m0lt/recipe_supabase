import type { IRecipe } from "../interfaces/IRecipe"
import supabase from "../utils/supabase"

//? Diese Funktion holt ALLE Rezepte mit ihren Kategorien und Zutaten aus der Datenbank
export async function getRecipesWithCategory(): Promise<IRecipe[]> {
  const { data: recipes, error } = await supabase.from("recipes").select(
    `
        id,
        name,
        description,
        servings,
        instructions,
        image_url,
        additional_info,
        created_at,
        category:categories(name),
        ingredients:ingredients(id, recipe_id, name, quantity, unit, additional_info, created_at)
      `
  )

  if (error) {
    console.error("Error fetching recipes:", error)
    return []
  }

  console.log(recipes)
  return recipes as unknown as IRecipe[]
}

//? Diese Funktion holt EIN EINZELNES Rezept anhand der ID
//? recipeId: Die ID des Rezepts das geladen werden soll
//? Return: Ein einzelnes IRecipe-Objekt oder null wenn nicht gefunden
export async function getRecipeById(recipeId: string): Promise<IRecipe | null> {
  //? Hole das Rezept mit allen Feldern inklusive Kategorie-Informationen, Zutaten und User-Info
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      `
        id,
        name,
        description,
        servings,
        instructions,
        image_url,
        additional_info,
        category_id,
        created_at,
        user_id,
        category:categories(name),
        ingredients:ingredients(id, recipe_id, name, quantity, unit, additional_info, created_at),
        user:users(username, img_url)
      `
    )
    .eq("id", recipeId)
    .single()

  if (error) {
    console.error("Error fetching recipe by ID:", error)
    return null
  }

  return recipe as unknown as IRecipe
}
