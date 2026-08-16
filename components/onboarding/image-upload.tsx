'use client'

import { useRef } from 'react'
import { Camera, ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageUpload({
  value,
  onChange,
  className,
}: {
  value?: string
  onChange: (dataUrl: string) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-input bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50',
          value && 'border-solid border-primary/30',
        )}
        aria-label="Upload picture"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value || "/placeholder.svg"} alt="Selected preview" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-6" />
        )}
        <span className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow">
          <Camera className="size-3.5" />
        </span>
      </button>
      <div className="text-sm">
        <p className="font-medium text-foreground">Upload a clear photo</p>
        <p className="text-xs text-muted-foreground">
          This becomes your profile & first listing image. JPG or PNG.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
