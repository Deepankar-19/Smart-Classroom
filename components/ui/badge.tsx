import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-xl border px-4 py-2 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 overflow-hidden font-inter shadow-sm hover:shadow-md hover:scale-105',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(79,70,229,0.4)] focus-visible:ring-purple-500/50',
        secondary:
          'border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.1)] [a&]:hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus-visible:ring-gray-500/50',
        destructive:
          'border-transparent bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(239,68,68,0.4)] focus-visible:ring-red-500/50',
        outline:
          'border-2 border-purple-200 text-purple-700 bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] [a&]:hover:bg-purple-50 [a&]:hover:border-purple-300 focus-visible:ring-purple-500/50',
        accent:
          'border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] focus-visible:ring-amber-500/50',
        success:
          'border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(16,185,129,0.4)] focus-visible:ring-emerald-500/50',
        royal:
          'border-transparent bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white shadow-[0_4px_12px_rgba(67,56,202,0.4)] [a&]:hover:shadow-[0_6px_16px_rgba(67,56,202,0.5)] focus-visible:ring-indigo-500/50',
        emerald:
          'border-transparent bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)] focus-visible:ring-emerald-500/50',
        warning:
          'border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-[0_4px_12px_rgba(251,191,36,0.3)] [a&]:hover:shadow-[0_6px_16px_rgba(251,191,36,0.4)] focus-visible:ring-yellow-500/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
