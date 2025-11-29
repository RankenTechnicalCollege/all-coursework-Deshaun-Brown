import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Toast helper functions
export function showError(message: string) {
  toast(message, { type: 'error', position: 'bottom-right' });
}

export function showSuccess(message: string) {
  toast(message, { type: 'success', position: 'bottom-right' });
}