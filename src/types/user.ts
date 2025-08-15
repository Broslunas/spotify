import { SpotifyImage } from './spotify';

export interface User {
    id: string;
    spotifyId: string;
    email: string;
    displayName: string;
    images: SpotifyImage[];
    country: string;
    followers: number;
    product: 'free' | 'premium';
    preferences: UserPreferences;
    privacy: PrivacySettings;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultTimeRange: 'short_term' | 'medium_term' | 'long_term';
    favoriteChartType: 'bar' | 'pie' | 'line';
}

export interface PrivacySettings {
    publicProfile: boolean;
    showTopTracks: boolean;
    showTopArtists: boolean;
    showGenres: boolean;
    showListeningTime: boolean;
}