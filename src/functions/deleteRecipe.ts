//? Funktion zum Löschen eines Rezepts mit allen Zutaten

import supabase from "../utils/supabase"

//? Diese Funktion löscht ein Rezept und alle zugehörigen Zutaten
//? recipeId: Die ID des zu löschenden Rezepts
//? Return: true bei Erfolg, false bei Fehler
export async function deleteRecipe(recipeId: string): Promise<boolean> {
  //? SCHRITT 1: Hole den aktuell eingeloggten User
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User wurde nicht gefunden - Login erforderlich")
    return false
  }

  //? SCHRITT 2: Prüfe ob das Rezept dem User gehört
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .single()

  if (recipeError || !recipe) {
    console.error("❌ Rezept wurde nicht gefunden:", recipeError)
    return false
  }

  if (recipe.user_id !== user.id) {
    console.error("❌ Du darfst nur deine eigenen Rezepte löschen!")
    return false
  }

  //? SCHRITT 3: Lösche alle Zutaten des Rezepts
  //? Die RLS Policy sollte das erlauben, da wir Owner des Rezepts sind
  const { error: ingredientsError } = await supabase.from("ingredients").delete().eq("recipe_id", recipeId)

  if (ingredientsError) {
    console.error("❌ Fehler beim Löschen der Zutaten:", ingredientsError)
    return false
  }

  //? SCHRITT 4: Lösche das Rezept
  const { error: deleteError } = await supabase.from("recipes").delete().eq("id", recipeId)

  if (deleteError) {
    console.error("❌ Fehler beim Löschen des Rezepts:", deleteError)
    return false
  }

  console.log("✅ Rezept erfolgreich gelöscht:", recipeId)
  return true
}
