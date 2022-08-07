const display = document.querySelector("#currentNum");
const operation = document.querySelector("#operation");
const operands = document.querySelectorAll(".operand");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");
const backspace = document.querySelector("#ec");
const decimal = document.querySelector("#decimal");
const sign = document.querySelector("#sign");
const percent = document.querySelector("#percent");
const displayleftDiv = document.querySelector(".display-left");
let op = "";
let a = "";
let b = "";
let isAfterOperation = false;
let isValid = /^[-]?[\d.e+]+$/;

equals.addEventListener("click", () => {
    if (a !== "" && b !== "") {
        console.log("A DIFERENTE DE NADA / B DIFERENTE DE NADA");
        operate(op, a, b);
    } else if (a !== "" && op) {
        display.textContent = a;
        operation.textContent = a;
        op = "";
    }
});

percent.addEventListener("click", () => {
    if (!op) {
        a = +a / 100;
        display.textContent = a;

    } else {
        b = +b / 100;
        display.textContent = b;
    }
})

sign.addEventListener("click", () => {
    if (!/\d/.exec(display.textContent)) return;
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
});

decimal.addEventListener("click", () => {
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
});

backspace.addEventListener("click", () => {
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
});

operands.forEach(num => {
    num.addEventListener("click", () => {
        if (num.id === "0" && display.textContent === "0") return;
        if (!op) {
            if (isAfterOperation) {
                a = "";
                isAfterOperation = false;
            }
            if (a.length < 9) {
                a += num.id;
                display.textContent = a;
                operation.textContent = a;
            }

        } else {
            if (b.length < 9) {
                b += num.id;
                display.textContent = b;
                operation.textContent = `${a} ${op} ${b}`;
            }
        }
    })
});

operators.forEach(operator => {
    operator.addEventListener("click", () => {
        if (a === "") return;
        if (a && b) {
            operate(op, a, b);
        } else if (op) {
            operate(op, a, a);
        }
        op = operator.id;
        display.textContent = op;
        operation.textContent = `${a} ${op} `;
    })
});

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
    result = round(result)
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
        return "エラー"
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

function round(value) {
    if (value.toString().length >  9) {
        return Number.parseFloat(value).toExponential(3);
    }
    return value;
}