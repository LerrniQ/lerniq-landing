import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:   'border-brand-blue bg-brand-blue/10 text-brand-blue',
        secondary: 'border-brand-gold bg-brand-gold/10 text-brand-gold',
        outline:   'border-white/20 text-white/70',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
