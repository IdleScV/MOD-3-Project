//! TRIGGERED BY GAMESETUP()
function gameSetup() {
	// createButtons();
	chooseQuestion();
}

function createButtons() {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	//* Create Room
	let createRoomBtn = document.createElement('button');
	createRoomBtn.innerText = 'Create Room';
	createRoomBtn.addEventListener('click', CreateRoom);
	//* Find Room
	let findRoomBtn = document.createElement('button');
	findRoomBtn.innerText = 'Find Room';
	findRoomBtn.addEventListener('click', findRoom);
	//* Logout
	let logoutBtn = document.createElement('button');
	logoutBtn.innerText = 'Logout';
	logoutBtn.addEventListener('click', logout);

	startBtnArea.append(createRoomBtn, findRoomBtn, logoutBtn);
}

//! Need work
function CreateRoom() {
	console.log('creating room');
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	//! WebSocket
	let roomNumber = Math.floor(Math.random() * Math.floor(999999));
	startBtnArea.innerText = `Your Room Number is ${roomNumber}\nWaiting for Friend to join`;
}

function findRoom() {
	console.log('finding room');
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = `<form id='room_form'>
	<label>Your Friend's Room #:</label><br>
	<input type="text" id="roomNumber" name="roomNumber"><br>
	<input type="submit" value="Submit">
  </form> <form>`;
	let roomNumberInput = document.querySelector('#room_form');
	roomNumberInput.addEventListener('submit', submitRoomNumber);
}

//! Need work
function submitRoomNumber(event) {
	event.preventDefault();
	let roomNumber = event.currentTarget.roomNumber.value;
	console.log(roomNumber);
	//! WebSocket
}

function logout() {
	console.log('logging out');
	fetch(URL + 'logout').then((response) => response.json()).then((json) => console.log(json));
	userLogin();
}

//* game Choose Question
//! Once data seeded, randomize game start btn number
function chooseQuestion() {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';

	let easyDifficulty = document.createElement('button');
	easyDifficulty.innerText = 'Easy';
	easyDifficulty.addEventListener('click', () => {
		gameStartBtn(3);
	});

	let mediumDifficulty = document.createElement('button');
	mediumDifficulty.innerText = 'Medium';
	mediumDifficulty.addEventListener('click', () => {
		gameStartBtn(3);
	});

	let hardDifficulty = document.createElement('button');
	hardDifficulty.innerText = 'Hard';
	hardDifficulty.addEventListener('click', () => {
		gameStartBtn(4);
	});

	startBtnArea.append(easyDifficulty, mediumDifficulty, hardDifficulty);
}

//* game Ready Check
function gameStartBtn(questionId) {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';

	let startBtn = document.createElement('button');
	startBtn.innerText = `Click if Ready`;
	startBtn.classList = 'startBtn';
	//* Runs gameStart function here
	startBtn.addEventListener('click', () => {
		readyCheck(questionId);
	});

	startBtnArea.append(startBtn);
}
//! WebSocket Loading aka waiting for opponent to be ready
function readyCheck(questionId) {
	// let opponentReady = false;
	// if (opponentReady === true) {
	// 	countdown();
	// 	gameStart(questionId);
	// } else {
	// 	waiting();
	// }
	gameStart(questionId);
}

//! Fetches question and passes it through to fillGameField
function gameStart(id) {
	document.querySelector('#prompt_field button').removeEventListener;
	fetchQuestion(id);
	timeStart();
	submitBtnSetup();
}

function fetchQuestion(id) {
	fetch(URL + `questions/${id}`).then((response) => response.json()).then((question) => processQuestion(question, id));
}

function processQuestion(questionData, questionId_num) {
	// let questionPrompt = 'Write a function that finds sum';
	// let editorText = `function findSum(a, b){ \n\n}\n \n \n \n// Don't remove text below\nconsole.log(findSum(1,2) == 3)\nconsole.log(findSum(2,2) == 4)`;
	// let questionId = 1;
	let questionSet = questionData.data.attributes;
	// debugger;
	let questionPrompt = questionSet.questionPrompt;
	let editorText = questionSet.editorText;
	let questionId = questionId_num;
	fillGameField(questionPrompt, editorText, questionId);
}

//* Fills game field with fetched question
function fillGameField(question, editorText, questionId) {
	//* sets up game data before starts

	//* adds question
	let questionField = document.querySelector('#prompt_field');
	questionField.innerText = question;
	questionField.dataset.questionId = questionId;

	//* adds editor text
	let consoleText = editorText;
	editor.session.setValue(consoleText);
	opponent_editor.session.setValue(consoleText);
}

//! Starts time
function timeStart() {}

//* setup submit button
function submitBtnSetup() {
	let submitBtn = document.querySelector('.submit');
	submitBtn.addEventListener('click', () => {
		fetchAnswer(editor.getValue(), document.querySelector('#prompt_field').dataset.questionId);
	});
}

//* Runs the answer Checker
function fetchAnswer(answer, questionId_type_id) {
	fetch(URL + `questions/${questionId_type_id}`)
		.then((response) => response.json())
		.then((finalTestData) => processAnswer(answer, finalTestData));
}

function processAnswer(answerData, finalTestData) {
	// let finalTest = `\n findSum(1,2) == 3 && findSum(2,2) == 4`;
	let finalTest = finalTestData.data.attributes.finalText;

	checkAnswer(answerData, finalTest);
}

function checkAnswer(userAnswer_type_code, actualAnswer_type_code) {
	let totalCode = userAnswer_type_code + '\n' + actualAnswer_type_code;
	let ans = eval(totalCode);
	if (ans === true) {
		//*
		playerWin();
	} else {
		alert('. . . Try Again');
	}
}

//* Stops player time & begins continuous fetch 5 times a second for when opponent finishes.
function playerWin() {
	alert('You finished');
}
