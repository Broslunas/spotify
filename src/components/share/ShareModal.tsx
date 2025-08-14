'use client'

import React, { useState, useRef } from 'react'
import { Modal } from '@/components/ui'
import { 
  FiDownload, 
  FiShare2, 
  FiCopy, 
  FiTwitter, 
  FiFacebook,
  FiInstagram,
  FiCheck
} from 'react-icons/fi'
import html2canvas from 'html2canvas'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
  type: 'top-tracks' | 'top-artists' | 'top-genres' | 'summary'
  timeRange: string
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  timeRange
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Últimas 4 semanas'
      case 'medium_term': return 'Últimos 6 meses'
      case 'long_term': return 'Últimos años'
      default: return 'Período personalizado'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'top-tracks': return 'Mis canciones más escuchadas'
      case 'top-artists': return 'Mis artistas más escuchados'
      case 'top-genres': return 'Mis géneros favoritos'
      case 'summary': return 'Mi resumen musical'
      default: return 'Mis estadísticas'
    }
  }

  const generateImage = async () => {
    if (!shareRef.current) return
    
    setIsGenerating(true)
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `spotify-stats-${type}-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    const shareUrl = `${window.location.origin}/profile/${data.user?.id || 'demo'}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const shareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/profile/${data.user?.id || 'demo'}`
    const text = `¡Mira mis estadísticas de Spotify! ${getTitle()} - ${getTimeRangeLabel(timeRange)}`
    
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy to clipboard
        copyToClipboard()
        return
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const renderShareContent = () => {
    if (!data) return null

    return (
      <div 
        ref={shareRef}
        className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 rounded-2xl text-white min-h-[400px] w-[400px] mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShare2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
          <p className="text-green-100 text-sm">{getTimeRangeLabel(timeRange)}</p>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {type === 'top-tracks' && data.topTracks?.slice(0, 5).map((track: any, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
              <span className="text-lg font-bold w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-green-100 text-sm truncate">{track.artist}</p>
              </div>
            </div>
          ))}
          
          {type === 'top-artists' && data.topArtists?.slice(0, 5).map((artist: any, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
              <span className="text-lg font-bold w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{artist.name}</p>
                <p className="text-green-100 text-sm truncate">
                  {artist.genres?.slice(0, 2).join(', ') || 'Varios géneros'}
                </p>
              </div>
            </div>
          ))}
          
          {type === 'top-genres' && data.topGenres?.slice(0, 5).map((genre: any, index: number) => (
            <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold w-6">{index + 1}</span>
                <p className="font-medium">{genre.name}</p>
              </div>
              <span className="text-green-100 font-medium">{genre.percentage}%</span>
            </div>
          ))}
          
          {type === 'summary' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{Math.floor((data.totalMinutes || 0) / 60)}h</p>
                <p className="text-green-100 text-sm">Tiempo total</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="font-bold truncate">{data.topTrack?.name || 'N/A'}</p>
                  <p className="text-green-100 text-xs">Top canción</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="font-bold truncate">{data.topArtist?.name || 'N/A'}</p>
                  <p className="text-green-100 text-xs">Top artista</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-white/20">
          <p className="text-green-100 text-xs">Generado con Spotify Stats</p>
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Compartir estadísticas
        </h3>
        
        {/* Preview */}
        <div className="mb-6">
          {renderShareContent()}
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          {/* Download */}
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            {isGenerating ? 'Generando...' : 'Descargar imagen'}
          </button>
          
          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar enlace'}
          </button>
          
          {/* Social Media */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <FiTwitter className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <FiFacebook className="w-4 h-4" />
              Facebook
            </button>
            <button
              onClick={() => shareToSocial('instagram')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <FiInstagram className="w-4 h-4" />
              Instagram
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal