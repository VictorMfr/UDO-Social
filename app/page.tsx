import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
            UDO Social
          </h1>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="pt-32 pb-16 px-4">
        <section className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Conecta con la comunidad de la <span className="text-blue-600">UDO Monagas</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              La plataforma exclusiva para estudiantes de Ingeniería de Sistemas. 
              Comparte posts, fotos y chatea con tus compañeros en tiempo real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl text-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Empezar ahora
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-50 text-gray-700 font-semibold rounded-xl text-lg border border-gray-200 hover:bg-gray-100 transition-all"
            >
              Saber más
            </Link>
          </div>

          {/* Decoración simple (Opcional) */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-30 rounded-full h-64 w-64 mx-auto -z-10"></div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto opacity-40">
              <div className="h-24 bg-gray-100 rounded-2xl"></div>
              <div className="h-24 bg-blue-50 rounded-2xl border-2 border-blue-100"></div>
              <div className="h-24 bg-gray-100 rounded-2xl"></div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-50">
        <p>© 2026 UDO Social - Proyecto de Grado - Ingeniería de Sistemas</p>
      </footer>
    </div>
  );
}