const display = document.querySelector("#currentNum");
const operation = document.querySelector("#operation");
const operandBtns = document.querySelectorAll(".operand");
const operatorBtns = document.querySelectorAll(".operator");
const equalsBtn = document.querySelector("#equals");
const backspaceBtn = document.querySelector("#ec");
const clearBtn = document.querySelector("#ac");
const decimalBtn = document.querySelector("#decimal");
const signBtn = document.querySelector("#sign");
const percentBtn = document.querySelector("#percent");
const displayleftDiv = document.querySelector(".display-left");
const isValid = /^[-]?[\d.e+]+$/;
const isNumber = /\d/;
let op = "";
let a = "";
let b = "";
let isAfterOperation = false;

decimalBtn.addEventListener("click", () => setDecimal());
clearBtn.addEventListener("click", () => clear());
backspaceBtn.addEventListener("click", () => backspace());
equalsBtn.addEventListener("click", () => equals());
percentBtn.addEventListener("click", () => percent());
signBtn.addEventListener("click", () => sign());
operandBtns.forEach(operand => operand.addEventListener("click", () => updateOperand(operand.id)));
operatorBtns.forEach(operator => operator.addEventListener("click", () => updateOperator(operator.id)));

document.addEventListener("keydown", (e) => {
if (isNumber.exec(e.key)) updateOperand(e.key);
    else if (e.key === ".") setDecimal();
    else if (e.key === "Backspace") backspace();
});

function clear() {
    a = "";
    b = "";
    op = "";
    display.textContent = a;
    operation.textContent = a;
}

function backspace() {
    if (operation.textContent.endsWith(" ")) {
        return;
    }
    display.textContent = display.textContent.slice(0, display.textContent.length - 1);
    if (!isAfterOperation) {
        operation.textContent = operation.textContent.slice(0, operation.textContent.length - 1);
    }
    if (!isValid.exec(display.textContent)) {
        display.textContent = "";
    }
    if (!op) {
        a = display.textContent;
        operation.textContent = a;
    } else {
        b = display.textContent;
        operation.textContent = `${a} ${op} ${b}`
    }
}

function setDecimal() {
    if (Array.from(display.textContent).includes(".") || operation.textContent.slice(-1) === " " || !a) return;
    if (!op) {
        isAfterOperation = false;
        a += ".";
        display.textContent = a;
        operation.textContent = a;
    } else {
        b += ".";
        display.textContent = b;
        operation.textContent = `${a} ${op} ${b}`
    }
}

function equals() {
    if (a !== "" && b !== "") {
        operate(op, a, b);
    } else if (a !== "" && op) {
        display.textContent = a;
        operation.textContent = a;
        op = "";
        isAfterOperation = true;
    }
}

function percent() {
    if (!op) {
        if (a === "") return;
        a = setScientificNotation(+a / 100).toString();
        display.textContent = a;
        operation.textContent = a;

    } else {
        if (b === "") return;
        b = setScientificNotation(+b / 100).toString();
        display.textContent = b;
        operation.textContent = `${a} ${op} ${b}`;
    }
}

function sign() {
    if (!isNumber.exec(display.textContent)) return;
    if (display.textContent.charAt(0) === "-") {
        display.textContent = display.textContent.slice(1);
    } else {
        display.textContent = "-" + display.textContent;
    }
    if (!op) {
        a = display.textContent;
    } else {
        b = display.textContent;
    }
}

function updateOperand(operand) {
    if (operand === "0" && display.textContent === "0") return;
    if (!op) {
        if (isAfterOperation) {
            a = "";
            isAfterOperation = false;
        }
        if (a.length < 9) {
            a += operand;
            display.textContent = a;
            operation.textContent = a;
        }

    } else {
        if (b.length < 9) {
            b += operand;
            display.textContent = b;
            operation.textContent = `${a} ${op} ${b}`;
        }
    }
}

function updateOperator(operator) {
    if (a === "") return;
    if (a && b) {
        operate(op, a, b);
    } else if (op) {
        operate(op, a, a);
    }
    op = operator;
    display.textContent = op;
    operation.textContent = `${a} ${op} `;
}

function setScientificNotation(value) {
    if (value.toString().length > 9) {
        return Number.parseFloat(value).toExponential(3);
    }
    return value;
}

function operate(opr, numA, numB) {
    if (!isValid.exec(numA) && !isValid.exec(numB)) return;
    result = "";
    switch (opr) {
        case "+":
            result = addition(numA, numB);
            break;
        case "-":
            result = subtraction(numA, numB);
            break;
        case "*":
            result = multiplication(numA, numB);
            break;
        case "/":
            result = division(numA, numB);
            break;
    }
    result = setScientificNotation(result);
    a = result;
    b = "";
    op = "";
    addToHistory(numA, opr, numB, result);
    isAfterOperation = true;
    display.textContent = result;
    operation.textContent = a;
}

function addition(a, b) {
    return +a + +b;
}

function subtraction(a, b) {
    return +a - +b;
}

function division(a, b) {
    if (b === "0") {
        return "エラー";
    }
    return +a / +b;
}

function multiplication(a, b) {
    return +a * +b;
}

function addToHistory(a, op, b, result) {
    const span = document.createElement("span");
    span.textContent = `${a} ${op} ${b} = ${result}`;
    span.className = "history"
    displayleftDiv.insertBefore(span, operation);
    while (displayleftDiv.childElementCount > 4) {
        displayleftDiv.removeChild(displayleftDiv.firstChild);
    }
}