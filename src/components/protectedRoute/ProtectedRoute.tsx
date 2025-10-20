//! NEU - Datei kopiert
// todo Logik verstehen
import { useContext } from "react"
import { mainContext, type MainContextProps } from "../../context/MainProvider"
import { Navigate } from "react-router"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useContext(mainContext) as MainContextProps

  if (loading) {
    return <div>Loading....</div>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}
