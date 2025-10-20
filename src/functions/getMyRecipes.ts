import type { IRecipe } from "../interfaces/IRecipe"
import supabase from "../utils/supabase"

//? Diese Funktion holt ALLE Rezepte des aktuell eingeloggten Users
export async function getMyRecipes(): Promise<IRecipe[]> {
  //? Hole den aktuell eingeloggten User
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User wurde nicht gefunden")
    return []
  }

  //? Hole alle Rezepte des Users mit Kategorien und Zutaten
  const { data: recipes, error } = await supabase
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
        created_at,
        category_id,
        user_id,
        category:categories(name),
        ingredients:ingredients(id, recipe_id, name, quantity, unit, additional_info, created_at)
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching my recipes:", error)
    return []
  }

  console.log("📋 Meine Rezepte:", recipes)
  return recipes as unknown as IRecipe[]
}
