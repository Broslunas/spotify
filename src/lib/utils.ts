import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getTimeRange(range: string): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()

  switch (range) {
    case '4_weeks':
      start.setDate(end.getDate() - 28)
      break
    case '6_months':
      start.setMonth(end.getMonth() - 6)
      break
    case 'all_time':
      start.setFullYear(2006) // Spotify launch year
      break
    default:
      start.setDate(end.getDate() - 28)
  }

  return { start, end }
}

export function generateShareableImage(data: any): Promise<string> {
  // This will be implemented later with html2canvas
  return Promise.resolve('')
}

export function downloadAsImage(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL()
  link.click()
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}