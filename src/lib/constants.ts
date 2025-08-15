export const SPOTIFY_SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
].join(' ');

export const TIME_RANGES = {
    short_term: '4 weeks',
    medium_term: '6 months',
    long_term: 'All time',
} as const;

export const CHART_COLORS = {
    primary: '#1DB954',
    secondary: '#1ed760',
    accent: '#535353',
    background: 'rgba(255, 255, 255, 0.1)',
} as const;