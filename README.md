# Spotify Dashboard

A modern Spotify statistics dashboard built with Next.js 14, TypeScript, and TailwindCSS featuring glassmorphism design.

## Features

- 🎵 Advanced Spotify statistics visualization
- 🎨 Glassmorphism design with backdrop blur effects
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔐 Secure OAuth authentication with Spotify
- 📊 Interactive charts and data visualization
- 🔒 Privacy controls for public profiles
- 📤 Statistics sharing and image generation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom glassmorphism utilities
- **Authentication**: NextAuth.js with Spotify provider
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Recharts for interactive data visualization

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    ├── spotify.ts        # Spotify API types
    ├── user.ts           # User-related types
    ├── stats.ts          # Statistics types
    └── index.ts          # Type exports
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Configure your Spotify app credentials in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Glassmorphism Design System

The project includes custom TailwindCSS utilities for glassmorphism effects:

- `.glass` - Basic glass effect
- `.glass-dark` - Dark theme glass effect
- `.glass-card` - Enhanced glass card with shadows
- `.glass-button` - Interactive glass button with hover effects

## License

MIT License - see LICENSE file for details