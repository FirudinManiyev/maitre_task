import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  small?: boolean
}

export function Button({
  variant = 'secondary',
  small,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`button ${variant === 'primary' ? 'button-primary' : 'button-secondary'} ${small ? 'button-small' : ''} ${className}`}
      {...props}
    />
  )
}
