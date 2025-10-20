import { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
import type { IRecipe } from "../../interfaces/IRecipe"
import { getRecipeById } from "../../functions/getRecipe"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "../../functions/addToFavorites"

export default function RecipeDetail() {
  //? useParams() holt die Parameter aus der URL (z.B. /recipe/:id)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  //? Hole User-Infos aus dem Context um zu prüfen ob der User eingeloggt ist
  const { user, isLoggedIn } = useContext(mainContext) as MainContextProps

  //? State für das geladene Rezept
  const [recipe, setRecipe] = useState<IRecipe | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  //? State für Favoriten-Status
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false)

  //? Beim ersten Laden der Komponente wird das Rezept anhand der ID geladen
  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        setLoading(true)
        const fetchedRecipe = await getRecipeById(id)
        setRecipe(fetchedRecipe)
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id])

  //? Prüfe ob das Rezept in den Favoriten ist (nur wenn User eingeloggt ist)
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.id && id) {
        const favorite = await checkIfFavorite(user.id, id)
        setIsFavorite(favorite)
      }
    }
    checkFavoriteStatus()
  }, [user, id])

  //? Handler-Funktion zum Hinzufügen/Entfernen von Favoriten
  const handleToggleFavorite = async () => {
    //? Wenn User nicht eingeloggt ist, zur Login-Seite navigieren
    if (!isLoggedIn || !user?.id) {
      navigate("/login")
      return
    }

    if (!id) return

    setFavoriteLoading(true)

    if (isFavorite) {
      //? Entferne aus Favoriten
      const success = await removeFromFavorites(user.id, id)
      if (success) {
        setIsFavorite(false)
      }
    } else {
      //? Füge zu Favoriten hinzu
      const success = await addToFavorites(user.id, id)
      if (success) {
        setIsFavorite(true)
      }
    }

    setFavoriteLoading(false)
  }

  //? Hilfsfunktion um Zutaten-String in ein Array zu konvertieren
  //? Erwartet einen String mit Zeilen-Trennung oder JSON-Array
  const parseIngredients = (ingredients: string | undefined): string[] => {
    if (!ingredients) return []

    try {
      //? Versuche als JSON zu parsen (falls ingredients als JSON-Array gespeichert ist)
      return JSON.parse(ingredients)
    } catch {
      //? Falls kein JSON, teile am Zeilenumbruch
      return ingredients.split('\n').filter(line => line.trim() !== '')
    }
  }

  //? Hilfsfunktion um Zubereitungsschritte in ein Array zu konvertieren
  //? Erwartet einen String mit Zeilen-Trennung oder JSON-Array
  const parseInstructions = (instructions: string | undefined): string[] => {
    if (!instructions) return []

    try {
      //? Versuche als JSON zu parsen
      return JSON.parse(instructions)
    } catch {
      //? Falls kein JSON, teile am Zeilenumbruch und nummeriere
      return instructions.split('\n').filter(line => line.trim() !== '')
    }
  }

  //? Zeige einen Ladeindikator während das Rezept geladen wird
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading recipe...</p>
      </div>
    )
  }

  //? Wenn kein Rezept gefunden wurde, zeige eine Fehlermeldung
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Recipe not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 underline">
          Back to Home
        </Link>
      </div>
    )
  }

  //? Parse die Zutaten und Zubereitungsschritte
  const ingredients = parseIngredients(recipe.ingredients)
  const instructions = parseInstructions(recipe.instructions)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/*? Hero-Bereich mit Rezept-Bild und Titel */}
      <div
        className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: recipe.image_url
            ? `url(${recipe.image_url})`
            : `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/lily-banse--YHSwy6uqvk-unsplash.jpg')`,
        }}>
        {/*? Dunkler Overlay für bessere Lesbarkeit */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <h1 className="relative text-5xl font-bold text-white z-10">{recipe.name}</h1>

        {/*? Add to Favorites Button - positioniert in der rechten oberen Ecke */}
        <button
          onClick={handleToggleFavorite}
          disabled={favoriteLoading}
          className={`absolute top-6 right-6 z-20 flex items-center gap-2 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {/*? Herz-Icon (Unicode) */}
          <span className="text-xl">{isFavorite ? "❤️" : "🤍"}</span>
          {/*? Button-Text je nach Status */}
          <span className="hidden sm:inline">
            {favoriteLoading
              ? "Loading..."
              : isFavorite
                ? "Remove from Favorites"
                : isLoggedIn
                  ? "Add to Favorites"
                  : "Login to Save"}
          </span>
        </button>
      </div>

      {/*? Hauptinhalt */}
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/*? Beschreibung */}
        {recipe.description && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{recipe.description}</p>
          </div>
        )}

        {/*? Zutaten-Sektion */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Zutaten</h2>
            {/*? Portionen-Anzeige direkt bei den Zutaten, da sie angibt für wie viele Portionen die Mengen sind */}
            <div className="bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-lg">
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Für {recipe.servings || "N/A"} Portionen
              </p>
            </div>
          </div>
          {ingredients.length > 0 ? (
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No ingredients available</p>
          )}
        </section>

        {/*? Zubereitung-Sektion */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Zubereitung</h2>
          {instructions.length > 0 ? (
            <ol className="space-y-4">
              {instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3 text-lg">{index + 1}.</span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No instructions available</p>
          )}
        </section>

        {/*? Zusätzliche Informationen (falls vorhanden) */}
        {recipe.additional_info && (
          <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Zusätzliche Informationen
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recipe.additional_info}</p>
          </section>
        )}

        {/*? Navigation zurück zur Home-Seite */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
            Back to Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
