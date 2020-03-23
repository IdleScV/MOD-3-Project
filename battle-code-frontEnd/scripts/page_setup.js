document.addEventListener('DOMContentLoaded', pageSetup);
function pageSetup() {
	overrideDefault();
	// keySetup();
	// gameSetup();
	userLogin();
}

function userLogin() {
	let startBtnArea = document.querySelector('#prompt_field');
	let usernameInput = `<form id='username_form'>
	<label for="fname">Your Name:</label><br>
	<input type="text" id="username" name="username"><br>
	<input type="submit" value="Submit">
  </form> <form>`;

	startBtnArea.innerHTML = usernameInput;
	let userInput = document.querySelector('#username_form');
	userInput.addEventListener('submit', submitUsername);
}

function submitUsername(event) {
	event.preventDefault();
	let currentUser = event.currentTarget.username.value;
	'<%Session["CurrentUser"] = "' + currentUser + '"; %>';
	keySetup();
	gameSetup();
}

// * every character input on browser sends code to database
function keySetup() {
	let runBtn = document.querySelector('.execute');
	runBtn.addEventListener('click', () => {
		eval(editor.getValue());
	});

	document.querySelector('.clear').onclick = console.clear;
	document.addEventListener('keyup', sendCodeContent);
}

// * Sends current code to databse
function sendCodeContent(event) {
	//! This should be a post requst to send our current code to the database.
	//! then, trigger a get request for the opponent's code
	// let payload = editor.getValue();

	// fetch(URL, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(payload)
	// })
	// 	.then((response) => response.json())
	// 	.then((opponentCode) => showOpponentCode(opponentCode));

	//? Currently only showing user's current code
	showOpponentCode(editor.getValue());
}

// * shows the fetched code from opponent
function showOpponentCode(data) {
	opponent_editor.session.setValue(data);
}
