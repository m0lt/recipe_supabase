//? IRecipe Interface definiert die Struktur eines Rezepts
export interface IRecipe {
  id: string
  name: string
  description: string
  servings: number
  //? instructions enthält die Zubereitungsschritte (z.B. als JSON-String oder Markdown)
  instructions: string
  //? ingredients enthält die Zutatenliste (z.B. als JSON-String oder Array)
  ingredients?: string
  //? image_url ist die URL zum Rezept-Bild für den Hero-Bereich
  image_url?: string
  //? additional_info enthält optionale zusätzliche Informationen zum Rezept
  additional_info?: string
  category_id: string
  created_at: string
}
