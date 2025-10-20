import type { IRecipe } from "../../interfaces/IRecipe"
import Card from "./Card"

interface CardListProps {
  recipes: IRecipe[]
}

export default function CardList({ recipes }: CardListProps) {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Die beliebtesten Rezepte</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <Card key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
