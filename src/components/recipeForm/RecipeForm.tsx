import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import IngredientsInput, { type IIngredientFormData } from "../ingredientsInput/IngredientsInput"
import { getCategories } from "../../functions/getCategories"
import { createRecipe, type ICreateRecipeData } from "../../functions/createRecipe"
import { updateRecipe } from "../../functions/updateRecipe"
import { uploadRecipeImage } from "../../functions/uploadRecipeImage"
import type { ICategory } from "../../interfaces/ICategory"
import type { IRecipe } from "../../interfaces/IRecipe"

interface RecipeFormProps {
  existingRecipe?: IRecipe
}

export default function RecipeForm({ existingRecipe }: RecipeFormProps) {
  const navigate = useNavigate()
  const isEditMode = !!existingRecipe

  //? State für Formular-Felder - vorausgefüllt im Edit-Modus
  const [name, setName] = useState<string>(existingRecipe?.name || "")
  const [description, setDescription] = useState<string>(existingRecipe?.description || "")
  const [servings, setServings] = useState<number>(existingRecipe?.servings || 4)
  const [instructions, setInstructions] = useState<string>(existingRecipe?.instructions || "")
  const [additionalInfo, setAdditionalInfo] = useState<string>(existingRecipe?.additional_info || "")
  const [categoryId, setCategoryId] = useState<string>(existingRecipe?.category_id || "")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const [ingredients, setIngredients] = useState<IIngredientFormData[]>(
    existingRecipe?.ingredients && existingRecipe.ingredients.length > 0
      ? existingRecipe.ingredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity?.toString() || "",
          unit: ing.unit || "",
          additional_info: ing.additional_info || "",
        }))
      : [{ name: "", quantity: "", unit: "", additional_info: "" }]
  )

  //? State für Kategorien und Loading
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  //? Lade alle Kategorien beim Start
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
      //? Setze die erste Kategorie als Default
      if (cats.length > 0) {
        setCategoryId(cats[0].id)
      }
    }
    fetchCategories()
  }, [])

  //? Handler für Formular-Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      //? Validierung: Mindestens eine Zutat mit Name
      const validIngredients = ingredients.filter((ing) => ing.name.trim() !== "")
      if (validIngredients.length === 0) {
        alert("Bitte füge mindestens eine Zutat hinzu!")
        setIsLoading(false)
        return
      }

      //? SCHRITT 1: Lade das Bild hoch (falls neues Bild ausgewählt)
      let imageUrl: string | null | undefined = existingRecipe?.image_url // Behalte alte URL
      if (recipeImage) {
        console.log("📸 Lade Bild hoch...")
        const uploadedUrl = await uploadRecipeImage(recipeImage, existingRecipe?.id)
        if (!uploadedUrl) {
          alert("Fehler beim Hochladen des Bildes!")
          setIsLoading(false)
          return
        }
        imageUrl = uploadedUrl
      }

      //? SCHRITT 2: Erstelle/Aktualisiere das Rezept mit allen Daten
      const recipeData: ICreateRecipeData = {
        name,
        description,
        servings,
        instructions,
        additional_info: additionalInfo || undefined,
        category_id: categoryId,
        image_url: imageUrl || undefined,
        ingredients: validIngredients.map((ing) => ({
          name: ing.name,
          quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
          unit: ing.unit || undefined,
          additional_info: ing.additional_info || undefined,
        })),
      }

      if (isEditMode && existingRecipe) {
        console.log("✏️ Aktualisiere Rezept...")
        const updatedRecipe = await updateRecipe(existingRecipe.id, recipeData)

        if (updatedRecipe) {
          console.log("✅ Rezept erfolgreich aktualisiert:", updatedRecipe)
          //? Redirect zur Detail-Seite des aktualisierten Rezepts
          navigate(`/recipe/${updatedRecipe.id}`)
        } else {
          alert("Fehler beim Aktualisieren des Rezepts!")
        }
      } else {
        console.log("🍳 Erstelle Rezept...")
        const newRecipe = await createRecipe(recipeData)

        if (newRecipe) {
          console.log("✅ Rezept erfolgreich erstellt:", newRecipe)
          //? Redirect zur Detail-Seite des neuen Rezepts
          navigate(`/recipe/${newRecipe.id}`)
        } else {
          alert("Fehler beim Erstellen des Rezepts!")
        }
      }
    } catch (error) {
      console.error("❌ Fehler:", error)
      alert("Ein Fehler ist aufgetreten!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {isEditMode ? "Rezept bearbeiten" : "Neues Rezept erstellen"}
      </h2>

      {/*? Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rezeptname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="z.B. Spaghetti Carbonara"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/*? Beschreibung */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Beschreibung <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Kurze Beschreibung des Rezepts..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/*? Portionen & Kategorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Portionen <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kategorie <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*? Bild-Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rezeptbild</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setRecipeImage(e.target.files[0])
            }
          }}
          className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 dark:file:bg-gray-700 dark:file:text-gray-200"
        />
      </div>

      {/*? Zutaten */}
      <IngredientsInput ingredients={ingredients} onChange={setIngredients} />

      {/*? Zubereitungsschritte */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Zubereitungsschritte <span className="text-red-500">*</span>
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={8}
          placeholder="Beschreibe die Zubereitungsschritte..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/*? Zusätzliche Informationen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Zusätzliche Informationen
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={3}
          placeholder="z.B. Tipps, Variationen, Nährwerte..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/*? Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {isLoading ? (isEditMode ? "Wird gespeichert..." : "Wird erstellt...") : isEditMode ? "Änderungen speichern" : "Rezept erstellen"}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  )
}
