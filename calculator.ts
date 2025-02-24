let calcInput = document.getElementById('calculation-in') as HTMLInputElement;
let resultContainer = document.getElementById('calc-out') as HTMLElement;
let numBtn = document.querySelectorAll('.number-btn') as NodeListOf<HTMLButtonElement>;
let equalsBtn = document.getElementById('equals-btn') as HTMLButtonElement;
let clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
let backspaceBtn = document.getElementById('backspace-btn') as HTMLButtonElement;

if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, start) {
        return this.indexOf(search, start) !== -1;
    };
}

// checking if they do not correspond to what we want
if (!calcInput || !resultContainer || !equalsBtn || !clearBtn || !backspaceBtn) {
    console.error("One or more required elements are missing from the DOM.");
} else {
    const numbers = "0123456789";
    const operators = "+-*/";

    // Mathematical constants without backslash
    const mathConstants: Record<string, string> = {
        "pi": "π",
        "phi": "φ",
    };
    const mathConstVal: Record<string, number> = {
        "π": 3.14159_26535_89793_23846_26433_83279_50288_41971_69399_37510_58209_74944_59230_78164_06286_20899_86280_34825_34211_70679,
        "φ": 1.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175,
        "e": 2.718281828459045235360287471352662497757247093699959574966967627724076630353,
        "τ": 6.28318_53071_79586_47692
    }

    // General Greek letters requiring a backslash
    const greekLetters: Record<string, string> = {
        "\\alpha": "α",
        "\\beta": "β",
        "\\gamma": "γ",
        "\\delta": "δ",
        "\\epsilon": "ε",
        "\\zeta": "ζ",
        "\\eta": "η",
        "\\theta": "θ",
        "\\iota": "ι",
        "\\kappa": "κ",
        "\\lambda": "λ",
        "\\mu": "μ",
        "\\nu": "ν",
        "\\xi": "ξ",
        "\\omicron": "ο",
        "\\rho": "ρ",
        "\\sigma": "σ",
        "\\tau": "τ",
        "\\upsilon": "υ",
        "\\chi": "χ",
        "\\psi": "ψ",
        "\\omega": "ω",

        // Uppercase Greek letters (still require backslash)
        "\\Gamma": "Γ",
        "\\Delta": "Δ",
        "\\Theta": "Θ",
        "\\Lambda": "Λ",
        "\\Xi": "Ξ",
        "\\Pi": "Π",
        "\\Sigma": "Σ",
        "\\Upsilon": "Υ",
        "\\Phi": "Φ",
        "\\Psi": "Ψ",
        "\\Omega": "Ω"
    };
    function replaceSymbols() {
        let inputText: string = calcInput.value;
        // Replacement of the mathematical constants because we don't want to put a backslash before them
        for (let key in mathConstants) {
            let regex = new RegExp(`\\b${key}\\b`, "g"); // Match whole word
            inputText = inputText.replace(regex, mathConstants[key]);
        }

        // Replacement of the other letters that needs backslash
        for (let key in greekLetters) {
            let regex = new RegExp(key, "g"); // Direct match (includes `\`)
            inputText = inputText.replace(regex, greekLetters[key]);
        }

        // Update the input field if changes were made
        if (calcInput.value !== inputText) {
            calcInput.value = inputText;
        }
    }
    // checking arrays
    function contains(element: String[] | Record<string, string>, str: string) {
        if (Array.isArray(element)) {
            for (let i = 0; i < element.length; i++) {
                if (element[i] == str) {
                    return true;
                }
            }
        } else {
            for (let i = 0; i < Object.keys(element).length; i++) {
                if (element[i] == str) {
                    return true;
                }
            }
        }
        return false;
    }

    // evaluating the calculation
    function evaluateExpression() {
        let calculation: string[] = calcInput.value.split(""); // the input of the user decomposed
        let calc: string = ""; // initial calc that is gonna be evaluated
        let isValid = true; // variable to see if there is an invalid character

        // checking if the components are valid
        for (let i = 0; i < calculation.length; i++) {
            let char = calculation[i];
            if (!numbers.includes(char) && !operators.includes(char) && contains(mathConstants, char)) {
                console.log("invalid input");
                isValid = false; // tells that there is an invalid character and doesn't let it continue
                break;
            } else {
                calc += char;
            }
        }

        if (isValid) {
            try {
                // replacing constants with values
                for (let key in mathConstVal) {
                    const regex = new RegExp(key, 'g');
                    calc = calc.replace(regex, mathConstVal[key].toString());
                }

                let result = eval(calc);

                // putting the result in the result container
                resultContainer.innerHTML = result;
            } catch (e) {
                console.error(e);
                resultContainer.innerHTML = "Error";
            }
        } else {
            resultContainer.innerHTML = "invalid input";
        }
    }

    // event listener for when we enter the calculation
    calcInput.addEventListener('input', () => {
        replaceSymbols();
        evaluateExpression();
    });

    // adding an event listener for the buttons
    numBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const target = event.target as HTMLButtonElement;
            calcInput.value += target.innerText;
        })
    })
    equalsBtn.addEventListener('click', evaluateExpression);
    clearBtn.addEventListener('click', () => {
        calcInput.value = "";
        resultContainer.innerHTML = "";
    })
    backspaceBtn.addEventListener('click', () => {
        calcInput.value = calcInput.value.slice(0, -1);
        console.log(calcInput);
    })
}
