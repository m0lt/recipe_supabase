import supabase from "../utils/supabase"

export async function uploadPhoto(file: File | null) {
    if (!file) return null

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        console.error("User wurde nicht gefunden");
        return null
    }


    const filePath = `${user.id}/${file.name}`

    const { error: storageError } = await supabase.storage
        .from("profiles-img")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type
        })

    if (storageError) {
        console.error("Fehler beim Hochladen:", storageError);
        return null
    }


    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("profiles-img")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    if (signedUrlError) {
        console.error("Fehler beim Erstellen der Signed URL:", signedUrlError);
        return null
    }

    console.log("Bild erfolgreich hochgeladen:", signedUrlData.signedUrl);

    return signedUrlData.signedUrl
}
