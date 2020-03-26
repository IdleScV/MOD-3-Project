const URL = `http://127.0.0.1:3000/`;
localStorage.clear();
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
	<label for="fname">Your username:</label><br>
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
	// currentUser = 'Wesley
	fetch(URL + 'users/')
		.then((response) => response.json())
		.then((userList) => findOrCreateUser(userList, currentUser));
}

function findOrCreateUser(usersData, username) {
	let usersArray = usersData.data;
	let userExist = false;
	let payload = { username: username };
	usersArray.forEach((user) => {
		if (user.attributes.username === username) {
			userExist = true;
		}
	});
	if (userExist) {
		fetch(URL + `login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((response) => response.json())
			.then((userId) => saveId(userId));
		keySetup();
		gameSetup();
	} else {
		createNewUser(username);
	}
}

function createNewUser(username) {
	let payload = { username: username };
	fetch(URL + `login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((userId) => saveId(userId));
	keySetup();
	newUserSetup(username);
}

function saveId(currentUserId) {
	localStorage.setItem('currentUserId', currentUserId);
}

function newUserSetup(username) {
	let startBtnArea = document.querySelector('#prompt_field');
	startBtnArea.innerHTML = '';
	newUserBtn = document.createElement('button');
	newUserBtn.innerText = `Welcome ${username}, Click to Begin`;
	newUserBtn.addEventListener('click', gameSetup);
	startBtnArea.append(newUserBtn);
}

//* Sets up run and clear buttons
function keySetup() {
	let runBtn = document.querySelector('.execute');
	runBtn.addEventListener('click', () => {
		eval(editor.getValue());
	});

	document.querySelector('.clear').onclick = console.clear;
}
