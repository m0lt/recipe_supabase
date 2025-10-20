//! Neu - Seite kopiert
// todo logik verstehen
import { Link, useNavigate } from "react-router"
import supabase from "../../utils/supabase"

export default function SignUp() {
  const navigate = useNavigate()
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    console.log(formData)
    const signUpData = Object.fromEntries(formData.entries()) as {
      email: string
      password: string
      username: string
      firstname: string
      lastname: string
    }

    console.log(signUpData)

    // = Alternative 1

    //  const { data, error } = await supabase.auth.signUp({
    //     email: signUpData.email,
    //     password: signUpData.password,
    //     options: {
    //       data: {
    //         username: signUpData.username,
    //         firstname: signUpData.firstname,
    //         lastname: signUpData.lastname,
    //       },
    //     },
    //   });

    // = Alternative 2

    const { email, password, username, firstname, lastname } = signUpData

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            firstname: firstname,
            lastname: lastname,
          },
        },
      })

      if (error) {
        console.error("Fehler beim signUp", error)
        alert("Fehler beim Registrieren: " + error.message)
        return
      }

      console.log("signup war erfolgreich", data)

      //? Nach erfolgreichem Sign Up zur Profile-Seite navigieren
      if (data.user) {
        navigate("/profile")
      }
    } catch (error) {
      console.error("Fehler beim signUp", error)
      alert("Ein Fehler ist aufgetreten!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Create Your Account</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              name="firstname"
              placeholder="Firstname"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="text"
              name="lastname"
              placeholder="Lastname"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="current_password"
              name="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
