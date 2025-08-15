"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { GlassContainer } from "@/components/ui/GlassContainer";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <GlassContainer className="p-8 text-center text-white max-w-2xl" blur="lg" opacity={0.15}>
                    <h1 className="text-4xl font-bold mb-4">Spotify Dashboard</h1>
                    <p className="text-lg opacity-80 mb-8">
                        Advanced Spotify statistics with glassmorphism design
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/auth/signin"
                            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Get Started with Spotify
                        </Link>

                        <p className="text-white/60 text-sm">
                            Connect your Spotify account to view your personalized music insights
                        </p>
                    </div>
                </GlassContainer>
            </div>
        </main>
    );
}