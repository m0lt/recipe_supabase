export interface IIngredient {
  id: string
  recipe_id: string
  name: string
  quantity: number | null
  unit: string | null
  additional_info?: string | null
  created_at: string
}
