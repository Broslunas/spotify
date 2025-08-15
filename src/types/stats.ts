import { SpotifyTrack, SpotifyArtist, TimeRange } from './spotify';

export interface UserStats {
    userId: string;
    timeRange: TimeRange;
    topTracks: SpotifyTrack[];
    topArtists: SpotifyArtist[];
    topGenres: GenreStats[];
    totalMinutes: number;
    totalTracks: number;
    averagePopularity: number;
    generatedAt: Date;
}

export interface GenreStats {
    genre: string;
    count: number;
    percentage: number;
    topArtists: string[];
}

export interface ListeningHistory {
    userId: string;
    trackId: string;
    playedAt: Date;
    msPlayed: number;
    trackName: string;
    artistName: string;
    albumName: string;
    source: 'api' | 'import';
}