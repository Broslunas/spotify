'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Music, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/dashboard' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-gray-900 to-black">
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
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="text-white">Volver</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-spotify-green" />
            <span className="text-2xl font-bold text-white">Spotify Dashboard</span>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="glass-card p-12 max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Conecta con Spotify</h1>
            <p className="text-gray-300 leading-relaxed">
              Inicia sesión con tu cuenta de Spotify para acceder a tus estadísticas personalizadas 
              y descubrir insights únicos sobre tu música.
            </p>
          </div>

          <button
            onClick={handleSpotifyLogin}
            className="w-full spotify-gradient py-4 px-6 rounded-full text-white font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl mb-6"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Continuar con Spotify</span>
          </button>

          <div className="text-sm text-gray-400 space-y-2">
            <p>Al continuar, aceptas que accedamos a:</p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Tu perfil público de Spotify</li>
              <li>• Tus artistas y canciones más escuchadas</li>
              <li>• Tu historial de reproducciones reciente</li>
              <li>• Tus playlists y biblioteca musical</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Tus datos están seguros. No almacenamos información sensible y respetamos tu privacidad.
          </p>
        </div>
      </footer>
    </div>
  )
}