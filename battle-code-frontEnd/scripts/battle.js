//! TRIGGERED BY GAMESETUP()
function gameSetup() {
	gameStartBtn();
}

function gameStartBtn() {
	let startBtnArea = document.querySelector('#prompt_field');
	let startBtn = document.createElement('button');
	startBtn.innerText = 'Click here to start';
	startBtn.classList = 'startBtn';
	startBtn.addEventListener('click', gameStart);

	startBtnArea.append(startBtn);
}

//! Fetches question and passes it through to fillGameField
function gameStart() {
	document.querySelector('#prompt_field button').removeEventListener;
	btnSetup();
	timeStart();
	// let question = 'Write a function that find the sum of all primes up to n\n \n \n function should return the answer';
	// let editorText = `function sumOfPrime(n){ \n\n}`;
	// let test = `console.log(sumOfPrime(4))`;
	// let questionId = 5;

	let question = 'Write a function that finds sum';
	let editorText = 'function findSum(a, b){ \n\n}';
	let test = `console.log(findSum(1,2) == 3)\nconsole.log(findSum(2,2) == 4)`;
	let questionId = 1;
	fillGameField(question, editorText, test, questionId);
}
//* setup submit/run/clear buttons
function btnSetup() {
	let submitBtn = document.querySelector('.submit');
	submitBtn.addEventListener('click', () => {
		processAnswer(editor.getValue(), document.querySelector('#prompt_field').dataset.questionId);
	});

	let runBtn = document.querySelector('.execute');
	runBtn.addEventListener('click', () => {
		eval(editor.getValue());
	});

	document.querySelector('.clear').onclick = console.clear;
}

//! Fills game field with fetched question
//! inside of our database we need editorText, Question, test, and solution
function fillGameField(question, editorText, test, questionId) {
	//* sets up game data before starts

	let blanks = `\n \n \n \n// Don't remove text below\n`;

	//* adds question
	let questionField = document.querySelector('#prompt_field');
	questionField.innerText = question;
	questionField.dataset.questionId = questionId;

	//* adds editor text
	let consoleText = editorText + blanks + test;
	// let consoleText = 'Console is set';
	editor.session.setValue(consoleText);
	opponent_editor.session.setValue(consoleText);
}

//! Runs the answer Checker
function processAnswer(answer_type_code, questionId_type_id) {
	// * this is what should run after database is set
	// fetch(URL + questionId).then(response => response.json()).then(json => checkAnswer(answer, json))
	// checkAnswer(answer_type_code, questionId_type_id);

	let exampleTest = '';
	checkAnswer(answer_type_code, exampleTest);
}

function checkAnswer(userAnswer_type_code, actualAnswer_type_code) {
	console.log(userAnswer_type_code);

	// console.log(eval(userAnswer_type_code + actualAnswer_type_code));
}

function timeStart() {}
