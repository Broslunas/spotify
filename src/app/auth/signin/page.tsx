"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassContainer } from "@/components/layout/GlassContainer";

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if user is already signed in
        getSession().then((session) => {
            if (session) {
                router.push("/dashboard");
            }
        });
    }, [router]);

    const handleSpotifySignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("spotify", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("Sign in error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <GlassContainer className="p-8 text-center" blur="lg" opacity="medium">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Spotify Dashboard
                        </h1>
                        <p className="text-white/80 text-lg">
                            Discover your music insights
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleSpotifySignIn}
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Connecting...
                            </div>
                        ) : (
                            "Continue with Spotify"
                        )}
                    </button>

                    <p className="text-white/60 text-sm mt-6">
                        We'll redirect you to Spotify to authorize access to your music data
                    </p>
                </GlassContainer>
            </div>
        </div>
    );
}