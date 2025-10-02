import { useContext } from "react"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import type { IRecipe } from "../../interfaces/IRecipe"

export default function Home() {
  const { recipes } = useContext(mainContext) as MainContextProps

  console.log(recipes)

  return (
    <div>
      {recipes.map((recipe: IRecipe, index: number) => {
        return (
          <div key={index}>
            <h4>{recipe.name}</h4>
            <p>{recipe.description}</p>
            <small>Portionen: {recipe.servings}</small>
          </div>
        )
      })}
    </div>
  )
}
