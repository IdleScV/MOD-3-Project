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
		gameStartBtn('easy');
	});

	let mediumDifficulty = document.createElement('button');
	mediumDifficulty.innerText = 'Medium';
	mediumDifficulty.addEventListener('click', () => {
		gameStartBtn('medium');
	});

	let hardDifficulty = document.createElement('button');
	hardDifficulty.innerText = 'Hard';
	hardDifficulty.addEventListener('click', () => {
		gameStartBtn('hard');
	});

	startBtnArea.append(easyDifficulty, mediumDifficulty, hardDifficulty);
}

//* game Ready Check
function gameStartBtn(questionDifficulty) {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';

	let startBtn = document.createElement('button');
	startBtn.innerText = `Click if Ready`;
	startBtn.classList = 'startBtn';
	//* Runs gameStart function here
	startBtn.addEventListener('click', () => {
		readyCheck(questionDifficulty);
	});

	startBtnArea.append(startBtn);
}
//! WebSocket Loading aka waiting for opponent to be ready
function readyCheck(questionDifficulty) {
	// let opponentReady = false;
	// if (opponentReady === true) {
	// 	countdown();
	// 	gameStart(questionId);
	// } else {
	// 	waiting();
	// }
	gameStart(questionDifficulty);
}

//! Fetches question and passes it through to fillGameField
function gameStart(questionDifficulty) {
	document.querySelector('#prompt_field button').removeEventListener;
	fetchQuestions(questionDifficulty);
	// timeStart();
	submitBtnSetup();
}

function fetchQuestions(questionDifficulty) {
	fetch(URL + `questions`)
		.then((response) => response.json())
		.then((questions) => processAllQuestions(questions.data, questionDifficulty));
}

function processAllQuestions(allQuestionsData, questionDifficulty) {
	let filteredQuestions = allQuestionsData.filter((question) => question.attributes.difficulty == questionDifficulty);
	let randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
	fillGameField(randomQuestion);
	// debugger;
}

//* Fills game field with fetched question
function fillGameField(question) {
	//* sets up game data before starts
	// debugger;
	//* adds question
	let questionField = document.querySelector('#prompt_field');
	questionField.innerText = question.attributes.difficulty + '\n' + question.attributes.questionPrompt;
	questionField.dataset.questionId = question.id;

	//* adds editor text
	let consoleText = question.attributes.editorText;
	editor.session.setValue(consoleText);
	opponent_editor.session.setValue(consoleText);
}

//! Starts time
function timeStart() {}

//* setup submit button
function submitBtnSetup() {
	let submitBtn = document.querySelector('.submit');

	submitBtn.addEventListener('click', fetchAnswer);
}

//* Runs the answer Checker
function fetchAnswer() {
	let questionId = document.querySelector('#prompt_field').dataset.questionId;
	fetch(URL + `questions/${questionId}`)
		.then((response) => response.json())
		.then((finalTestData) => processAnswer(finalTestData));
}

function processAnswer(finalTestData) {
	// debugger;
	// let finalTest = `\n findSum(1,2) == 3 && findSum(2,2) == 4`;
	let userAnswer = editor.getValue();
	let finalTest = finalTestData.data.attributes.finalText;

	checkAnswer(userAnswer, finalTest);
}

function checkAnswer(userAnswer, actualAnswer) {
	let totalCode = userAnswer + '\n' + actualAnswer;
	// debugger;
	let ans = eval(totalCode);
	// debugger;
	if (ans == true) {
		//*
		playerWin();
	} else {
		console.log('...try again');
	}
}

//* Stops player time & begins continuous fetch 5 times a second for when opponent finishes.
function playerWin() {
	alert('You finished');
}
