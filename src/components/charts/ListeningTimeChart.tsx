'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface ListeningData {
  date: string
  minutes: number
  tracks: number
}

interface ListeningTimeChartProps {
  data: ListeningData[]
  className?: string
  type?: 'line' | 'area'
}

const ListeningTimeChart: React.FC<ListeningTimeChartProps> = ({
  data,
  className = '',
  type = 'area'
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {new Date(data.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tiempo: <span className="font-medium text-green-600 dark:text-green-400">
              {formatMinutes(data.minutes)}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Canciones: <span className="font-medium">{data.tracks}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }))

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20
            }}
          >
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1db954" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1db954" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-300/30 dark:stroke-gray-600/30"
            />
            <XAxis 
              dataKey="formattedDate" 
              className="fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={formatMinutes}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#1db954"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMinutes)"
            />
          </AreaChart>
        ) : (
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-300/30 dark:stroke-gray-600/30"
            />
            <XAxis 
              dataKey="formattedDate" 
              className="fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="fill-gray-600 dark:fill-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={formatMinutes}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#1db954"
              strokeWidth={3}
              dot={{ fill: '#1db954', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#1db954', strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default ListeningTimeChart