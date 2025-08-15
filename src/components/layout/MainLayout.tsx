import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { GlassContainer } from './GlassContainer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    children: ReactNode;
    className?: string;
    showNavigation?: boolean;
    backgroundVariant?: 'default' | 'gradient' | 'minimal';
}

export function MainLayout({
    children,
    className,
    showNavigation = true,
    backgroundVariant = 'default',
}: MainLayoutProps) {
    const backgroundClasses = {
        default: 'bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-black',
        gradient: 'bg-gradient-to-br from-purple-900 via-spotify-black to-green-900',
        minimal: 'bg-spotify-black',
    };

    return (
        <div className={cn(
            'min-h-screen text-white transition-colors duration-300',
            backgroundClasses[backgroundVariant]
        )}>
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,185,84,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(29,185,84,0.05),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(29,185,84,0.05),transparent_50%)]" />
            </div>

            {/* Navigation */}
            {showNavigation && <Navigation />}

            {/* Main Content */}
            <main className={cn(
                'relative z-10',
                showNavigation ? 'pt-0' : 'pt-8',
                className
            )}>
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-auto">
                <GlassContainer
                    variant="nav"
                    className="px-4 py-6 mt-16"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                <span>© 2024 Spotify Dashboard</span>
                                <span>•</span>
                                <span>Built with Next.js & TailwindCSS</span>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <a
                                    href="#"
                                    className="hover:text-spotify-green transition-colors duration-200"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-spotify-green transition-colors duration-200"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="https://spotify.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-spotify-green transition-colors duration-200"
                                >
                                    Spotify
                                </a>
                            </div>
                        </div>
                    </div>
                </GlassContainer>
            </footer>
        </div>
    );
}