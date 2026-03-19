import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserAvatar } from '@/components/user-avatar'

describe('UserAvatar', () => {
  it('renders initials from name', () => {
    render(<UserAvatar name="Davidson Silva" />)
    expect(screen.getByRole('img')).toHaveTextContent('DS')
  })

  it('has correct aria-label', () => {
    render(<UserAvatar name="Davidson Silva" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Avatar de Davidson Silva')
  })

  it('applies lg size classes by default', () => {
    render(<UserAvatar name="Davidson" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain('h-24')
    expect(avatar.className).toContain('w-24')
  })

  it('applies sm size classes', () => {
    render(<UserAvatar name="Davidson" size="sm" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain('h-10')
    expect(avatar.className).toContain('w-10')
  })

  it('applies md size classes', () => {
    render(<UserAvatar name="Davidson" size="md" />)
    const avatar = screen.getByRole('img')
    expect(avatar.className).toContain('h-16')
    expect(avatar.className).toContain('w-16')
  })

  it('applies emerald background', () => {
    render(<UserAvatar name="Davidson" />)
    expect(screen.getByRole('img').className).toContain('bg-emerald-500')
  })

  it('accepts custom className', () => {
    render(<UserAvatar name="Davidson" className="mt-4" />)
    expect(screen.getByRole('img').className).toContain('mt-4')
  })
})
