# Spotify Stats - Visualizador de Estadísticas Musicales

Una aplicación web moderna para visualizar y compartir tus estadísticas de Spotify con un diseño glassmorphism elegante.

## 🎵 Características

### ✨ Funcionalidades Principales
- **Autenticación con Spotify**: Inicia sesión de forma segura con tu cuenta de Spotify
- **Dashboard Interactivo**: Visualiza tus estadísticas musicales con gráficas interactivas
- **Perfiles Públicos**: Comparte tu perfil musical con otros usuarios
- **Múltiples Períodos**: Analiza tus datos de las últimas 4 semanas, 6 meses o años
- **Exportación de Datos**: Descarga tus estadísticas en formato JSON o CSV
- **Compartir en Redes Sociales**: Genera imágenes personalizadas para compartir

### 📊 Estadísticas Disponibles
- **Canciones Más Escuchadas**: Top tracks con conteo de reproducciones
- **Artistas Favoritos**: Tus artistas más reproducidos con géneros
- **Géneros Musicales**: Distribución de géneros con porcentajes
- **Historial Reciente**: Últimas canciones reproducidas
- **Características de Audio**: Análisis de danceabilidad, energía, valencia, etc.
- **Tiempo de Escucha**: Total de minutos escuchados

### 🎨 Diseño y UX
- **Glassmorphism**: Diseño moderno con efectos de cristal
- **Tema Claro/Oscuro**: Cambia entre temas según tu preferencia
- **Responsive**: Optimizado para dispositivos móviles y desktop
- **Animaciones Suaves**: Transiciones y efectos visuales elegantes

### 🔒 Privacidad y Configuración
- **Perfiles Privados/Públicos**: Controla la visibilidad de tu perfil
- **Configuración Granular**: Decide qué estadísticas mostrar públicamente
- **Eliminación de Cuenta**: Borra todos tus datos cuando quieras

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **Recharts**: Librería de gráficas interactivas
- **Framer Motion**: Animaciones y transiciones
- **React Icons**: Iconografía moderna

### Backend
- **Next.js API Routes**: Endpoints del servidor
- **NextAuth.js**: Autenticación con Spotify OAuth
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB

### Herramientas
- **html2canvas**: Generación de imágenes para compartir
- **ESLint**: Linting de código
- **Prettier**: Formateo de código

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB (local o Atlas)
- Cuenta de desarrollador de Spotify

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-muy-seguro

# Spotify OAuth
SPOTIFY_CLIENT_ID=tu-spotify-client-id
SPOTIFY_CLIENT_SECRET=tu-spotify-client-secret

# MongoDB
MONGODB_URI=mongodb://localhost:27017/spotify-stats
```

### 3. Configurar aplicación de Spotify
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Añade `http://localhost:3000/api/auth/callback/spotify` como Redirect URI
4. Copia el Client ID y Client Secret a tu `.env.local`

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── profile/           # Perfiles públicos
│   └── settings/          # Configuraciones
├── components/            # Componentes React
│   ├── ui/               # Componentes de interfaz
│   ├── charts/           # Gráficas
│   └── share/            # Componentes de compartir
├── lib/                  # Utilidades y configuración
├── models/               # Modelos de MongoDB
└── providers/            # Proveedores de contexto
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

---

**¡Disfruta explorando tu música! 🎵**
