document.addEventListener('DOMContentLoaded', pageSetup);
function pageSetup() {
	overrideDefault();
	keySetup();
	gameSetup();
}

//!
//!
//! TRIGGERED BY GAMESETUP()
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
