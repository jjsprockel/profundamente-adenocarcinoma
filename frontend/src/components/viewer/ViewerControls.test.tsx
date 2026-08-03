import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ViewerControls from './ViewerControls'

function renderControls(overrides: Partial<Parameters<typeof ViewerControls>[0]> = {}) {
  const handlers = {
    onZoomOut: vi.fn(),
    onShowActualSize: vi.fn(),
    onZoomIn: vi.fn(),
    onFitToScreen: vi.fn(),
    onReset: vi.fn(),
    onToggleFullscreen: vi.fn(),
  }
  render(
    <ViewerControls
      disabled={false}
      canZoomIn
      canZoomOut
      isFullscreen={false}
      {...handlers}
      {...overrides}
    />,
  )
  return handlers
}

describe('ViewerControls', () => {
  it('exposes every control with an accessible name', () => {
    renderControls()

    for (const name of [
      'Alejar imagen',
      'Mostrar tamaño real',
      'Acercar imagen',
      'Ajustar imagen al visor',
      'Restablecer vista',
      'Entrar en pantalla completa',
    ]) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('invokes the matching handler for each control', async () => {
    const user = userEvent.setup()
    const handlers = renderControls()

    await user.click(screen.getByRole('button', { name: 'Alejar imagen' }))
    await user.click(screen.getByRole('button', { name: 'Mostrar tamaño real' }))
    await user.click(screen.getByRole('button', { name: 'Acercar imagen' }))
    await user.click(screen.getByRole('button', { name: 'Ajustar imagen al visor' }))
    await user.click(screen.getByRole('button', { name: 'Restablecer vista' }))
    await user.click(screen.getByRole('button', { name: 'Entrar en pantalla completa' }))

    expect(handlers.onZoomOut).toHaveBeenCalledOnce()
    expect(handlers.onShowActualSize).toHaveBeenCalledOnce()
    expect(handlers.onZoomIn).toHaveBeenCalledOnce()
    expect(handlers.onFitToScreen).toHaveBeenCalledOnce()
    expect(handlers.onReset).toHaveBeenCalledOnce()
    expect(handlers.onToggleFullscreen).toHaveBeenCalledOnce()
  })

  it('disables zoom in/out at the configured limits, independently', () => {
    renderControls({ canZoomIn: false, canZoomOut: true })
    expect(screen.getByRole('button', { name: 'Acercar imagen' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Alejar imagen' })).toBeEnabled()
  })

  it('disables all controls while the image is not loaded', () => {
    renderControls({ disabled: true })
    expect(screen.getByRole('button', { name: 'Mostrar tamaño real' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Ajustar imagen al visor' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Restablecer vista' })).toBeDisabled()
  })

  it('shows the fullscreen toggle as pressed, with the exit label, once active', () => {
    renderControls({ isFullscreen: true })
    const button = screen.getByRole('button', { name: 'Salir de pantalla completa' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })
})
