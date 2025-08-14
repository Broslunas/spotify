'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Music, Home, BarChart3, User, Settings, LogOut, Menu, X, Share2, Download } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import Button from './Button'

interface NavigationProps {
  showActions?: boolean
  onShare?: () => void
  onExport?: () => void
}

export default function Navigation({ showActions = false, onShare, onExport }: NavigationProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: true },
    { href: `/profile/${(session as any)?.user?.id}`, label: 'Mi Perfil', icon: User, requiresAuth: true },
    { href: '/settings', label: 'Configuración', icon: Settings, requiresAuth: true }
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return (
    <nav className="glass-dark border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Music className="h-8 w-8 text-spotify-green" />
            <span className="text-xl font-bold text-white hidden sm:block">Spotify Dashboard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              if (item.requiresAuth && !session) return null
              
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-spotify-green/20 text-spotify-green'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center space-x-3">
            {/* Action Buttons */}
            {showActions && (
              <div className="hidden sm:flex items-center space-x-2">
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Share2}
                    onClick={onShare}
                    className="text-gray-300 hover:text-white"
                  >
                    Compartir
                  </Button>
                )}
                {onExport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={onExport}
                    className="text-gray-300 hover:text-white"
                  >
                    Exportar
                  </Button>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="glass-button p-2 hover:bg-white/10 transition-colors"
              title={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <Link href={`/profile/${(session as any).user?.id}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Usuario'}
                      className="w-8 h-8 rounded-full border-2 border-spotify-green"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-white text-sm font-medium hidden lg:block">
                    {session.user?.name}
                  </span>
                </Link>

                {/* Sign Out */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-red-400"
                  title="Cerrar sesión"
                >
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="spotify" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden glass-button p-2 hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navigationItems.map((item) => {
              if (item.requiresAuth && !session) return null
              
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-spotify-green/20 text-spotify-green'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Mobile Actions */}
            {showActions && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                {onShare && (
                  <button
                    onClick={() => {
                      onShare()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Compartir</span>
                  </button>
                )}
                {onExport && (
                  <button
                    onClick={() => {
                      onExport()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
                  >
                    <Download className="h-5 w-5" />
                    <span>Exportar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}