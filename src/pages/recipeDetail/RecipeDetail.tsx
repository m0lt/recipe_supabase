import { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
import type { IRecipe } from "../../interfaces/IRecipe"
import { getRecipeById } from "../../functions/getRecipe"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import { addToFavorites, removeFromFavorites, checkIfFavorite } from "../../functions/addToFavorites"
import { deleteRecipe } from "../../functions/deleteRecipe"

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
    //? Scrolle nach oben wenn Rezept geladen wird
    window.scrollTo({ top: 0, behavior: 'smooth' })

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

  //? Handler-Funktion zum Löschen des Rezepts
  const handleDelete = async () => {
    if (!id) return

    const success = await deleteRecipe(id)
    if (success) {
      //? Redirect zur Home-Seite nach erfolgreichem Löschen
      navigate("/")
    } else {
      alert("Fehler beim Löschen des Rezepts!")
    }
  }

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
        <Link to="/" className="text-yellow-500 hover:text-yellow-600 underline">
          Back to Home
        </Link>
      </div>
    )
  }

  //? Parse die Zubereitungsschritte
  const instructions = parseInstructions(recipe.instructions)
  //? Zutaten kommen direkt aus der DB als strukturiertes Array
  const ingredients = recipe.ingredients || []

  //? DEBUG: Zeige Rezeptbild-URL in der Console
  console.log("📸 Recipe image_url:", recipe.image_url)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/*? Hero-Bereich mit Rezept-Bild und Titel */}
      <div
        className="relative h-80 bg-cover bg-center flex items-center justify-center bg-gray-800"
        style={{
          backgroundImage: recipe.image_url
            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${recipe.image_url})`
            : `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/lily-banse--YHSwy6uqvk-unsplash.jpg')`,
        }}>
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
        {/*? Ersteller-Info mit Profilbild */}
        {(recipe.user?.username || recipe.created_at) && (
          <div className="mb-6 flex items-center justify-between">
            {recipe.user?.username && (
              <div className="flex items-center gap-3">
                {/*? Profilbild des Erstellers */}
                <img
                  src={recipe.user.img_url || "https://via.placeholder.com/48"}
                  alt={recipe.user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Erstellt von</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{recipe.user.username}</p>
                </div>
              </div>
            )}
            {recipe.created_at && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(recipe.created_at).toLocaleDateString("de-DE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        )}

        {/*? Edit/Delete Buttons - nur für eigene Rezepte */}
        {user?.id && recipe.user_id === user.id && (
          <div className="mb-6 flex gap-4">
            <Link
              to={`/edit-recipe/${recipe.id}`}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors">
              Rezept bearbeiten
            </Link>
            <button
              onClick={() => {
                if (confirm("Möchtest du dieses Rezept wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
                  handleDelete()
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Löschen
            </button>
          </div>
        )}

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
            <div className="bg-yellow-100 dark:bg-yellow-800 px-4 py-2 rounded-lg">
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                Für {recipe.servings || "N/A"} Portionen
              </p>
            </div>
          </div>
          {ingredients.length > 0 ? (
            <ul className="space-y-2">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {ingredient.quantity && ingredient.unit
                      ? `${ingredient.quantity} ${ingredient.unit} `
                      : ingredient.quantity
                        ? `${ingredient.quantity} `
                        : ""}
                    <strong>{ingredient.name}</strong>
                    {ingredient.additional_info && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({ingredient.additional_info})</span>
                    )}
                  </span>
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
                  <span className="text-yellow-500 font-bold mr-3 text-lg">{index + 1}.</span>
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
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200">
            Back to Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
