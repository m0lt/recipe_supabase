import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router"
import Layout from "./layout/Layout"
import Home from "./pages/home/Home"
import UeberUns from "./pages/ueberUns/ueberUns"
import SignUp from "./pages/signUp/SignUp"
import Login from "./pages/login/Login"
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"
import Profile from "./pages/profile/Profile"
import Favorites from "./pages/favorites/Favorites"
import MyRecipes from "./pages/myRecipes/MyRecipes"
import RecipeDetail from "./pages/recipeDetail/RecipeDetail"
import CreateRecipe from "./pages/createRecipe/CreateRecipe"
import EditRecipe from "./pages/editRecipe/EditRecipe"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/ueber-uns" element={<UeberUns />} />

        {/* Authentication Routes */}
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />

        {/* Recipe Detail Route - öffentlich zugänglich */}
        <Route path="recipe/:id" element={<RecipeDetail />} />

        {/* Protected Routes - nur für eingeloggte User */}
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="create-recipe"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-recipe/:id"
          element={
            <ProtectedRoute>
              <EditRecipe />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
