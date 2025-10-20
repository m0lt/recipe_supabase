//? Interface für User-Daten aus der Datenbank
export interface IUser {
    user_metadata?: any;
    id?: string | undefined,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    //? password ist optional, da wir es nicht immer aus der DB holen
    password?: string,
    //? img_url ist die URL zum Profilbild (optional)
    img_url?: string
}