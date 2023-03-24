import '@testing-library/jest-dom/extend-expect'
import { completeDiffs } from './Score'

describe('score logic unit tests', () => {

    test('completeDiffs works: 1 entry - solo', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -12,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).not.toBeNull()
        expect(completed.A).toBe(-12)
        expect(completed.B).toBe(4)
        expect(completed.C).toBe(4)
        expect(completed.D).toBe(4)
    })

    test('completeDiffs works: 2 equal entries', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -4,
            B: -4,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).not.toBeNull()
        expect(completed.A).toBe(-4)
        expect(completed.B).toBe(-4)
        expect(completed.C).toBe(4)
        expect(completed.D).toBe(4)
    })

    test('completeDiffs works: 3 equal entries - solo', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -4,
            B: -4,
            C: -4,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).not.toBeNull()
        expect(completed.A).toBe(-4)
        expect(completed.B).toBe(-4)
        expect(completed.C).toBe(-4)
        expect(completed.D).toBe(12)
    })

    test('completeDiffs works: 4 valid entries', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -4,
            B: -4,
            C: 4,
            D: 4,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).not.toBeNull()
        expect(completed.A).toBe(-4)
        expect(completed.B).toBe(-4)
        expect(completed.C).toBe(4)
        expect(completed.D).toBe(4)
    })

    test('completeDiffs handles: 1 entry - cannot be solo', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -13,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).toBeNull()
    })

    test('completeDiffs handles: 2 unequal entries', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -5,
            B: -4,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).toBeNull()
    })

    test('completeDiffs handles: 4 invalid entries - inconsistent', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -5,
            B: -4,
            C: 4,
            D: 5,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).toBeNull()
    })

    test('completeDiffs handles: 4 invalid entries - sum incorrect', () => {

        const playerNamesInDeal = ['A', 'B', 'C', 'D']

        const diffEntries = {
            A: -5,
            B: -5,
            C: 4,
            D: 4,
        }

        const completed = completeDiffs(diffEntries, playerNamesInDeal)

        expect(completed).toBeNull()
    })
})
