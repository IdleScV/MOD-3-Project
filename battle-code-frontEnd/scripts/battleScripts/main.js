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
//! LOGS OUT
function logout() {
	console.log('logging out');
	fetch(URL + 'logout').then((response) => response.json()).then((json) => console.log(json));
	userLogin();
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
	timeStart();
}

//! Starts time
function timeStart() {
	let mainTimer = document.querySelector('#main_timer');
	let myTimer = document.querySelector('#my_timer');
	let opponentTimer = document.querySelector('#opponent_timer');

	let currentTime = 0;
	let convertedTime = '';
	let allTimers = [ mainTimer, myTimer, opponentTimer ];
	setInterval(function() {
		currentTime += 1;
		convertedTime = convertTime(currentTime);
		allTimers.forEach((timer) => (timer.innerText = convertedTime));
	}, 1000);
}

function convertTime(s) {
	let seconds = s % 60;
	let minutes = Math.floor(s / 60);
	let time = [ minutes, seconds ];
	for (let i = 0; i < time.length; i++) {
		if (time[i].toString().length == 1) {
			time[i] = '0' + time[i].toString();
		}
	}
	return time.join(':');
}

//! Starts posting user code and fetching opponent code
function checkBattleId() {
	let currentBattleId = localStorage.getItem('currentBattleId');
	if (currentBattleId) {
		// console.log('found id');
		codeFetchBegin(currentBattleId);
	} else {
		setTimeout(function() {
			checkBattleId();
		}, 2000);
	}
}
//* runs every .5 seconds
function codeFetchBegin(currentBattleId) {
	setInterval(function() {
		runFetchSequence(currentBattleId);
	}, 500);
}

function runFetchSequence(battleId) {
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

//! Setup Submit Button
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
		playerWin();
	} else {
		console.log('...try again');
	}
}

//* Stops player time & makes a push to check if opponent completed.
function playerWin() {
	let myTimer = document.querySelector('#my_timer');

	let myTime = myTimer.innerText;

	let parentTime = myTimer.parentNode;
	parentTime.innerHTML = '';

	let newP = document.createElement('p');
	newP.innerText = 'YOU FINISHED';
	let newTime = document.createElement('div');
	newTime.innerText = myTime;
	parentTime.append(newP, newTime);
	parentTime.style.backgroundColor = 'lightgreen';

	let userCodeField = document.querySelector('#user_code_field');
	userCodeField.style.backgroundColor = 'lightgreen';
	//! MAke a patch request to room to end session. change state to 4
}
