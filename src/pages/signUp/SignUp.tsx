//! Neu - Seite kopiert
// todo logik verstehen
import { Link } from "react-router"
import supabase from "../../utils/supabase"

export default function SignUp() {
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
      }
      console.log("signup war erfolgreich", data)
    } catch (error) {
      console.error("Fehler beim signUp", error)
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="text"
              name="lastname"
              placeholder="Lastname"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <input
              type="current_password"
              name="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
