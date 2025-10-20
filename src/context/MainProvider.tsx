import { createContext, useEffect, useState } from "react"
import type { IRecipe } from "../interfaces/IRecipe"
//todo wir hatten das vorher "getProductStore" genannt, statt "getRecipesWithCategory" warum?
import { getRecipesWithCategory } from "../functions/getRecipe"
import type { IFavorites } from "../interfaces/IFavorites"
import type { IUser } from "../interfaces/IUser"
// import { getFavorites, getFavoritesV2 } from "../functions/getFavorites"
import { getCategory } from "../functions/getCategory"
import supabase from "../utils/supabase"
import { getFavorites } from "../functions/getFavorites"

export interface MainContextProps {
  recipes: IRecipe[]
  //! NEU - Favoriten(Liste) in den Main Provider Props ergänzt
  //todo warum wird das alles so typisiert?
  favorites: IFavorites[] | null | undefined | unknown
  setFavorites: React.Dispatch<React.SetStateAction<IFavorites[] | null | unknown>>
  //! NEU - User auch ergänzt
  user: IUser | null
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
}

export const mainContext = createContext<MainContextProps | null>(null)

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  //! Neu Favorites useState ergänzen
  const [favorites, setFavorites] = useState<IFavorites[] | null | unknown>([])
  //! NEW - User, LoggedIn und loading useState ergänzt, werden durch zweiten useEffeect verwendet
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    //Das ist doch unserer Hilfsfunktion um async in useEffect zu verwenden?
    const getDataInUseEffect = async () => {
      //
      const recipesFromFunction = await getRecipesWithCategory()
      console.log(recipesFromFunction)
      setRecipes(recipesFromFunction)
      //todo Muss hier die userID übergeben werden??
      await getFavorites()
      await getCategory()
    }
    getDataInUseEffect()
  }, [])

  //!Neu - wir holen einmalig den gespeicherten Zustand (z.B beim Reload) oder einlogen
  useEffect(() => {
    // supabase prüft ob im Browser eine gültige Session gespeichert ist,
    // wenn ja => liefert sie den eingeloggte User zurück
    // wenn nein => User = null

    const checkSession = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getSession()
      console.log(data)
      const session = data?.session
      if (session?.user) {
        setUser(session?.user as unknown as IUser)
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
      setLoading(false)
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log(_event);
      // console.log(session);
      setUser((session?.user as unknown as IUser) || null)
      setIsLoggedIn(!!session?.user)
      setLoading(false)
    })
    // console.log(subscription);

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  //! Neu - Alle neuen props werden übergeben
  return (
    <mainContext.Provider
      value={{ recipes, favorites, setFavorites, user, setUser, isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </mainContext.Provider>
  )
}
