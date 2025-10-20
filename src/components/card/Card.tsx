import { Link } from "react-router"
import type { IRecipe } from "../../interfaces/IRecipe"

interface CardProps {
  recipe: IRecipe
}

//? Card-Komponente zeigt eine einzelne Rezept-Karte mit Bild, Name, Beschreibung und Link zur Detailseite
export default function Card({ recipe }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-sm hover:shadow-xl transition-shadow duration-200">
      {/*? Bild-Bereich - anklickbar und führt zur Detailseite */}
      <Link to={`/recipe/${recipe.id}`}>
        <div className="h-40 bg-gray-300">
          <img
            src={recipe.image_url || "/placeholder-recipe.jpg"}
            alt={recipe.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/*? Content-Bereich mit Rezeptinformationen */}
      <div className="p-6">
        {/*? Rezeptname - anklickbar als Link zur Detailseite */}
        <Link to={`/recipe/${recipe.id}`}>
          <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors cursor-pointer">
            {recipe.name}
          </h3>
        </Link>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {recipe.description}
        </p>

        {/*? Button zur Detailseite - jetzt als Link statt Button */}
        <Link
          to={`/recipe/${recipe.id}`}
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full transition-colors">
          Zum Rezept
        </Link>
      </div>
    </div>
  )
}
