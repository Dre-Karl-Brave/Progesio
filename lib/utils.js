import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getInitials(nameOrEmail) {
  if (!nameOrEmail) return '??'
  const name = nameOrEmail.trim()
  if (name.includes('@')) {
    return name.slice(0, 2).toUpperCase()
  }
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
