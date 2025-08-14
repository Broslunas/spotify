import mongoose, { Document, Schema } from 'mongoose'

export interface IPlayHistory extends Document {
  userId: mongoose.Types.ObjectId
  spotifyId: string
  trackName: string
  artistName: string
  albumName?: string
  msPlayed: number
  endTime: Date
  reasonStart?: string
  reasonEnd?: string
  shuffle?: boolean
  skipped?: boolean
  offline?: boolean
  offlineTimestamp?: Date
  incognitoMode?: boolean
  platform?: string
  country?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const PlayHistorySchema = new Schema<IPlayHistory>({
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
  trackName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  albumName: String,
  msPlayed: {
    type: Number,
    required: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  reasonStart: String,
  reasonEnd: String,
  shuffle: Boolean,
  skipped: Boolean,
  offline: Boolean,
  offlineTimestamp: Date,
  incognitoMode: Boolean,
  platform: String,
  country: String,
  ipAddress: String,
  userAgent: String
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

// Indexes for efficient queries
PlayHistorySchema.index({ userId: 1, endTime: -1 })
PlayHistorySchema.index({ spotifyId: 1, endTime: -1 })
PlayHistorySchema.index({ trackName: 1, artistName: 1 })
PlayHistorySchema.index({ endTime: -1 })

// Compound index for analytics queries
PlayHistorySchema.index({ userId: 1, trackName: 1, artistName: 1 })

export default mongoose.models.PlayHistory || mongoose.model<IPlayHistory>('PlayHistory', PlayHistorySchema)