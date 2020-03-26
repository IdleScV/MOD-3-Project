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

//* runs room number
function submitRoomNumber(event) {
	event.preventDefault();
	let roomNumber = event.currentTarget.roomNumber.value;

	fetch(URL + 'rooms/' + roomNumber)
		.then((response) => response.json())
		.then((roomData) => checkRoomNumber(roomData, roomNumber));
}

//* checks if room number exist
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

//* if room number exist, updates room state to 2
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

//* waits for host to choose a question difficulty
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
		}, 100);
	} else {
		console.log('Question Picked');
		fetchBattleContent();
	}
}

//* once host has picked a question, we fetch the question
function fetchBattleContent() {
	let roomId = localStorage.getItem('roomId');
	fetch(URL + 'battles/' + roomId).then((response) => response.json()).then((json) => setUserScreen(json));
}
// BattleData here refers to the the battle model
function setUserScreen(battleData) {
	fetchQuestionForOpponent(battleData.question_id);
	fetchCurrentBattleId(battleData.id);
}
//* fetches question is used to fill user editor. enable submit button function
function fetchQuestionForOpponent(questionId) {
	localStorage.setItem('Host', 'false');
	fetch(URL + 'questions/' + questionId)
		.then((response) => response.json())
		.then((question) => fillGameField(question.data));
	submitBtnSetup();
}
//* Sets battle id in localStorage
function fetchCurrentBattleId(battle_id) {
	fetch(URL + 'battle_data/' + battle_id)
		.then((response) => response.json())
		.then((battle_data) => setCurrentBattleId(battle_data));
}

function setCurrentBattleId(battleData) {
	localStorage.setItem('currentBattleId', battleData.data.id);
	// fauxLiveShare();
}
