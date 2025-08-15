'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { GlassContainer } from './GlassContainer';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface NavigationProps {
    className?: string;
}

export function Navigation({ className }: NavigationProps) {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
        { href: '/profile', label: 'Profile', requiresAuth: true },
        { href: '/settings', label: 'Settings', requiresAuth: true },
    ];

    const filteredNavItems = navItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && session)
    );

    return (
        <GlassContainer
            as="nav"
            variant="nav"
            className={cn(
                'sticky top-0 z-50 w-full px-4 py-3',
                className
            )}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl font-bold text-spotify-green hover:opacity-80 transition-opacity"
                    >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-spotify-green to-green-400" />
                        <span>Spotify Dashboard</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />

                        {status === 'loading' ? (
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-spotify-green border-t-transparent" />
                        ) : session ? (
                            <div className="flex items-center space-x-3">
                                {session.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="h-8 w-8 rounded-full border border-white/20"
                                    />
                                )}
                                <GlassContainer
                                    as="button"
                                    variant="button"
                                    className="px-3 py-1.5 text-sm font-medium text-white rounded-lg"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </GlassContainer>
                            </div>
                        ) : (
                            <Link href="/auth/signin">
                                <GlassContainer
                                    as="div"
                                    variant="button"
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer"
                                >
                                    Sign In
                                </GlassContainer>
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <GlassContainer
                        variant="card"
                        className="mt-4 md:hidden p-4 space-y-3 animate-slide-up"
                    >
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </GlassContainer>
                )}
            </div>
        </GlassContainer>
    );
}