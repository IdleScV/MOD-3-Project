//* Runs after user "logs in" with username
function gameSetup() {
	createButtons();
}

//* Creates 3 buttons
function createButtons() {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	//* Create Room => runs in host.js
	let createRoomBtn = document.createElement('button');
	createRoomBtn.innerText = 'Create Room';
	createRoomBtn.addEventListener('click', CreateRoom);
	//* Find Room => runs in guest.js
	let findRoomBtn = document.createElement('button');
	findRoomBtn.innerText = 'Find Room';
	findRoomBtn.addEventListener('click', findRoom);
	//* logs user out.
	let logoutBtn = document.createElement('button');
	logoutBtn.innerText = 'Logout';
	logoutBtn.addEventListener('click', logout);

	startBtnArea.append(createRoomBtn, findRoomBtn, logoutBtn);
}

//* Fills game field with fetched question
function fillGameField(question) {
	let questionField = document.querySelector('#prompt_field');
	questionField.innerText =
		`${question.attributes.difficulty.toUpperCase()}` +
		`\n Question ID:${question.id}` +
		'\n' +
		question.attributes.questionPrompt;
	questionField.dataset.questionId = question.id;

	//* adds editor text
	let consoleText = question.attributes.editorText;
	editor.session.setValue(consoleText);
}

//! Starts time
function timeStart() {}

//* setup submit button
function submitBtnSetup() {
	let submitBtn = document.querySelector('.submit');

	submitBtn.addEventListener('click', fetchAnswer);
}

//* fetches answer from database after submit button is triggered
function fetchAnswer() {
	let questionId = document.querySelector('#prompt_field').dataset.questionId;
	fetch(URL + `questions/${questionId}`)
		.then((response) => response.json())
		.then((finalTestData) => processAnswer(finalTestData));
}
//* runs answer against function
function processAnswer(finalTestData) {
	let userAnswer = editor.getValue();
	let finalTest = finalTestData.data.attributes.finalText;

	checkAnswer(userAnswer, finalTest);
}
//* checks if answer is correct
function checkAnswer(userAnswer, actualAnswer) {
	let totalCode = userAnswer + '\n' + actualAnswer;
	let ans = eval(totalCode);

	if (ans == true) {
		//*
		playerWin();
	} else {
		console.log('...try again');
	}
}

//* Stops player time & makes a push to check if opponent completed.
function playerWin() {
	alert('You finished');
}

//! LOGS OUT
function logout() {
	console.log('logging out');
	fetch(URL + 'logout').then((response) => response.json()).then((json) => console.log(json));
	userLogin();
}
