import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const base =
  'w-full rounded-xl border border-input bg-card px-3.5 text-[0.95rem] text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, 'h-12', className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(base, 'min-h-24 py-3 leading-relaxed', className)} {...props} />
  )
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          base,
          'h-12 appearance-none pr-10 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label?: string
  hint?: string
  error?: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-0', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
