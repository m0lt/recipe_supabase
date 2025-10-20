import type { ICategory } from "../interfaces/ICategory"
import supabase from "../utils/supabase"

//? Diese Funktion holt ALLE Kategorien aus der Datenbank
export async function getCategories(): Promise<ICategory[]> {
  const { data: categories, error } = await supabase.from("categories").select("id, name, created_at").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories as ICategory[]
}
