import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-gray-900 placeholder:text-gray-500 selection:bg-gradient-to-r selection:from-purple-500 selection:to-blue-500 selection:text-white border-2 border-gray-200 flex h-12 w-full min-w-0 rounded-xl border bg-white/80 backdrop-blur-sm px-5 py-3 text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-inter hover:border-purple-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:scale-[1.02]',
        'focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:ring-offset-2 focus-visible:shadow-[0_8px_25px_rgba(147,51,234,0.2)] focus-visible:scale-[1.02]',
        'aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
