export interface SpotifyImage {
    url: string;
    height: number | null;
    width: number | null;
}

export interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    followers: {
        total: number;
    };
    images: SpotifyImage[];
    external_urls: {
        spotify: string;
    };
}

export interface SpotifyAlbum {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date: string;
    total_tracks: number;
    external_urls: {
        spotify: string;
    };
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    duration_ms: number;
    popularity: number;
    preview_url?: string;
    external_urls: {
        spotify: string;
    };
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';