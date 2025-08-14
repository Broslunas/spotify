import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  spotifyId: string
  email: string
  name: string
  image?: string
  country?: string
  followers?: number
  product?: string // free, premium
  isPublic: boolean
  theme: 'light' | 'dark' | 'system'
  privacySettings: {
    showTopTracks: boolean
    showTopArtists: boolean
    showGenres: boolean
    showListeningTime: boolean
    showRecentlyPlayed: boolean
  }
  createdAt: Date
  updatedAt: Date
  lastSyncAt?: Date
}

const UserSchema = new Schema<IUser>({
  spotifyId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  country: String,
  followers: Number,
  product: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  privacySettings: {
    showTopTracks: {
      type: Boolean,
      default: true
    },
    showTopArtists: {
      type: Boolean,
      default: true
    },
    showGenres: {
      type: Boolean,
      default: true
    },
    showListeningTime: {
      type: Boolean,
      default: true
    },
    showRecentlyPlayed: {
      type: Boolean,
      default: false
    }
  },
  lastSyncAt: Date
}, {
  timestamps: true
})

// Create indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ spotifyId: 1 })
UserSchema.index({ isPublic: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)