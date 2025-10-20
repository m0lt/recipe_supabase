import { Outlet, useLocation } from "react-router"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import Hero from "../components/hero/Hero"

export default function Layout() {
  //? useLocation() gibt uns die aktuelle URL/Route zurück
  const location = useLocation()

  //? Prüfe ob wir auf einer Rezept-Detailseite sind
  //? Rezept-Detailseiten haben das Format /recipe/:id
  const isRecipeDetailPage = location.pathname.startsWith("/recipe/")

  //? Hero soll NICHT auf Rezept-Detailseiten angezeigt werden,
  //? da diese ihren eigenen Hero mit Rezeptbild haben
  const shouldShowHero = !isRecipeDetailPage

  return (
    <div>
      <Header />
      {/*? Zeige Hero nur wenn shouldShowHero true ist */}
      {shouldShowHero && <Hero />}
      <Outlet />
      <Footer />
    </div>
  )
}
