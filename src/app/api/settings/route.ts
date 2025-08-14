import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'
import PlayHistory from '@/models/PlayHistory'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    const settings = {
      theme: user.theme || 'system',
      isPublic: user.isPublic || false,
      privacySettings: user.privacySettings || {
        showTopTracks: true,
        showTopArtists: true,
        showTopGenres: true,
        showListeningTime: false,
        showRecentTracks: false
      }
    }
    
    return NextResponse.json(settings)
    
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    const body = await request.json()
    const { theme, isPublic, privacySettings } = body
    
    // Update user settings
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...(theme && { theme }),
        ...(typeof isPublic === 'boolean' && { isPublic }),
        ...(privacySettings && { privacySettings }),
        updatedAt: new Date()
      },
      { new: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      settings: {
        theme: updatedUser.theme,
        isPublic: updatedUser.isPublic,
        privacySettings: updatedUser.privacySettings
      }
    })
    
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Delete all user data
    await Promise.all([
      User.deleteOne({ _id: user._id }),
      UserStats.deleteMany({ userId: user._id }),
      PlayHistory.deleteMany({ userId: user._id })
    ])
    
    return NextResponse.json({ success: true, message: 'Cuenta eliminada exitosamente' })
    
  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}