//! NEU - Datei kopiert
// todo Logik verstehen
import React, { useContext, useEffect, useState } from "react"
import { mainContext } from "../../context/MainProvider"
import type { IUser } from "../../interfaces/IUser"
import supabase from "../../utils/supabase"
import { Link } from "react-router"
import { uploadPhoto } from "../../functions/uploadPhoto"

interface IProfileProps {
  user: IUser
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

export default function Profile() {
  const { user, setUser } = useContext(mainContext) as IProfileProps
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newUsername, setNewUserName] = useState<string>("")

  //? State für das hochzuladende Profilbild
  //? Speichert die ausgewählte Datei vom File-Input
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

  // fragt den aktuellen eingeloggte User aus der gespeicherten Session im Browser ab
  // gibt es eine gültige Session im LocalStorage
  // wenn ja dann gib mal die ID von dem User
  // wenn nein sollte User null sein

  const fetchData = async () => {
    //? Hole den aktuell authentifizierten User von Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log("Auth User:", user)

    if (user) {
      //? Jetzt holen wir die vollständigen User-Daten aus der "users" Tabelle
      //? select("*") holt ALLE Felder (inklusive img_url falls vorhanden)
      const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id)

      if (error) {
        console.error("Fehler beim Fetch", error)
      } else {
        console.log("User Data aus DB:", userData)
        //? userData ist ein Array, wir nehmen das erste Element
        setUser(userData?.[0] || null)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleSave() {
    if (user && newUsername !== user.username) {
      const { error } = await supabase
        .from("users")
        .update({
          username: newUsername,
        })
        .eq("id", user.id)
      if (error) {
        console.error("Fehler beim Speichern", error)
      } else {
        fetchData()
      }
    }
    setIsEditing(false)
  }

  function handleDoubleClick() {
    if (user) {
      setNewUserName(user.username)
      setIsEditing(true)
    }
  }

  //? Handler-Funktion zum Hochladen des Profilbildes
  async function handleUploadPhoto() {
    //? Prüfe ob ein Foto ausgewählt wurde und User existiert
    if (!profilePhoto || !user) return null

    try {
      //? SCHRITT 1: Lade das Bild hoch und erhalte die URL
      const imgUrl = await uploadPhoto(profilePhoto)
      console.log("📸 Uploaded image URL:", imgUrl)

      if (imgUrl) {
        //? SCHRITT 2: Update den User State mit der neuen Bild-URL
        //? So wird das neue Bild sofort in der UI angezeigt
        setUser((prev) => (prev ? { ...prev, img_url: imgUrl } : prev))

        //? SCHRITT 3: Speichere die Bild-URL in der Datenbank
        const { data: updateResult, error: updateError } = await supabase
          .from("users")
          .update({ img_url: imgUrl })
          .eq("id", user.id)
          .select()

        console.log("💾 Database update result:", { updateResult, updateError })

        if (updateError) {
          console.error("❌ Fehler beim Speichern in DB:", updateError)
          alert(
            "Bild wurde hochgeladen, aber nicht in der DB gespeichert. Bitte füge die 'img_url' Spalte zur 'users' Tabelle hinzu."
          )
        } else {
          //? SCHRITT 4: Setze das Foto-State zurück
          setProfilePhoto(null)
          console.log("✅ Profilbild erfolgreich aktualisiert")

          //? SCHRITT 5: Lade die User-Daten neu um sicherzustellen, dass alles synchron ist
          await fetchData()
        }
      }
    } catch (error) {
      console.error("❌ Fehler beim Foto-Upload:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      {user ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Your Profile</h2>

          {/*? Profilbild-Bereich */}
          <div className="flex flex-col items-center space-y-3">
            {/*? Zeige das Profilbild wenn vorhanden, sonst einen Platzhalter */}
            <img
              src={user.img_url || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-md"
            />
          </div>

          {/*? File-Input und Upload-Button für neues Profilbild */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Profile Picture</label>
            {/*? File Input - nur Bilder erlaubt (accept="image/*") */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setProfilePhoto(e.target.files[0])
                }
              }}
              className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
            />
            {/*? Upload Button wird nur angezeigt wenn ein Foto ausgewählt wurde */}
            {profilePhoto && (
              <button
                onClick={handleUploadPhoto}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                Upload Photo
              </button>
            )}
          </div>

          <div onDoubleClick={handleDoubleClick} className="cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Username</p>
            {isEditing ? (
              <input
                type="text"
                placeholder="Change your username"
                value={newUsername}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{user.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              Firstname: <span className="font-medium">{user.firstname}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Lastname: <span className="font-medium">{user.lastname}</span>
            </p>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              Save
            </button>
          )}

          <Link
            to="/"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-4">
            Back to Home
          </Link>
        </div>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">User wurde nicht gefunden</p>
      )}
    </div>
  )
}
