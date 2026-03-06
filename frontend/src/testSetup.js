import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

if (typeof window.URL.createObjectURL === 'undefined') {
    window.URL.createObjectURL = () => {
    }
}

window.matchMedia = window.matchMedia || (() => {
    return {
        matches: true,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }
})

afterEach(() => {
    cleanup()
})
