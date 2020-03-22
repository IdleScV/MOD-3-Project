function gameSetup() {
	processGameStart();
}
// * Should be a fetch request to DB for question information
function processGameStart() {
	fillGameField();
}

//* inside of our database we need editorText, Question, test, and solution
function fillGameField() {
	//* sets up game data before starts
	let question = 'Write a function that find the sum of all primes up to n\n \n \n function should return the answer';

	let editorText = `function sumOfPrime(n){ \n\n}`;
	let blanks = `\n \n \n \n// Don't remove text below\n`;
	let test = `console.log(sumOfPrime(4))`;
	let questionId = 5;

	//* adds question
	let questionField = document.querySelector('#prompt_field');
	questionField.innerText = question;
	questionField.dataset.questionId = questionId;

	//* adds editor text
	// let consoleText = editorText + blanks + test;
	let consoleText = 'Console is set';
	editor.session.setValue('Console is Set');
	opponent_editor.session.setValue(consoleText);
}

function processAnswer(answer, solution) {}
