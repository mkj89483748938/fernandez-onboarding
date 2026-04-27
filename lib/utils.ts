import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getModuleProgress(completed: number, total: number) {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
