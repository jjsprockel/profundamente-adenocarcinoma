import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InitialImpressionStep from './InitialImpressionStep'
import { INITIAL_IMPRESSION_OPTIONS } from '@/data/initialImpression'

describe('InitialImpressionStep', () => {
  it('lists every possible pattern as an option', () => {
    render(<InitialImpressionStep value={null} onSelect={vi.fn()} onContinue={vi.fn()} />)

    for (const option of INITIAL_IMPRESSION_OPTIONS) {
      expect(screen.getByText(option.text)).toBeInTheDocument()
    }
  })

  it('disables continue until an option is selected', () => {
    render(<InitialImpressionStep value={null} onSelect={vi.fn()} onContinue={vi.fn()} />)
    expect(screen.getByTestId('continue-initial-impression')).toBeDisabled()
  })

  it('enables continue once a value is selected', () => {
    render(<InitialImpressionStep value="B" onSelect={vi.fn()} onContinue={vi.fn()} />)
    expect(screen.getByTestId('continue-initial-impression')).toBeEnabled()
  })

  it('calls onSelect with the clicked option letter', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<InitialImpressionStep value={null} onSelect={onSelect} onContinue={vi.fn()} />)

    await user.click(screen.getByText('Micropapilar'))
    expect(onSelect).toHaveBeenCalledWith('D')
  })

  it('calls onContinue when the continue button is clicked', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    render(<InitialImpressionStep value="A" onSelect={vi.fn()} onContinue={onContinue} />)

    await user.click(screen.getByTestId('continue-initial-impression'))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
