import { Play, Pause, ExternalLink } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface TrackCardProps {
  rank?: number
  name: string
  artist: string
  image?: string
  duration?: number
  playCount?: number
  isPlaying?: boolean
  showPlayButton?: boolean
  showExternalLink?: boolean
  spotifyUrl?: string
  className?: string
  onClick?: () => void
  onPlay?: () => void
}

export default function TrackCard({
  rank,
  name,
  artist,
  image,
  duration,
  playCount,
  isPlaying = false,
  showPlayButton = false,
  showExternalLink = false,
  spotifyUrl,
  className = '',
  onClick,
  onPlay
}: TrackCardProps) {
  return (
    <div 
      className={`glass-card p-4 hover:bg-white/5 transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{rank}</span>
          </div>
        )}

        {/* Album Art */}
        <div className="flex-shrink-0 relative">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">♪</span>
            </div>
          )}
          
          {/* Play Button Overlay */}
          {showPlayButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPlay?.()
              }}
              className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate group-hover:text-spotify-green transition-colors">
            {name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{artist}</p>
          {playCount && (
            <p className="text-gray-500 text-xs mt-1">
              {playCount.toLocaleString()} reproducciones
            </p>
          )}
        </div>

        {/* Duration & Actions */}
        <div className="flex items-center space-x-3">
          {duration && (
            <span className="text-gray-400 text-sm">
              {formatDuration(duration)}
            </span>
          )}
          
          {showExternalLink && spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-white/10 rounded-full"
              title="Abrir en Spotify"
            >
              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-spotify-green" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}