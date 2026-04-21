import { describe, test, expect } from "vitest";
import { rollDice } from "./dices.js";
// obligé de travailler mes tests en ES MODULE car vitest n'accepte pas le commonJS.

describe("rollDice", () => {
    test("retourne un nombre >= à 1", () => {
        const result = rollDice(6);
        expect(result).toBeGreaterThanOrEqual(1);

    })
    test("retourne un nombre <= à 6", () => {
        const result = rollDice(6);
        expect(result).toBeLessThanOrEqual(6);
    }); 
});
