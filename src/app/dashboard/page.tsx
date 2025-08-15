"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GlassContainer } from "@/components/ui/GlassContainer";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
            <div className="max-w-4xl mx-auto">
                <GlassContainer className="p-8" blur="lg" opacity={0.15}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome to your Dashboard
                            </h1>
                            <p className="text-white/80">
                                Hello, {session.user?.name || session.user?.email}!
                            </p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GlassContainer className="p-6" opacity={0.1}>
                            <h3 className="text-white font-semibold mb-2">Authentication Status</h3>
                            <p className="text-green-300">✓ Connected to Spotify</p>
                            <p className="text-white/70 text-sm mt-2">
                                Spotify ID: {session.user?.spotifyId || "Loading..."}
                            </p>
                        </GlassContainer>

                        <GlassContainer className="p-6" opacity={0.1}>
                            <h3 className="text-white font-semibold mb-2">Access Token</h3>
                            <p className="text-white/70 text-sm">
                                {session.accessToken ? "✓ Valid" : "⚠ Missing"}
                            </p>
                            {session.error && (
                                <p className="text-red-300 text-sm mt-2">
                                    Error: {session.error}
                                </p>
                            )}
                        </GlassContainer>

                        <GlassContainer className="p-6" opacity={0.1}>
                            <h3 className="text-white font-semibold mb-2">Next Steps</h3>
                            <p className="text-white/70 text-sm">
                                Dashboard components will be implemented in the next tasks
                            </p>
                        </GlassContainer>
                    </div>
                </GlassContainer>
            </div>
        </div>
    );
}