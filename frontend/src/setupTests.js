import '@testing-library/jest-dom/extend-expect'

if (typeof window.URL.createObjectURL === 'undefined') {
    window.URL.createObjectURL = () => {
    }
}

global.matchMedia = global.matchMedia || (() => {
    return {
        matches: true,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }
})
