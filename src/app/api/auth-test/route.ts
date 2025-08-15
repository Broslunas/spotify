import { NextResponse } from "next/server";
import { validateAuthConfig } from "@/lib/auth-test";

export async function GET() {
    try {
        const config = validateAuthConfig();

        return NextResponse.json({
            status: "success",
            message: "Authentication configuration is valid",
            config: {
                nextAuthUrl: config.nextAuthUrl,
                hasSecret: config.hasSecret,
                hasSpotifyConfig: config.hasSpotifyConfig,
                hasMongoConfig: config.hasMongoConfig,
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Configuration validation failed"
        }, { status: 500 });
    }
}