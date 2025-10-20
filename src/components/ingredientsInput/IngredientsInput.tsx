import { useState } from "react"

//? Interface für eine einzelne Zutat im Formular
export interface IIngredientFormData {
  name: string
  quantity: string // String wegen Input-Feld, wird später zu number konvertiert
  unit: string
  additional_info: string
}

interface IngredientsInputProps {
  ingredients: IIngredientFormData[]
  onChange: (ingredients: IIngredientFormData[]) => void
}

//? Komponente für die dynamische Eingabe von Zutaten
export default function IngredientsInput({ ingredients, onChange }: IngredientsInputProps) {
  //? Fügt eine neue leere Zutat hinzu
  const addIngredient = () => {
    onChange([...ingredients, { name: "", quantity: "", unit: "", additional_info: "" }])
  }

  //? Entfernt eine Zutat an einem bestimmten Index
  const removeIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index)
    onChange(updated)
  }

  //? Aktualisiert ein Feld einer bestimmten Zutat
  const updateIngredient = (index: number, field: keyof IIngredientFormData, value: string) => {
    const updated = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Zutaten <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
          + Zutat hinzufügen
        </button>
      </div>

      {ingredients.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          Noch keine Zutaten hinzugefügt. Klicke auf "+ Zutat hinzufügen"
        </p>
      )}

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-2 items-start bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {/*? Menge */}
            <div className="col-span-2">
              <input
                type="number"
                step="0.01"
                placeholder="Menge"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            {/*? Einheit */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Einheit"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            {/*? Name */}
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Name *"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            {/*? Zusatzinfo */}
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Zusatzinfo"
                value={ingredient.additional_info}
                onChange={(e) => updateIngredient(index, "additional_info", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            {/*? Entfernen-Button */}
            <div className="col-span-1 flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 rounded-lg transition-colors text-sm">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
