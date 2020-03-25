//! CREATES ROOM
function CreateRoom() {
	console.log('creating room');
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	let roomNumber = Math.floor(Math.random() * Math.floor(999999));
	startBtnArea.innerText = `Your Room Number is ${roomNumber}\nWaiting for Friend to join`;
	fetchCreateRoom(roomNumber);
}

//* uses random room number to create new room instance
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

//* waits for a guest to join the room
function waitForOpponent(data) {
	let roomNumber = localStorage.getItem('roomNumber');
	fetch(URL + 'rooms/' + roomNumber)
		.then((response) => response.json())
		.then((roomData) => checkRoomForOpponent(roomData));
}
function checkRoomForOpponent(roomData) {
	let opponent = roomData.data.attributes.player2;
	if (opponent.id == 0) {
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
	}, 200);
}

//* Opponent Joins Room, shows guest name & pauses for 3 seconds
function showOpponentName(name) {
	let startBtnArea = document.querySelector('#prompt_field');
	localStorage.setItem('opponentUserName', name);
	startBtnArea.innerHTML = `<p>${name} has joined the room</p>`;
	setTimeout(function() {
		chooseQuestion();
	}, 3000);
}

//* shows question selection
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

//* Game difficulty is chosen, creates ready button before question is fetched
function gameStartBtn(difficulty) {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';

	let startBtn = document.createElement('button');
	startBtn.innerText = `Click if Ready`;
	startBtn.classList = 'startBtn';
	//* Runs gameStart function here
	startBtn.addEventListener('click', () => {
		fetchQuestions(difficulty);
	});

	startBtnArea.append(startBtn);
}

//* once ready button is clicked, we fetch the question
function fetchQuestions(questionDifficulty) {
	fetch(URL + `questions`)
		.then((response) => response.json())
		.then((questions) => processAllQuestions(questions.data, questionDifficulty));
}

//* question is processed & we update the room state to 3
function processAllQuestions(allQuestionsData, questionDifficulty) {
	let filteredQuestions = allQuestionsData.filter((question) => question.attributes.difficulty == questionDifficulty);
	let randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

	let roomId = localStorage.getItem('roomId');
	let payload = { state: 3 };
	fetch(URL + 'rooms/' + roomId, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((json) => beginShareScreenHost(json, randomQuestion.id));

	localStorage.setItem('Host', 'true');
	fillGameField(randomQuestion);
	submitBtnSetup();
}

//* New battle instance is also created, providing the question ID to our guest
function beginShareScreenHost(roomData, questionId) {
	let roomInfo = roomData.data.attributes;
	let payload = {
		user_id: roomInfo.player1.id,
		opponent_id: roomInfo.player2.id,
		question_id: parseInt(questionId),
		room_id: parseInt(roomData.data.id)
	};

	fetch(URL + 'battles', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((json) => createBattleDatum(json));
}

//* battle data is created also, to allow display of code.
function createBattleDatum(battleData) {
	localStorage.setItem('currentBattleId', battleData.id);

	fetch(URL + 'battle_data/' + battleData.id, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userSolution: editor.getValue() })
	});
}
