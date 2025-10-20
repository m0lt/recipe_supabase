import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { mainContext, type mainContextProps } from "../../context/MainProvider";
import supabase from "../../utils/supabase";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useContext(
    mainContext
  ) as mainContextProps;
  const navigate = useNavigate();

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout funktioniert nicht", error);
    }
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h3 className="text-2xl font-bold text-blue-600">MyShop</h3>

        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `font-medium ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `font-medium ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
              }`
            }
          >
            Cart
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `font-medium ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-500"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={logOut}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded-lg transition-all duration-200"
              >
                Log Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
