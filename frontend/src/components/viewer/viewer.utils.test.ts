import { describe, it, expect } from 'vitest'
import {
  fileTypeLabel,
  computeZoomPercentage,
  isApproximately,
  isEditableTarget,
  resolveShortcutAction,
} from './viewer.utils'

describe('fileTypeLabel', () => {
  it('maps known extensions to human-readable labels', () => {
    expect(fileTypeLabel('adenocarcinoma_01.jpg')).toBe('JPEG')
    expect(fileTypeLabel('slide.PNG')).toBe('PNG')
    expect(fileTypeLabel('diagram.svg')).toBe('SVG')
    expect(fileTypeLabel('whole-slide.tiff')).toBe('TIFF')
    expect(fileTypeLabel('capture.dcm')).toBe('DICOM')
  })

  it('returns null for missing or unrecognized extensions', () => {
    expect(fileTypeLabel(undefined)).toBeNull()
    expect(fileTypeLabel('no-extension')).toBeNull()
    expect(fileTypeLabel('file.bmp')).toBeNull()
  })
})

describe('computeZoomPercentage', () => {
  it('reports 100% at actual size', () => {
    expect(computeZoomPercentage(2, 2)).toBe(100)
  })

  it('reports proportional percentages above and below actual size', () => {
    expect(computeZoomPercentage(3, 2)).toBe(150)
    expect(computeZoomPercentage(1, 2)).toBe(50)
  })

  it('falls back to 100 when the actual-size zoom is not yet known', () => {
    expect(computeZoomPercentage(1, 0)).toBe(100)
  })
})

describe('isApproximately', () => {
  it('treats values within tolerance as equal', () => {
    expect(isApproximately(1.0, 1.01, 0.02)).toBe(true)
  })

  it('treats values outside tolerance as different', () => {
    expect(isApproximately(1.0, 1.5, 0.02)).toBe(false)
  })
})

describe('isEditableTarget', () => {
  it('is false for a plain div', () => {
    expect(isEditableTarget(document.createElement('div'))).toBe(false)
  })

  it('is true for form fields', () => {
    expect(isEditableTarget(document.createElement('input'))).toBe(true)
    expect(isEditableTarget(document.createElement('textarea'))).toBe(true)
    expect(isEditableTarget(document.createElement('select'))).toBe(true)
  })

  // jsdom doesn't implement `isContentEditable` (it always reports false
  // regardless of the contentEditable attribute), so that branch can't be
  // exercised here — verified manually/in the browser instead.

  it('is false for null or non-element targets', () => {
    expect(isEditableTarget(null)).toBe(false)
  })
})

describe('resolveShortcutAction', () => {
  it('maps the documented keys to their actions', () => {
    expect(resolveShortcutAction('+', false)).toBe('zoom-in')
    expect(resolveShortcutAction('-', false)).toBe('zoom-out')
    expect(resolveShortcutAction('1', false)).toBe('actual-size')
    expect(resolveShortcutAction('0', false)).toBe('fit')
    expect(resolveShortcutAction('r', false)).toBe('reset')
    expect(resolveShortcutAction('f', false)).toBe('fullscreen-toggle')
  })

  it('only maps Escape to exiting fullscreen while in fullscreen', () => {
    expect(resolveShortcutAction('Escape', true)).toBe('fullscreen-exit')
    expect(resolveShortcutAction('Escape', false)).toBeNull()
  })

  it('returns null for unbound keys', () => {
    expect(resolveShortcutAction('a', false)).toBeNull()
  })
})
