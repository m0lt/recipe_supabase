import { createContext, useEffect, useState } from "react"
import type { IRecipe } from "../interfaces/IRecipe"
import { getRecipesWithCategory } from "../functions/getRecipe"

export interface MainContextProps {
  recipes: IRecipe[]
}

export const mainContext = createContext<MainContextProps | null>(null)

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<IRecipe[]>([])

  useEffect(() => {
    const getDataInUseEffect = async () => {
      const recipesFromFunction = await getRecipesWithCategory()
      console.log(recipesFromFunction)
      setRecipes(recipesFromFunction)
    }
    getDataInUseEffect()
  }, [])

  return <mainContext.Provider value={{ recipes }}>{children}</mainContext.Provider>
}
