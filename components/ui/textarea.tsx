import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-2 border-gray-200 placeholder:text-gray-500 focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:ring-offset-2 aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20 flex field-sizing-content min-h-24 w-full rounded-xl border bg-white/80 backdrop-blur-sm px-5 py-4 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 font-inter hover:border-purple-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:scale-[1.01] focus-visible:shadow-[0_8px_25px_rgba(147,51,234,0.2)] focus-visible:scale-[1.01]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
