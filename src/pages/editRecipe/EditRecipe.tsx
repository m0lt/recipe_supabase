import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { getRecipeById } from "../../functions/getRecipe"
import type { IRecipe } from "../../interfaces/IRecipe"
import RecipeForm from "../../components/recipeForm/RecipeForm"

//? Page zum Bearbeiten eines bestehenden Rezepts
//? Nur für den Ersteller des Rezepts zugänglich
export default function EditRecipe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<IRecipe | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  //? Lade das Rezept beim Start
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Keine Rezept-ID angegeben")
        setLoading(false)
        return
      }

      setLoading(true)
      const fetchedRecipe = await getRecipeById(id)

      if (!fetchedRecipe) {
        setError("Rezept wurde nicht gefunden")
        setLoading(false)
        return
      }

      setRecipe(fetchedRecipe)
      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Rezept wird geladen...</p>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{error || "Rezept nicht gefunden"}</p>
        <Link to="/" className="text-yellow-600 hover:text-yellow-700 underline">
          Zurück zur Startseite
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="container mx-auto max-w-4xl">
        <RecipeForm existingRecipe={recipe} />
      </div>
    </div>
  )
}
