//! FIND ROOM
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
	localStorage.setItem('roomId', roomId);
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
		}, 500);
	} else {
		console.log('Question Picked');
		fetchBattleContent();
	}
}
function fetchBattleContent() {
	let roomId = localStorage.getItem('roomId');
	fetch(URL + 'battles/' + roomId).then((response) => response.json()).then((json) => setUserScreen(json));
}

function setUserScreen(battleData) {
	localStorage.setItem('currentBattleId', battleData.id);
	// console.log(battleData);
	fetchQuestionForOpponent(battleData.question_id);
}

function fetchQuestionForOpponent(questionId) {
	// console.log(questionId);
	localStorage.setItem('Host', 'false');
	fetch(URL + 'questions/' + questionId)
		.then((response) => response.json())
		.then((question) => fillGameField(question.data));
}
