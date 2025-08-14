'use client'

import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'

interface AudioFeatures {
  danceability: number
  energy: number
  valence: number
  acousticness: number
  instrumentalness: number
  speechiness: number
}

interface AudioFeaturesChartProps {
  audioFeatures: AudioFeatures
  className?: string
}

const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({
  audioFeatures,
  className = ''
}) => {
  const data = [
    {
      feature: 'Bailabilidad',
      value: Math.round(audioFeatures.danceability * 100),
      fullMark: 100
    },
    {
      feature: 'Energía',
      value: Math.round(audioFeatures.energy * 100),
      fullMark: 100
    },
    {
      feature: 'Valencia',
      value: Math.round(audioFeatures.valence * 100),
      fullMark: 100
    },
    {
      feature: 'Acústico',
      value: Math.round(audioFeatures.acousticness * 100),
      fullMark: 100
    },
    {
      feature: 'Instrumental',
      value: Math.round(audioFeatures.instrumentalness * 100),
      fullMark: 100
    },
    {
      feature: 'Hablado',
      value: Math.round(audioFeatures.speechiness * 100),
      fullMark: 100
    }
  ]

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid 
            className="stroke-white/20 dark:stroke-white/10" 
            strokeWidth={1}
          />
          <PolarAngleAxis 
            dataKey="feature" 
            className="fill-gray-700 dark:fill-gray-300 text-sm"
            tick={{ fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            className="fill-gray-500 dark:fill-gray-400 text-xs"
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Audio Features"
            dataKey="value"
            stroke="#1db954"
            fill="#1db954"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{
              fill: '#1db954',
              strokeWidth: 2,
              stroke: '#fff',
              r: 4
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AudioFeaturesChart