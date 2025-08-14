'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

interface Genre {
  name: string
  count: number
  percentage: number
}

interface GenreDistributionChartProps {
  genres: Genre[]
  className?: string
  maxItems?: number
}

const COLORS = [
  '#1db954', // Spotify Green
  '#1ed760', // Light Green
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#45b7d1', // Blue
  '#f9ca24', // Yellow
  '#f0932b', // Orange
  '#eb4d4b', // Dark Red
  '#6c5ce7', // Purple
  '#a29bfe', // Light Purple
  '#fd79a8', // Pink
  '#fdcb6e'  // Light Orange
]

const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({
  genres,
  className = '',
  maxItems = 8
}) => {
  // Process data for the chart
  const topGenres = genres.slice(0, maxItems - 1)
  const otherGenres = genres.slice(maxItems - 1)
  
  let data = topGenres.map(genre => ({
    name: genre.name,
    value: genre.percentage,
    count: genre.count
  }))
  
  // Add "Others" category if there are more genres
  if (otherGenres.length > 0) {
    const othersPercentage = otherGenres.reduce((sum, genre) => sum + genre.percentage, 0)
    const othersCount = otherGenres.reduce((sum, genre) => sum + genre.count, 0)
    
    data.push({
      name: 'Otros',
      value: othersPercentage,
      count: othersCount
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Porcentaje: <span className="font-medium">{data.value}%</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Reproducciones: <span className="font-medium">{data.count}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            className="hover:opacity-80 transition-opacity"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GenreDistributionChart