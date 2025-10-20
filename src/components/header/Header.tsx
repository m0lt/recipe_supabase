import { useContext } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import supabase from "../../utils/supabase"

export default function Header() {
  //! NEU - Login functions

  // todo die logik muss ich noch verstehen
  const { isLoggedIn, setIsLoggedIn } = useContext(mainContext) as MainContextProps
  const navigate = useNavigate()

  const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log("Logout funktioniert nicht", error)
    }
    setIsLoggedIn(false)
    navigate("/")
  }

  //   return (
  //     <header>
  //       {/* Gelber oberer Strich */}
  //       <div className="h-6 bg-yellow-500"></div>

  //       {/* Hauptnavigation */}
  //       <div className="bg-white px-30 py-4">
  //         <nav className="flex items-center justify-between p">
  //           {/* Logo/Titel links */}
  //           <div className="flex items-center gap-2">
  //             {/*todo logo */}
  //             <Link to="/" className="text-lg font-semibold">
  //               Die Rezeptwelt
  //             </Link>
  //           </div>

  //           {/* Navigation Mitte */}
  //           <div className="flex items-center gap-8">
  //             <Link to="/" className="text-gray-900 hover:text-gray-600">
  //               Home
  //             </Link>
  //             <Link to="/rezepte" className="text-gray-900 hover:text-gray-600">
  //               Rezepte
  //             </Link>
  //             <Link to="/ueber-uns" className="text-gray-900 hover:text-gray-600">
  //               Über uns
  //             </Link>
  //           </div>

  //           {/* Login rechts */}
  //           <div>
  //             <Link to="/login" className="text-gray-900 hover:text-gray-600">
  //               Login
  //             </Link>
  //           </div>
  //         </nav>
  //       </div>
  //     </header>
  //   )
  // }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h3 className="text-2xl font-bold text-blue-600">MyShop</h3>

        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`
            }>
            Home
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`
            }>
            Profile
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`
            }>
            Favorites
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`
                }>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-blue-600" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`
                }>
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={logOut}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded-lg transition-all duration-200">
                Log Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
