"use strict";
let calcInput = document.getElementById('calculation-in');
let resultContainer = document.getElementById('calc-out');
let numBtn = document.querySelectorAll('.number-btn');
let equalsBtn = document.getElementById('equals-btn');
let clearBtn = document.getElementById('clear-btn');
let backspaceBtn = document.getElementById('backspace-btn');
if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, start) {
        return this.indexOf(search, start) !== -1;
    };
}
// checking if they do not correspond to what we want
if (!calcInput || !resultContainer || !equalsBtn || !clearBtn || !backspaceBtn) {
    console.error("One or more required elements are missing from the DOM.");
}
else {
    const numbers = "0123456789";
    const operators = "+-*/";
    // Greek letter mappings
    const greekLetters = {
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
        "\\pi": "π",
        "\\rho": "ρ",
        "\\sigma": "σ",
        "\\tau": "τ",
        "\\upsilon": "υ",
        "\\phi": "φ",
        "\\chi": "χ",
        "\\psi": "ψ",
        "\\omega": "ω",
        // Uppercase Greek letters
        "\\Alpha": "Α",
        "\\Beta": "Β",
        "\\Gamma": "Γ",
        "\\Delta": "Δ",
        "\\Epsilon": "Ε",
        "\\Zeta": "Ζ",
        "\\Eta": "Η",
        "\\Theta": "Θ",
        "\\Iota": "Ι",
        "\\Kappa": "Κ",
        "\\Lambda": "Λ",
        "\\Mu": "Μ",
        "\\Nu": "Ν",
        "\\Xi": "Ξ",
        "\\Omicron": "Ο",
        "\\Pi": "Π",
        "\\Rho": "Ρ",
        "\\Sigma": "Σ",
        "\\Tau": "Τ",
        "\\Upsilon": "Υ",
        "\\Phi": "Φ",
        "\\Chi": "Χ",
        "\\Psi": "Ψ",
        "\\Omega": "Ω"
    };
    function replaceSymbols() {
        let inputText = calcInput.value;
        // Sort keys by length in descending order to replace longer ones first
        let sortedKeys = Object.keys(greekLetters).sort((a, b) => b.length - a.length);
        for (let key of sortedKeys) {
            let regex = new RegExp(key.replace(/\\/g, "\\\\"), "g");
            inputText = inputText.replace(regex, greekLetters[key]);
        }
        if (calcInput.value !== inputText) {
            calcInput.value = inputText;
        }
    }
    // evaluating the calculation
    function evaluateExpression() {
        let calculation = calcInput.value.split(""); // the input of the user decomposed
        let calc = ""; // initial calc that is gonna be evaluated
        let isValid = true; // variable to see if there is an invalid character
        // checking if the components are valid
        for (let i = 0; i < calculation.length; i++) {
            let char = calculation[i];
            if (!numbers.includes(char) && !operators.includes(char)) {
                console.log("invalid input");
                isValid = false; // tells that there is an invalid character and doesn't let it continue
                break;
            }
            else {
                calc += char;
            }
        }
        if (isValid) {
            try {
                let result = eval(calc);
                // putting the result in the result container
                resultContainer.innerHTML = result;
            }
            catch (e) {
                console.error(e);
                resultContainer.innerHTML = "Error";
            }
        }
        else {
            resultContainer.innerHTML = "invalid input";
        }
    }
    // event listener for when we enter the calculation
    calcInput.addEventListener('input', () => {
        console.log("kevin");
        replaceSymbols();
        evaluateExpression();
    });
    // adding an event listener for the buttons
    numBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const target = event.target;
            calcInput.value += target.innerText;
        });
    });
    equalsBtn.addEventListener('click', evaluateExpression);
    clearBtn.addEventListener('click', () => {
        calcInput.value = "";
        resultContainer.innerHTML = "";
    });
    backspaceBtn.addEventListener('click', () => {
        calcInput.value = calcInput.value.slice(0, -1);
        console.log(calcInput);
    });
}
