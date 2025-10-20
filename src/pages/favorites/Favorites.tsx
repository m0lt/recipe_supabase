import { useContext, useEffect } from "react"
import supabase from "../../utils/supabase"
import { Link } from "react-router"
import { mainContext } from "../../context/MainProvider"
import type { IUser } from "../../interfaces/IUser"
import type { IFavorites } from "../../interfaces/IFavorites"
import { getFavorites } from "../../functions/getFavorites"

interface IFavoriteProps {
  user: IUser
  favorites: IFavorites[]
  //? setFavorites ist eine State-Setter-Funktion um die Favoriten-Liste zu aktualisieren
  setFavorites: React.Dispatch<React.SetStateAction<IFavorites[] | unknown>>
}

//? WICHTIG: Komponentenname muss mit Großbuchstaben beginnen!
export default function Favorites() {
  const { user, favorites, setFavorites } = useContext(mainContext) as IFavoriteProps

  console.log("Current user:", user)
  console.log("Current favorites:", favorites)

  //? Beim ersten Laden der Komponente werden die Favoriten vom Server geholt
  useEffect(() => {
    const fetchFavorites = async () => {
      //? user?.id wird verwendet um nur die Favoriten des eingeloggten Users zu holen
      if (user?.id) {
        const result = await getFavorites(user.id)
        console.log("Fetched favorites:", result)
        setFavorites(result)
      }
    }
    fetchFavorites()
  }, [])

  //? Diese Funktion entfernt ein Rezept aus den Favoriten
  const removeItem = async (favoriteItemId: number) => {
    //? WICHTIG: Wir löschen aus "favorite_items" (nicht cart_items!)
    await supabase.from("favorite_items").delete().eq("id", favoriteItemId)

    //? Nach dem Löschen holen wir die aktualisierte Liste vom Server
    if (user?.id) {
      const updatedFavorites = await getFavorites(user.id)
      setFavorites(updatedFavorites as IFavorites[])
    }
  }

  //? Wenn keine Favoriten vorhanden sind, zeige eine leere Nachricht
  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
            Your Favorite Recipes
          </h2>
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-4">You haven't added any favorite recipes yet.</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  //? Wenn Favoriten vorhanden sind, zeige sie als Liste an
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
          Your Favorite Recipes
        </h2>

        <div className="space-y-4">
          {favorites.map((favoriteItem: IFavorites) => (
            <div
              key={favoriteItem.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition-all duration-200">
              <div className="flex-1">
                {/*? Rezeptname anzeigen - anklickbar als Link zur Detailseite */}
                <Link to={`/recipe/${favoriteItem?.recipes?.id}`}>
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-2 cursor-pointer">
                    {favoriteItem?.recipes?.name || "Unnamed Recipe"}
                  </h3>
                </Link>

                {/*? Beschreibung anzeigen */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {favoriteItem?.recipes?.description || "No description available"}
                </p>

                {/*? Portionen anzeigen */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Servings: <span className="font-medium">{favoriteItem?.recipes?.servings || "N/A"}</span>
                </p>
              </div>

              <div className="flex gap-2">
                {/*? Button zur Detailseite */}
                <Link
                  to={`/recipe/${favoriteItem?.recipes?.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200">
                  View
                </Link>

                {/*? Button zum Entfernen aus den Favoriten */}
                <button
                  onClick={() => removeItem(favoriteItem.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-5 text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200">
            Browse More Recipes
          </Link>
        </div>
      </div>
    </div>
  )
}
