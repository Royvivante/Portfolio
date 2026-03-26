'use client'
import React from 'react'
import { MouseEventHandler, useState } from 'react'
import { cn } from '@/lib/utils'

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string
    size?: string
  }
>(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variant === 'outline'
        ? 'border border-white/[0.1] bg-transparent hover:bg-white/[0.06] text-foreground'
        : variant === 'ghost'
          ? 'hover:bg-white/[0.06] text-foreground'
          : variant === 'secondary'
            ? 'bg-white/[0.06] border border-white/[0.08] text-muted hover:text-foreground hover:bg-white/[0.1]'
            : 'bg-accent text-white hover:bg-accent-light',
      size === 'sm'
        ? 'h-9 px-3'
        : size === 'lg'
          ? 'h-11 px-8'
          : size === 'icon'
            ? 'h-10 w-10'
            : 'h-10 px-4 py-2',
      className
    )}
    {...props}
  />
))
Button.displayName = 'Button'

interface ArticleItem {
  url: string
  title: string
  subTitle: string
  img: string
}

const DefaultArticleItems: ArticleItem[] = [
  {
    url: 'https://github.com/royvivante',
    title: 'GitHub',
    subTitle: 'Explore my open source projects and code',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
  },
  {
    url: 'https://linkedin.com/in/royvivante',
    title: 'LinkedIn',
    subTitle: "Let's connect professionally",
    img: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&h=200&fit=crop&q=80',
  },
  {
    url: 'mailto:roy.vivantee@gmail.com',
    title: 'Email',
    subTitle: 'roy.vivantee@gmail.com',
    img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&h=200&fit=crop&q=80',
  },
  {
    url: '/Roy_Vivante_CV_final.pdf',
    title: 'Resume',
    subTitle: 'Download my latest CV',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop&q=80',
  },
]

/** Stacked top offset when collapsed (cards peek behind each other) */
const COLLAPSED_OFFSETS = [
  'top-6',
  'top-[calc(1.5rem+0.75rem)]',
  'top-[calc(1.5rem+1.5rem)]',
  'top-[calc(1.5rem+3rem)]',
]

/** Spread top offset when expanded */
const EXPANDED_OFFSETS = [
  'top-6',
  'top-[calc(1.5rem+112px+1rem)]',
  'top-[calc(1.5rem+224px+2rem)]',
  'top-[calc(1.5rem+336px+3rem)]',
]

interface StackedArticleCardsProps {
  items?: ArticleItem[]
  className?: string
}

export default function StackedArticleCards({
  items = DefaultArticleItems,
  className,
}: StackedArticleCardsProps) {
  const [isActive, setIsActive] = useState(false)

  const handleExpand = () => {
    setIsActive(true)
  }

  const handleCollapse: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    setIsActive(false)
  }

  return (
    <div
      className={cn('relative min-h-150 w-full max-w-md', className)}
      onClick={handleExpand}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'absolute right-6 flex h-28 w-96 cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.06] bg-card p-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-1000 ease-[cubic-bezier(0.075,0.82,0.165,1)] hover:bg-white/[0.06] max-md:w-72',
            isActive ? EXPANDED_OFFSETS[index] : COLLAPSED_OFFSETS[index]
          )}
        >
          <a
            href={item.url}
            target={item.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={item.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className={cn(
              'flex w-full items-center gap-4 no-underline',
              isActive ? 'pointer-events-auto' : 'pointer-events-none'
            )}
          >
            <div className="size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/[0.06]">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 truncate text-base font-semibold text-foreground">
                {item.title}
              </p>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                {item.subTitle}
              </p>
            </div>
          </a>
        </div>
      ))}

      {/* Show less toggle */}
      <div
        className={cn(
          'absolute top-[calc(1.5rem+448px+4rem)] right-6 transition-all duration-300 ease-in-out',
          isActive
            ? 'pointer-events-auto visible opacity-100'
            : 'pointer-events-none invisible opacity-0'
        )}
        onClick={handleCollapse}
      >
        <Button variant="secondary" size="sm">
          Show less
        </Button>
      </div>
    </div>
  )
}
