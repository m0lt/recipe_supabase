export default function Hero() {
  return (
    <div
      className="relative h-96 bg-center bg-cover bg-no-repeat flex justify-center items-center"
      style={{ backgroundImage: "url('/lily-banse--YHSwy6uqvk-unsplash.jpg')" }}>
      {/* Dunkles Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <h1 className="relative z-10 text-white text-5xl text-center px-8">
        Lassen Sie sich inspirieren, kochen Sie mit Leidenschaft und erleben Sie unvergessliche Momente bei Tisch.
      </h1>
    </div>
  )
}
