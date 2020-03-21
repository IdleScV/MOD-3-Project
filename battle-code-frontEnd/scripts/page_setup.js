document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup() {
	overrideDefault();
	keySetup();
	btnSetup();
	gameSetup();
	// console.clear()
}

// * every character input on browser sends code to database
function keySetup() {
	document.addEventListener('keyup', sendCodeContent);
}

// * Sends current code to databse
function sendCodeContent(event) {
	//* This should be a post requst
	showOpponentCode(editor.getValue());
	//* then, trigger a get request for the opponent's code
}

// * shows the fetched code from opponent
function showOpponentCode(data) {
	opponent_editor.session.setValue(data);
}

//* setup submit button
function btnSetup() {
	document.querySelector('.submit').onclick = submitCode;

	document.querySelector('.clear').onclick = console.clear;

	let runBtn = document.querySelector('.execute');
	runBtn.addEventListener('click', function() {
		eval(editor.getValue());
	});
}

//* runs submit button
function submitCode() {
	let codeToSubmit = document.querySelector('.ace_content').innerText;
	let answer = codeToSubmit;
	let k = eval(answer);
	// debugger;
}
