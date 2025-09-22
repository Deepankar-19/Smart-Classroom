import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 font-inter relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-[0_8px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_35px_rgba(79,70,229,0.4)] hover:scale-105 focus-visible:ring-purple-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:via-blue-500 before:to-indigo-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10',
        destructive:
          'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_8px_25px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_35px_rgba(239,68,68,0.4)] hover:scale-105 focus-visible:ring-red-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-400 before:to-rose-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10',
        outline:
          'border-2 border-gradient-to-r from-purple-200 to-blue-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 hover:scale-105 focus-visible:ring-purple-500/50',
        secondary:
          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:from-gray-200 hover:to-gray-300 hover:scale-105 focus-visible:ring-gray-500/50',
        ghost:
          'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:scale-105 focus-visible:ring-purple-500/50',
        link: 'text-purple-600 underline-offset-4 hover:underline hover:text-purple-700 hover:scale-105',
        accent:
          'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white shadow-[0_8px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.4)] hover:scale-105 focus-visible:ring-amber-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-300 before:via-yellow-400 before:to-orange-400 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10',
        royal:
          'bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white shadow-[0_8px_25px_rgba(67,56,202,0.4)] hover:shadow-[0_12px_35px_rgba(67,56,202,0.5)] hover:scale-105 focus-visible:ring-indigo-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600 before:via-indigo-600 before:to-blue-700 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10',
        emerald:
          'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)] hover:scale-105 focus-visible:ring-emerald-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-400 before:to-teal-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:-z-10',
      },
      size: {
        default: 'h-12 px-8 py-3 has-[>svg]:px-6',
        sm: 'h-10 rounded-lg gap-1.5 px-5 has-[>svg]:px-4',
        lg: 'h-14 rounded-xl px-10 has-[>svg]:px-8 text-base',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
