
const calcKeys = document.querySelector('.all-buttons');
const userInput = document.querySelector('#user-input');
const calculator = document.querySelector('.calculator');
const displayResult = document.querySelector('#result');
let isEqualsPressed = false;
let equation = 0; //separate variable to calculate equation in backend
let checkForDecimal = ''; //to store each number and check if decimal is pressed

calcKeys.addEventListener('click', (event) => {

	//Check if click is on the button and not on the container
	if(!event.target.closest('button')) return;

	const key = event.target;
	const keyValue = key.textContent;
	let inputDisplay = userInput.textContent;
	const { type } = key.dataset;
	const { previousKeyType } = calculator.dataset;
		
	//If any number button is pressed
	if(type === 'number' && !isEqualsPressed) {
		/*
			1. Inital screen display is 0
			2. replace initial display with user input if number is pressed
			3. else concat with operator
			4. if screen display is anything other than number concat the display
		*/
		if (inputDisplay === '0') {
			userInput.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
			equation = (previousKeyType === 'operator') ? equation + key.value : key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}else {
			userInput.textContent = inputDisplay + keyValue;
			equation = equation + key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}
	}

	/*
		1. Check if operator is pressed AND Equals To (=) is not yet pressed
		2. Replace checkForDecimal with blank to store next number
	*/
	if (type === 'operator' && previousKeyType !== 'operator' && !isEqualsPressed) {
		//calculator.dataset.firstNumber = checkForDecimal;
		// calculator.dataset.operator = key.id;
		checkForDecimal = '';
		userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
		equation = equation + ' ' + key.value + ' ';

	}

	/*
		1. Check if Decimal button is pressed AND Equals To (=) is not yet pressed
		2. AND was a previously pressed button a number or was display a 0
		3. #2 required so that if user presses decimal after operator, it is not displayed
		4. check if the number already contains a decimal
	*/
	if (type === 'decimal' && (previousKeyType === 'number' || inputDisplay === '0') && !isEqualsPressed) {
		if (!checkForDecimal.includes('.')) {
			userInput.textContent = inputDisplay + keyValue;
			equation = equation + key.value;
			checkForDecimal = checkForDecimal + keyValue;
		}
	}

	if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
		if (type === 'backspace') {
			userInput.textContent = inputDisplay.substring(0, inputDisplay.length - 1);
			equation = equation.substring(0, equation.length - 1);
			checkForDecimal = checkForDecimal.substring(0, checkForDecimal.length - 1);
		} else {
			inputDisplay = '0';
			userInput.textContent = inputDisplay;
			displayResult.value = '';
			isEqualsPressed = false;
			equation = '';
			checkForDecimal = '';
		}

	}

	//Send equation for calculation after Equals To (=) is pressed
	if (type === 'equal') {
    	// Perform a calculation
	    isEqualsPressed = true;
	    const finalResult = handleEquation(equation);
	    
	    if (finalResult || finalResult === 0) {
	    	displayResult.textContent = finalResult;
	    } else {
	    	displayResult.textContent = 'Math Error';	
	    }
	    
  }

	calculator.dataset.previousKeyType = type;
})

//Function to calculate result based on each operator
function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

    if (operator === 'plus' || operator === '+') return firstNumber + secondNumber;
    if (operator === 'minus' || operator === '-') return firstNumber - secondNumber;
    if (operator === 'multiply' || operator === 'x') return firstNumber * secondNumber;
    if (operator === 'divide' || operator === '/') return firstNumber / secondNumber;
    if (operator === 'remainder' || operator === '%') return firstNumber % secondNumber;
}

function handleEquation(equation) {

	equation = equation.split(" ");
	const operators = ['/', 'x', '%', '+', '-'];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	/*  
		1. Perform calculations as per BODMAS Method
		2. For that use operators array
		3. after calculation of 1st numbers replace them with result
		4. use splice method

	*/
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i])) {
			operatorIndex = equation.findIndex(item => item === operators[i]);
			firstNumber = equation[operatorIndex-1];
			operator = equation[operatorIndex];
			secondNumber = equation[operatorIndex+1];
			console.log(firstNumber, operator, secondNumber);
			result = calculate(firstNumber, operator, secondNumber);
			equation.splice(operatorIndex - 1, 3, result);
		}
	}

	return result;
}

// Event Listener for keyboard button press
document.addEventListener('keydown', (event) => {
	
	let getOperators = {
		'/': 'divide',
		'x': 'multiply',
		'*': 'multiply',
		'%': 'remainder',
		'+': 'plus',
		'-': 'minus'
	}

	if(!isNaN(event.key) && event.key !== ' '){
		document.getElementById(`digit-${event.key}`).click();
	}
	if (['/', 'x', '+', '-', '*', '%'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
	}
	if (event.key === 'Backspace' || event.key ==='c' || event.key === 'C') {
		document.getElementById('clear').click();	
	}
	if (event.key === '=') {
		document.getElementById('equals').click();	
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();	
	}
});
