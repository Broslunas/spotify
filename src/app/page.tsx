'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Music, BarChart3, Users, Clock, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-spotify-green/20 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spotify-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-spotify-green" />
            <span className="text-2xl font-bold text-white">Spotify Dashboard</span>
          </div>
          <Link 
            href="/login" 
            className="glass-button px-6 py-2 rounded-full text-white font-medium hover:scale-105 transition-all duration-300"
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            Descubre tu
            <span className="block bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
              Universo Musical
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explora tus estadísticas de Spotify con un dashboard avanzado que revela patrones únicos 
            en tu música favorita con un diseño glassmorphism espectacular.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link 
              href="/login" 
              className="spotify-gradient px-8 py-4 rounded-full text-white font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-2xl"
            >
              <span>Conectar con Spotify</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link 
              href="#features" 
              className="glass-button px-8 py-4 rounded-full text-white font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              Ver Características
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32">
          <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
            <BarChart3 className="h-12 w-12 text-spotify-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Estadísticas Avanzadas</h3>
            <p className="text-gray-300">Análisis detallado de tus canciones, artistas y géneros favoritos</p>
          </div>
          
          <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
            <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Perfil Público</h3>
            <p className="text-gray-300">Comparte tus gustos musicales con amigos y descubre nuevos artistas</p>
          </div>
          
          <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
            <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Historial Completo</h3>
            <p className="text-gray-300">Importa y analiza todo tu historial de reproducciones de Spotify</p>
          </div>
          
          <div className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
            <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Diseño Glassmorphism</h3>
            <p className="text-gray-300">Interfaz moderna con efectos de cristal y transiciones fluidas</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-spotify-green" />
            <span className="text-lg font-semibold text-white">Spotify Dashboard</span>
          </div>
          <p className="text-gray-400">
            Creado con ❤️ para los amantes de la música. No afiliado oficialmente con Spotify.
          </p>
        </div>
      </footer>
    </div>
  )
}
