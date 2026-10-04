// ------------------------------------------------------------
// Ledger — a small arithmetic calculator driven by form elements.
// Supports addition, subtraction, multiplication, and division.
// ------------------------------------------------------------

const form = document.getElementById("calc-form");
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-btn");
const tapeEl = document.getElementById("tape");
const tapeClearBtn = document.getElementById("tape-clear");

const OP_SYMBOLS = {
  add: "+",
  subtract: "\u2212", // minus sign
  multiply: "\u00d7", // times sign
  divide: "\u00f7",   // division sign
};

function getSelectedOperation() {
  const checked = form.querySelector('input[name="operation"]:checked');
  return checked ? checked.value : "add";
}

function calculate(a, b, operation) {
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      if (b === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return a / b;
    default:
      throw new Error("Unknown operation.");
  }
}

// Format a number for display: trims floating-point noise and
// avoids runaway decimal places, without resorting to scientific
// notation for ordinary-sized results.
function formatResult(value) {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round((value + Number.EPSILON) * 1e9) / 1e9;
  return rounded.toString();
}

function updateExpressionPreview() {
  const a = num1Input.value.trim() === "" ? "0" : num1Input.value;
  const b = num2Input.value.trim() === "" ? "0" : num2Input.value;
  const symbol = OP_SYMBOLS[getSelectedOperation()];
  expressionEl.textContent = `${a} ${symbol} ${b} =`;
}

function addTapeEntry(a, b, operation, resultText) {
  const symbol = OP_SYMBOLS[operation];
  const li = document.createElement("li");

  const expr = document.createElement("span");
  expr.textContent = `${formatResult(a)} ${symbol} ${formatResult(b)}`;

  const res = document.createElement("span");
  res.className = "tape-result";
  res.textContent = resultText;

  li.appendChild(expr);
  li.appendChild(res);
  tapeEl.prepend(li);
}

form.addEventListener("input", () => {
  errorEl.textContent = "";
  updateExpressionPreview();
});

form.addEventListener("change", updateExpressionPreview);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorEl.textContent = "";

  const a = parseFloat(num1Input.value);
  const b = parseFloat(num2Input.value);
  const operation = getSelectedOperation();

  if (Number.isNaN(a) || Number.isNaN(b)) {
    errorEl.textContent = "Enter a number in both fields.";
    return;
  }

  try {
    const value = calculate(a, b, operation);
    const resultText = formatResult(value);

    expressionEl.textContent = `${formatResult(a)} ${OP_SYMBOLS[operation]} ${formatResult(b)} =`;
    resultEl.textContent = resultText;

    addTapeEntry(a, b, operation, resultText);
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

clearBtn.addEventListener("click", () => {
  form.reset();
  errorEl.textContent = "";
  expressionEl.textContent = "0";
  resultEl.textContent = "0";
  num1Input.focus();
});

tapeClearBtn.addEventListener("click", () => {
  tapeEl.innerHTML = "";
});
