"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassContainer } from "@/components/layout/GlassContainer";

const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You cancelled the authentication process.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An error occurred during authentication.",
};

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error") || "Default";
    const errorMessage = errorMessages[error] || errorMessages.Default;

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <GlassContainer className="p-8 text-center" blur="lg" opacity="medium">
                    <div className="mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Authentication Error
                        </h1>
                        <p className="text-white/80">
                            {errorMessage}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/auth/signin"
                            className="block w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                        >
                            Try Again
                        </Link>

                        <Link
                            href="/"
                            className="block w-full text-white/80 hover:text-white font-medium py-2 transition-colors duration-200"
                        >
                            Go Home
                        </Link>
                    </div>

                    {error === "AccessDenied" && (
                        <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <p className="text-white/70 text-sm">
                                To use Spotify Dashboard, we need access to your Spotify data to show your music statistics.
                            </p>
                        </div>
                    )}
                </GlassContainer>
            </div>
        </div>
    );
}