'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface Genre {
  name: string
  count: number
  percentage: number
}

interface GenresChartProps {
  genres: Genre[]
  className?: string
  maxItems?: number
}

const GenresChart: React.FC<GenresChartProps> = ({
  genres,
  className = '',
  maxItems = 10
}) => {
  const data = genres.slice(0, maxItems).map(genre => ({
    name: genre.name.length > 15 ? `${genre.name.substring(0, 15)}...` : genre.name,
    fullName: genre.name,
    count: genre.count,
    percentage: genre.percentage
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.fullName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Reproducciones: <span className="font-medium">{data.count}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Porcentaje: <span className="font-medium">{data.percentage}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-300/30 dark:stroke-gray-600/30"
          />
          <XAxis 
            dataKey="name" 
            className="fill-gray-600 dark:fill-gray-400"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            className="fill-gray-600 dark:fill-gray-400"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            fill="#1db954"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GenresChart