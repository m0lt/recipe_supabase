//? IRecipe Interface definiert die Struktur eines Rezepts
import type { IIngredient } from "./IIngredients"

export interface IRecipe {
  id: string
  name: string
  description: string
  servings: number
  //? instructions enthält die Zubereitungsschritte (z.B. als JSON-String oder Markdown)
  instructions: string
  //? ingredients enthält die Zutatenliste aus der ingredients Tabelle
  ingredients?: IIngredient[]
  //? image_url ist die URL zum Rezept-Bild für den Hero-Bereich
  image_url?: string
  //? additional_info enthält optionale zusätzliche Informationen zum Rezept
  additional_info?: string
  category_id: string
  created_at: string
  //? user_id ist die ID des Users der das Rezept erstellt hat (optional für alte Rezepte)
  user_id?: string
  //? user enthält die User-Informationen des Erstellers (JOIN mit users Tabelle)
  user?: {
    username: string
    img_url?: string
  }
}
