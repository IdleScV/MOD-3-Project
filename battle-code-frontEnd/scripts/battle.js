//! TRIGGERED BY GAMESETUP()
function gameSetup() {
	createButtons();
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

//! CREATES ROOM
function CreateRoom() {
	console.log('creating room');
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	let roomNumber = Math.floor(Math.random() * Math.floor(999999));
	startBtnArea.innerText = `Your Room Number is ${roomNumber}\nWaiting for Friend to join`;
	fetchCreateRoom(roomNumber);
}

function fetchCreateRoom(roomNumber) {
	let player1Id = localStorage.getItem('currentUserId');
	let payload = {
		player1_id: parseInt(player1Id),
		player2_id: 0,
		room_number: roomNumber,
		state: 1
	};
	localStorage.setItem('roomNumber', roomNumber);

	fetch(URL + 'rooms', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((json) => waitForOpponent());
}

function waitForOpponent(data) {
	let roomNumber = localStorage.getItem('roomNumber');
	fetch(URL + 'rooms/' + roomNumber)
		.then((response) => response.json())
		.then((roomData) => checkRoomForOpponent(roomData));
}
//* waits 0.5 seconds before searches again
function checkRoomForOpponent(roomData) {
	let opponent = roomData.data.attributes.player2;
	if (opponent.id == 0) {
		console.log('Checking again for player');
		continueSearch();
	} else {
		localStorage.setItem('roomId', roomData.data.id);
		console.log('Player has joined the lobby');
		showOpponentName(roomData.data.attributes.player2.username);
	}
}

function continueSearch() {
	setTimeout(function() {
		waitForOpponent();
		console.clear();
	}, 500);
}

//* Found Room
function showOpponentName(name) {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = `<p>${name} has joined the room</p>`;
	setTimeout(function() {
		chooseQuestion();
	}, 3000);
}

//! FINDS ROOM
function findRoom() {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = `<form id='room_form'>
	<label>Your Friend's Room #:</label><br>
	<input type="text" id="roomNumber" name="roomNumber"><br>
	<input type="submit" value="Submit">
  </form> <form>`;
	let roomNumberInput = document.querySelector('#room_form');
	roomNumberInput.addEventListener('submit', submitRoomNumber);
}

function submitRoomNumber(event) {
	event.preventDefault();
	let roomNumber = event.currentTarget.roomNumber.value;

	fetch(URL + 'rooms/' + roomNumber)
		.then((response) => response.json())
		.then((roomData) => checkRoomNumber(roomData, roomNumber));
}

function checkRoomNumber(roomData, roomNumber) {
	if (roomData.message) {
		console.log('This Room Does Not Exist');
		findRoom();
	} else if (roomData.data.attributes.player2.id == 0) {
		console.log('Found Room');
		updateRoomWithPlayer(roomData.data);
		localStorage.setItem('roomNumber', roomNumber);
	} else {
		console.log('This Room Is Not Open');
		findRoom();
	}
}

function updateRoomWithPlayer(roomData) {
	let roomId = roomData.id;
	let roomNumber = localStorage.getItem('roomNumber');
	let userId = localStorage.getItem('currentUserId');
	let payload = {
		player2_id: parseInt(userId),
		state: 2
	};
	fetch(URL + 'rooms/' + roomId, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((json) => waitingForQuestionToBeSelected(json));
}

function waitingForQuestionToBeSelected(json) {
	let startBtnArea = document.querySelector('#prompt_field');
	localStorage.setItem('OpponentUserName', json.data.attributes.player1.username);
	let opponentName = localStorage.getItem('OpponentUserName');
	startBtnArea.innerHTML = `<br><p>Waiting on ${opponentName} to pick a question difficulty</p>`;
	fetchingQuestionReadyState();
}

function fetchingQuestionReadyState() {
	let roomNumber = localStorage.getItem('roomNumber');
	fetch(URL + 'rooms/' + roomNumber)
		.then((response) => response.json())
		.then((roomData) => processRoomState(roomData.data.attributes));
}

function processRoomState(roomData) {
	let state = roomData.state;
	if (state != 3) {
		setTimeout(function() {
			fetchingQuestionReadyState();
			console.log('checking again');
		}, 1000);
	} else {
		console.log('Question Picked');
	}
}

//! LOGS OUT
function logout() {
	console.log('logging out');
	fetch(URL + 'logout').then((response) => response.json()).then((json) => console.log(json));
	userLogin();
}

//* game Choose Question
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
	let roomId = localStorage.getItem('roomId');
	let payload = { state: 3 };
	fetch(URL + 'rooms/' + roomId, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(payload)
	});
	// .then((response) => beginShareScreenHost());

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

function beginShareScreenHost() {
	let payload = {
		userSolution: editor.getValue()
	};
	fetch(URL + 'battle_data', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
}

//! WebSocket Loading aka waiting for opponent to be ready
function readyCheck(questionDifficulty) {
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
	let userAnswer = editor.getValue();
	let finalTest = finalTestData.data.attributes.finalText;

	checkAnswer(userAnswer, finalTest);
}

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

//* Stops player time & begins continuous fetch 5 times a second for when opponent finishes.
function playerWin() {
	alert('You finished');
}
