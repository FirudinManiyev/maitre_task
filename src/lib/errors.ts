import { ApiError } from '../../maitre_task/api'

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Gözlənilməz xəta baş verdi. Yenidən cəhd edin.'
}
