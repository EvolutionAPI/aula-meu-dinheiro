import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogoutButton } from '@/components/logout-button'

vi.mock('@/actions/auth', () => ({
  logout: vi.fn(),
}))

describe('LogoutButton', () => {
  it('renders a form with submit button', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: /sair/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('has text-red-400 styling', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: /sair/i })
    expect(button.className).toContain('text-red-400')
  })

  it('has min-h-[48px] for touch target', () => {
    render(<LogoutButton />)
    const button = screen.getByRole('button', { name: /sair/i })
    expect(button.className).toContain('min-h-[48px]')
  })

  it('displays "Sair" text', () => {
    render(<LogoutButton />)
    expect(screen.getByText('Sair')).toBeInTheDocument()
  })
})
