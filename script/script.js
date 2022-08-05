let displayValue = ""

const display = document.querySelector("#currentNum");
const numbers = document.querySelectorAll(".number");

numbers.forEach(num => {
    num.addEventListener("click", () => addCurrentToDisplay(num.id))})

function addCurrentToDisplay(value) {
    if(display.textContent.length < 10) {
        display.textContent += value;
    }
}