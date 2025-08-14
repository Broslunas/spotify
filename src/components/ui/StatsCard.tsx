import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  onClick?: () => void
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  trend, 
  className = '', 
  onClick 
}: StatsCardProps) {
  return (
    <div 
      className={`glass-card p-6 transition-all duration-300 hover:scale-105 ${
        onClick ? 'cursor-pointer hover:bg-white/10' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-spotify-green" />
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-xs font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-gray-500 text-xs">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}