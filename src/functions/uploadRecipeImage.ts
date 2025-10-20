//? Funktion zum Hochladen von Rezeptbildern in Supabase Storage

import supabase from "../utils/supabase"

//? Diese Funktion lädt ein Rezeptbild hoch und gibt die URL zurück
//? file: Das hochzuladende Bild (vom Input-Element)
//? recipeId: Optional - die ID des Rezepts (für spezifischen Pfad)
//? Return: Die signierte URL zum hochgeladenen Bild oder null bei Fehler
export async function uploadRecipeImage(file: File | null, recipeId?: string) {
  //? Prüfe ob ein File übergeben wurde
  if (!file) return null

  //? SCHRITT 1: Hole den aktuell eingeloggten User
  //? Wir brauchen die User-ID um das Bild im richtigen Ordner zu speichern
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("❌ User wurde nicht gefunden")
    return null
  }

  //? SCHRITT 2: Erstelle den Dateipfad für das Bild
  //? Format: user_id/recipe_id/filename oder user_id/temp/filename (wenn noch keine recipe_id)
  const folderPath = recipeId ? `${user.id}/${recipeId}` : `${user.id}/temp`
  const filePath = `${folderPath}/${file.name}`

  //? SCHRITT 3: Lade das Bild in den Supabase Storage hoch
  //? "recipe-img" ist der Name des Storage Buckets (muss in Supabase existieren!)
  //? upsert: true bedeutet, dass vorhandene Dateien überschrieben werden
  const { error: storageError } = await supabase.storage
    .from("recipe-img")
    .upload(filePath, file, {
      cacheControl: "3600", //? Cache für 1 Stunde
      upsert: true, //? Überschreibe vorhandene Datei
      contentType: file.type, //? MIME-Type (z.B. "image/jpeg")
    })

  if (storageError) {
    console.error("❌ Fehler beim Hochladen:", storageError)
    return null
  }

  //? SCHRITT 4: Erstelle eine signierte URL für das Bild
  //? Eine signierte URL ist eine temporäre URL die das Bild abrufbar macht
  //? 60 * 60 * 24 * 365 = 1 Jahr Gültigkeit (Maximum für signierte URLs)
  const { data: signedData, error: signedError } = await supabase.storage
    .from("recipe-img")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365)

  if (signedError) {
    console.error("❌ Fehler beim Erstellen der signierten URL:", signedError)
    return null
  }

  const signedUrl = signedData?.signedUrl
  console.log("✅ Rezeptbild erfolgreich hochgeladen:", signedUrl)

  //? SCHRITT 5: Gib die signierte URL zurück
  //? Diese URL kann dann in der Datenbank gespeichert werden
  return signedUrl
}
