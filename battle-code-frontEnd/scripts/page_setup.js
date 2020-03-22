document.addEventListener('DOMContentLoaded', pageSetup);
editor.session.setValue('Console is Set');
function pageSetup() {
	// overrideDefault();
	// keySetup();
	// btnSetup();
	// gameSetup();
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
	runBtn.addEventListener('click', submitCode);
}

//* runs submit button
function submitCode() {
	//* Fetch user answer
	let codeToSubmit = document.querySelector('.ace_content').innerText;
	//! OR
	let codeToSubmit = editor.getValue();

	//* send user Answer + QuestionID to process in battle.js
	let questionId = document.querySelector('#prompt_field').dataset.questionId;

	processAnswer(codeToSubmit, questionId);
}
