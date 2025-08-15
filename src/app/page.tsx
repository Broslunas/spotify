"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { MainLayout, GlassContainer } from "@/components/layout";

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
            <MainLayout backgroundVariant="gradient">
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout backgroundVariant="gradient">
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
                <GlassContainer
                    variant="card"
                    className="p-12 text-center text-white max-w-2xl animate-fade-in"
                    blur="lg"
                    opacity="medium"
                >
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-spotify-green to-green-400 bg-clip-text text-transparent">
                                Spotify Dashboard
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Discover your music journey with advanced Spotify statistics and beautiful glassmorphism design
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <Link href="/auth/signin">
                                <GlassContainer
                                    as="div"
                                    variant="button"
                                    className="inline-block bg-gradient-to-r from-spotify-green to-green-400 text-white font-semibold py-4 px-8 rounded-xl cursor-pointer text-lg"
                                >
                                    Connect with Spotify
                                </GlassContainer>
                            </Link>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                                <GlassContainer variant="card" className="p-4 text-center">
                                    <div className="text-2xl mb-2">🎵</div>
                                    <h3 className="font-semibold text-spotify-green">Top Tracks</h3>
                                    <p className="text-sm text-gray-400">Discover your most played songs</p>
                                </GlassContainer>

                                <GlassContainer variant="card" className="p-4 text-center">
                                    <div className="text-2xl mb-2">🎤</div>
                                    <h3 className="font-semibold text-spotify-green">Top Artists</h3>
                                    <p className="text-sm text-gray-400">See your favorite musicians</p>
                                </GlassContainer>

                                <GlassContainer variant="card" className="p-4 text-center">
                                    <div className="text-2xl mb-2">📊</div>
                                    <h3 className="font-semibold text-spotify-green">Analytics</h3>
                                    <p className="text-sm text-gray-400">Deep dive into your music data</p>
                                </GlassContainer>
                            </div>

                            <p className="text-gray-400 text-sm pt-4">
                                Connect your Spotify account to unlock personalized music insights and statistics
                            </p>
                        </div>
                    </div>
                </GlassContainer>
            </div>
        </MainLayout>
    );
}