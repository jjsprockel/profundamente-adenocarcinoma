import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ViewerToolbar from './ViewerToolbar'

describe('ViewerToolbar', () => {
  it('shows the file name, derived type and zoom percentage', () => {
    render(
      <ViewerToolbar fileName="adenocarcinoma_01.jpg" imageStatus="loaded" zoomPercentage={125} />,
    )

    expect(screen.getByText('adenocarcinoma_01.jpg')).toBeInTheDocument()
    expect(screen.getByText(/JPEG/)).toBeInTheDocument()
    expect(screen.getByText(/Imagen cargada/)).toBeInTheDocument()
    expect(screen.getByText('125 %')).toBeInTheDocument()
  })

  it('does not show a percentage while loading or on error', () => {
    const { rerender } = render(
      <ViewerToolbar fileName="a.png" imageStatus="loading" zoomPercentage={100} />,
    )
    expect(screen.queryByText('100 %')).not.toBeInTheDocument()

    rerender(<ViewerToolbar fileName="a.png" imageStatus="error" zoomPercentage={100} />)
    expect(screen.queryByText('100 %')).not.toBeInTheDocument()
  })

  it('only renders the replace button when a handler is provided', () => {
    const { rerender } = render(
      <ViewerToolbar fileName="a.png" imageStatus="loaded" zoomPercentage={100} />,
    )
    expect(screen.queryByRole('button', { name: 'Reemplazar imagen' })).not.toBeInTheDocument()

    const onReplaceImage = vi.fn()
    rerender(
      <ViewerToolbar
        fileName="a.png"
        imageStatus="loaded"
        zoomPercentage={100}
        onReplaceImage={onReplaceImage}
      />,
    )
    expect(screen.getByRole('button', { name: 'Reemplazar imagen' })).toBeInTheDocument()
  })

  it('calls onReplaceImage when the replace button is clicked', async () => {
    const user = userEvent.setup()
    const onReplaceImage = vi.fn()
    render(
      <ViewerToolbar
        fileName="a.png"
        imageStatus="loaded"
        zoomPercentage={100}
        onReplaceImage={onReplaceImage}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reemplazar imagen' }))
    expect(onReplaceImage).toHaveBeenCalledOnce()
  })
})
