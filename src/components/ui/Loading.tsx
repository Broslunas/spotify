import { Music } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'pulse' | 'shimmer' | 'music'
  className?: string
}

export default function Loading({ 
  size = 'md', 
  text, 
  variant = 'spinner',
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <div className={`animate-spin rounded-full border-2 border-spotify-green border-t-transparent ${sizeClasses[size]}`} />
        {text && (
          <p className={`text-gray-300 ${textSizeClasses[size]}`}>{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <div className={`bg-spotify-green rounded-full animate-pulse ${sizeClasses[size]}`} />
        {text && (
          <p className={`text-gray-300 animate-pulse ${textSizeClasses[size]}`}>{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'music') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <div className="relative">
          <Music className={`text-spotify-green animate-bounce ${sizeClasses[size]}`} />
          <div className="absolute inset-0 bg-spotify-green/20 rounded-full animate-ping" />
        </div>
        {text && (
          <p className={`text-gray-300 ${textSizeClasses[size]}`}>{text}</p>
        )}
      </div>
    )
  }

  if (variant === 'shimmer') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="shimmer h-8 w-3/4 rounded" />
        <div className="shimmer h-4 w-1/2 rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
        {text && (
          <p className={`text-gray-300 mt-4 ${textSizeClasses[size]}`}>{text}</p>
        )}
      </div>
    )
  }

  return null
}

// Full Page Loading Component
interface PageLoadingProps {
  text?: string
  variant?: 'spinner' | 'music'
}

export function PageLoading({ text = 'Cargando...', variant = 'music' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-black flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="glass-card p-12 text-center relative z-10">
        <Loading size="lg" text={text} variant={variant} />
      </div>
    </div>
  )
}

// Card Loading Skeleton
export function CardLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="shimmer w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="shimmer h-3 w-1/2 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="shimmer h-3 w-full rounded" />
          <div className="shimmer h-3 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}

// Stats Loading Skeleton
export function StatsLoading({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass-card p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="shimmer h-3 w-20 rounded" />
                <div className="shimmer h-6 w-16 rounded" />
              </div>
              <div className="shimmer w-10 h-10 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}