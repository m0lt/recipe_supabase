import type { ICategory } from "../interfaces/ICategory"
import supabase from "../utils/supabase"

//todo unklar ob das laden hier noch funktioniert ich glaube im select stimmen die felder nicht genau?
export async function getCategory(): Promise<ICategory> {
  const { data: category, error } = await supabase.from("categories").select(`
        name,
        id,
        recipes_table:recipes(*)
        `)

  if (error) {
    console.error(error)
  }

  return category as unknown as ICategory
}
