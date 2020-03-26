//* Runs after user "logs in" with username
function gameSetup() {
	createButtons();
	checkBattleId();
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

//* Create fake liveShare system
function fauxLiveShare() {
	let battleDataId = localStorage.getItem('currentBattleId');
	let hostStatus = localStorage.getItem('Host');

	checkIfHost(battleDataId, hostStatus);
}

function checkIfHost(battleDataId, hostStatus) {
	let code = editor.getValue();
	let payload = {};
	debugger;
	if (hostStatus == 'true') {
		payload = { userSolution: code };
	} else {
		payload = { opponentSolution: code };
	}
	pushCodeAndUpdate(battleDataId, payload);
}

function pushCodeAndUpdate(battleDataId, payload) {
	fetch(URL + 'battle_data/' + battleDataId, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((json) => updateOpponentCode(json));
}

function updateOpponentCode(json) {
	console.log(json);
	setTimeout(function() {
		fauxLiveShare();
	}, 2000);
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

function checkBattleId() {
	let currentBattleId = localStorage.getItem('currentBattleId');
	if (currentBattleId) {
		console.log('found id');
		keyPressFetch(currentBattleId);
	} else {
		console.log('no id');
		setTimeout(function() {
			checkBattleId();
		}, 2000);
	}
}

function keyPressFetch(currentBattleId) {
	document.addEventListener('keydown', (e) => {
		handleKeyDown(currentBattleId);
	});
}

function handleKeyDown(battleId) {
	// console.log(editor.getValue());
	let host = localStorage.Host;
	let code = editor.getValue();
	if (host == 'true') {
		fetch(URL + 'battle_data/' + battleId, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userSolution: code })
		})
			.then((response) => response.json())
			.then((data) => opponent_editor.session.setValue(data.opponentSolution));
	} else if (host == 'false') {
		fetch(URL + 'battle_data/' + battleId, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ opponentSolution: code })
		})
			.then((response) => response.json())
			.then((data) => opponent_editor.session.setValue(data.userSolution));
	}
}
