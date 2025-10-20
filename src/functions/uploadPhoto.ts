//? Funktion zum Hochladen von Profilbildern in Supabase Storage

import supabase from "../utils/supabase"

//? Diese Funktion lädt ein Profilbild hoch und gibt die URL zurück
//? file: Das hochzuladende Bild (vom Input-Element)
//? Return: Die signierte URL zum hochgeladenen Bild oder null bei Fehler
export async function uploadPhoto(file: File | null) {
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
  //? Format: user_id/filename (z.B. "abc123/profile.jpg")
  //? So hat jeder User einen eigenen Ordner im Storage
  const filePath = `${user.id}/${file.name}`

  //? SCHRITT 3: Lade das Bild in den Supabase Storage hoch
  //? "profiles-img" ist der Name des Storage Buckets (muss in Supabase existieren!)
  //? upsert: true bedeutet, dass vorhandene Dateien überschrieben werden
  const { error: storageError } = await supabase.storage.from("profiles-img").upload(filePath, file, {
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
  //? 60 * 60 = 1 Stunde Gültigkeit (statt 1 Jahr)
  const { data: signedData, error: signedError } = await supabase.storage
    .from("profiles-img")
    .createSignedUrl(filePath, 60 * 60)

  if (signedError) {
    console.error("❌ Fehler beim Erstellen der signierten URL:", signedError)
    return null
  }

  const signedUrl = signedData?.signedUrl
  console.log("✅ Bild erfolgreich hochgeladen:", signedUrl)

  //? SCHRITT 5: Gib die signierte URL zurück
  //? Diese URL kann dann in der Datenbank gespeichert werden
  return signedUrl
}
