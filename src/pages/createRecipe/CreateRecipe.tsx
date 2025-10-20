import RecipeForm from "../../components/recipeForm/RecipeForm"

//? Page zum Erstellen eines neuen Rezepts
//? Nur für eingeloggte User zugänglich (ProtectedRoute)
export default function CreateRecipe() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="container mx-auto max-w-4xl">
        <RecipeForm />
      </div>
    </div>
  )
}
