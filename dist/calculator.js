var calcInput = document.getElementById('calculation-in');
var resultContainer = document.getElementById('calc-out');
var numBtn = document.querySelectorAll('.number-btn');
var equalsBtn = document.getElementById('equals-btn');
var clearBtn = document.getElementById('clear-btn');
var backspaceBtn = document.getElementById('backspace-btn');
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
    var numbers_1 = "0123456789";
    var operators_1 = "+-*/";
    // the operations
    var operations_1 = {
        "sqrt": "√",
        "log": "log",
        "ln": "ln",
        "cos": "cos",
        "sin": "sin",
        "tan": "tan",
        "cosh": "cosh",
        "sinh": "sinh",
        "tanh": "tanh",
        "acos": "arccos",
        "asin": "arcsin",
        "atan": "arctan"
    };
    // Mathematical constants without backslash
    var mathConstants_1 = {
        "pi": "π",
        "phi": "φ",
        "tau": "τ",
        "e": "𝘦",
        "g": "ℊ",
        "G": "G",
    };
    // the values of the constants
    var mathConstVal_1 = {
        "π": 3.141592653589793,
        "φ": 1.61803398874989484820458683436563811772030917980576286213544862270526046281890244970720720418939113748475408807538689175,
        "𝘦": 2.718281828459045235360287471352662497757247093699959574966967627724076630353,
        "τ": 6.283185307179586,
        "ℊ": 9.81,
        "G": 6.67 * Math.pow(10, -11),
    };
    // General Greek letters requiring a backslash
    var greekLetters_1 = {
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
        var inputText = calcInput.value;
        // Replacement of the mathematical constants because we don't want to put a backslash before them
        for (var key in mathConstants_1) {
            var regex = new RegExp("\\b".concat(key, "\\b"), "g"); // Match whole word
            inputText = inputText.replace(regex, mathConstants_1[key]);
        }
        // Replacement of the other letters that needs backslash
        for (var key in greekLetters_1) {
            var regex = new RegExp("\\" + key, "g"); // Direct match (includes `\`)
            inputText = inputText.replace(regex, greekLetters_1[key]);
        }
        // replacing the operations into their signs
        for (var key in operations_1) {
            var regex = new RegExp("\\b".concat(key, "\\b"), "g");
            inputText = inputText.replace(regex, operations_1[key]);
        }
        // Update the input field if changes were made
        if (calcInput.value !== inputText) {
            calcInput.value = inputText;
        }
    }
    // checking arrays
    function contains(element, str) {
        if (Array.isArray(element)) {
            for (var i = 0; i < element.length; i++) {
                if (element[i] == str) {
                    return true;
                }
            }
        }
        else {
            for (var i = 0; i < Object.keys(element).length; i++) {
                if (element[i] == str) {
                    return true;
                }
            }
        }
        return false;
    }
    // replacing variables with values
    function replaceVariables(input, variables) {
        for (var key in variables) {
            var regex = new RegExp(key, 'g');
            input = input.replace(regex, variables[key].toString());
        }
        return input;
    }
    // replacing mathematical constants with values
    function replaceConstants(input) {
        for (var key in mathConstVal_1) {
            var regex = new RegExp(key, 'g');
            input = input.replace(regex, mathConstVal_1[key].toString());
        }
        return input;
    }
    // evaluating the calculation
    function evaluateExpression() {
        var calculation = calcInput.value; // the input of the user decomposed
        var calc = ""; // initial calc that is gonna be evaluated
        var isValid = true; // variable to see if there is an invalid character
        var variables = {};
        if (calculation.includes("where")) {
            var indexOfWhere = calculation.indexOf("where");
            var slicedCalc = calculation.slice(indexOfWhere + 5);
            var definedVars = slicedCalc.split(";");
            definedVars.forEach(function (variable) {
                var components = variable.split("=");
                if (components.length === 2) {
                    var key = components[0].trim();
                    var value = parseFloat(components[1].trim());
                    if (!isNaN(value)) {
                        variables[key] = value;
                    }
                    if (numbers_1.includes(key)) {
                        isValid = false;
                        return;
                    }
                }
                else {
                    isValid = false;
                    return;
                }
            });
        }
        calculation = replaceVariables(calculation, variables);
        calculation = replaceConstants(calculation);
        if (contains(Object.values(calculation), "√")) {
            calculation = calculation.replace(/√\(?([^)]+)\)?/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.sqrt(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("log")) {
            calculation = calculation.replace(/log\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.log10(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("ln")) {
            calculation = calculation.replace(/ln\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.log(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("cos")) {
            calculation = calculation.replace(/cos\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.cos(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("sin")) {
            calculation = calculation.replace(/sin\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.sin(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("tan")) {
            calculation = calculation.replace(/tan\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.tan(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("cosh")) {
            calculation = calculation.replace(/cosh\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.cosh(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("sinh")) {
            calculation = calculation.replace(/sinh\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.sinh(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("tanh")) {
            calculation = calculation.replace(/tanh\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.tanh(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("arccos")) {
            calculation = calculation.replace(/arccos\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.acos(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("arcsin")) {
            calculation = calculation.replace(/arcsin\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.asin(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        if (calculation.includes("arctan")) {
            calculation = calculation.replace(/arctan\(([^()]+)\)/g, function (_, subExpr) {
                try {
                    var result = eval(subExpr);
                    return Math.atan(result).toString();
                }
                catch (e) {
                    isValid = false;
                    return "error";
                }
            });
        }
        calculation = calculation.split("where")[0].trim();
        // checking if the components are valid
        for (var i = 0; i < calculation.length; i++) {
            var char = calculation[i];
            if (!numbers_1.includes(char) && !operators_1.includes(char) && contains(mathConstants_1, char) && contains(Object.keys(variables), char)) {
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
                var result = eval(calc);
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
    calcInput.addEventListener('input', function () {
        replaceSymbols();
        evaluateExpression();
    });
    // adding an event listener for the buttons
    numBtn.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            var target = event.target;
            calcInput.value += target.innerText;
        });
    });
    equalsBtn.addEventListener('click', evaluateExpression);
    clearBtn.addEventListener('click', function () {
        calcInput.value = "";
        resultContainer.innerHTML = "";
    });
    backspaceBtn.addEventListener('click', function () {
        calcInput.value = calcInput.value.slice(0, -1);
        console.log(calcInput);
    });
}
