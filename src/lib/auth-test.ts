// Utility to test authentication configuration
export function validateAuthConfig() {
    const requiredEnvVars = [
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'SPOTIFY_CLIENT_ID',
        'SPOTIFY_CLIENT_SECRET',
        'MONGODB_URI'
    ];

    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasSpotifyConfig: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET),
        hasMongoConfig: !!process.env.MONGODB_URI,
    };
}