//! New:
import type { IRecipe } from "./IRecipe"

//todo sollte das lieber FavoriteList heißen oder so?
export interface IFavorites {
  id: number
  favorite_id: number
  recipes: IRecipe
}
