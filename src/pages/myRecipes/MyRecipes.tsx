import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { getMyRecipes } from "../../functions/getMyRecipes"
import { deleteRecipe } from "../../functions/deleteRecipe"
import type { IRecipe } from "../../interfaces/IRecipe"

export default function MyRecipes() {
  const navigate = useNavigate()
  const [myRecipes, setMyRecipes] = useState<IRecipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  //? Lade eigene Rezepte beim Start
  const fetchMyRecipes = async () => {
    setLoading(true)
    const recipes = await getMyRecipes()
    setMyRecipes(recipes)
    setLoading(false)
  }

  useEffect(() => {
    fetchMyRecipes()
  }, [])

  //? Handler zum Löschen eines Rezepts
  const handleDelete = async (recipeId: string, recipeName: string) => {
    if (confirm(`Möchtest du "${recipeName}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      const success = await deleteRecipe(recipeId)
      if (success) {
        //? Entferne das Rezept aus der Liste ohne neu zu laden
        setMyRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
      } else {
        alert("Fehler beim Löschen des Rezepts!")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Lade deine Rezepte...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Meine Rezepte</h1>
          <Link
            to="/create-recipe"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            + Neues Rezept
          </Link>
        </div>

        {myRecipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">Du hast noch keine Rezepte erstellt.</p>
            <Link
              to="/create-recipe"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Erstes Rezept erstellen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                {/*? Bild */}
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="h-40 bg-gray-300">
                    <img
                      src={recipe.image_url || "/placeholder-recipe.jpg"}
                      alt={recipe.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/*? Content */}
                <div className="p-6">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors cursor-pointer">
                      {recipe.name}
                    </h3>
                  </Link>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                  {/*? Datum */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Erstellt am{" "}
                    {new Date(recipe.created_at).toLocaleDateString("de-DE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/*? Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors">
                      Ansehen
                    </Link>
                    <Link
                      to={`/edit-recipe/${recipe.id}`}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black text-center font-semibold py-2 px-4 rounded-lg transition-colors">
                      Bearbeiten
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id, recipe.name)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
