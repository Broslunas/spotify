import mongoose, { Document, Schema } from 'mongoose'

export interface ITrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  popularity: number
  preview_url?: string
  external_urls: {
    spotify: string
  }
}

export interface IArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  followers: number
  images: Array<{
    url: string
    height: number
    width: number
  }>
  external_urls: {
    spotify: string
  }
}

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId
  spotifyId: string
  timeRange: 'short_term' | 'medium_term' | 'long_term' // 4 weeks, 6 months, all time
  topTracks: ITrack[]
  topArtists: IArtist[]
  topGenres: Array<{
    genre: string
    count: number
    percentage: number
  }>
  recentlyPlayed: Array<{
    track: ITrack
    played_at: Date
    context?: {
      type: string
      href: string
    }
  }>
  listeningStats: {
    totalMinutes: number
    totalTracks: number
    averageSessionLength: number
    mostActiveHour: number
    mostActiveDay: string
    diversityScore: number // 0-100, based on genre variety
  }
  audioFeatures: {
    averageDanceability: number
    averageEnergy: number
    averageValence: number // happiness
    averageAcousticness: number
    averageInstrumentalness: number
    averageLiveness: number
    averageSpeechiness: number
    averageTempo: number
  }
  createdAt: Date
  updatedAt: Date
}

const TrackSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  artists: [{
    id: String,
    name: String
  }],
  album: {
    id: String,
    name: String,
    images: [{
      url: String,
      height: Number,
      width: Number
    }]
  },
  duration_ms: Number,
  popularity: Number,
  preview_url: String,
  external_urls: {
    spotify: String
  }
}, { _id: false })

const ArtistSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  genres: [String],
  popularity: Number,
  followers: Number,
  images: [{
    url: String,
    height: Number,
    width: Number
  }],
  external_urls: {
    spotify: String
  }
}, { _id: false })

const UserStatsSchema = new Schema<IUserStats>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  spotifyId: {
    type: String,
    required: true,
    index: true
  },
  timeRange: {
    type: String,
    enum: ['short_term', 'medium_term', 'long_term'],
    required: true
  },
  topTracks: [TrackSchema],
  topArtists: [ArtistSchema],
  topGenres: [{
    genre: String,
    count: Number,
    percentage: Number
  }],
  recentlyPlayed: [{
    track: TrackSchema,
    played_at: Date,
    context: {
      type: String,
      href: String
    }
  }],
  listeningStats: {
    totalMinutes: { type: Number, default: 0 },
    totalTracks: { type: Number, default: 0 },
    averageSessionLength: { type: Number, default: 0 },
    mostActiveHour: { type: Number, default: 0 },
    mostActiveDay: { type: String, default: 'Monday' },
    diversityScore: { type: Number, default: 0 }
  },
  audioFeatures: {
    averageDanceability: { type: Number, default: 0 },
    averageEnergy: { type: Number, default: 0 },
    averageValence: { type: Number, default: 0 },
    averageAcousticness: { type: Number, default: 0 },
    averageInstrumentalness: { type: Number, default: 0 },
    averageLiveness: { type: Number, default: 0 },
    averageSpeechiness: { type: Number, default: 0 },
    averageTempo: { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

// Compound index for efficient queries
UserStatsSchema.index({ userId: 1, timeRange: 1 }, { unique: true })
UserStatsSchema.index({ spotifyId: 1, timeRange: 1 })
UserStatsSchema.index({ createdAt: -1 })

export default mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema)