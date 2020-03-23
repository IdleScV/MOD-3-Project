HOW TO USE IN BROWSER CODER
$('#editor').text(`function echo(m) {\n\treturn m;\n}\nconsole.log(echo("Hello World"));`);

\n = new line
\t = tab


Order of execution
1. User opens webpage
javascript_ide.js => Runs to setup blank canvases
page_setup.js
= runs overrideDefault() (in javascript_ide.js) to allow  termianl functions

<!--! Add a step here for user log in -->
2. User logs in with username

<!--! Add a step here for finding room -->
3. Once logged in, allows user to create or find a room


4. once inside of a room
- runs keySetup() to allow button functions 
  - sends codeContent()
  - retrives code through showOpponentCode()
<!-- ? (Optional) Add step here for user to pick question -->
- runs gameSetup (in battle.js) & displays 'ready' 

5. Once both players click ready . . .
  - removes ready button
  - runs fillGameField for BOTH canvases
    - fill up questionfield with question
    - fill up canvases with preexisting code
  - runs timeStart for timer to start 
  - runs submitBtnSetup to allow player to submit their code
    - runs checkAnswer when submitBtn is clicked
  
6. Once player submits correct answer
- runs playerWin()





SCHEMA 
Question
-question prompt (prompt)
-editorText (maybe combine these?) -test (testCase)
-finalTest (answer)

battleData
- winnerSolution
- loserSolution
- battle_id

battles
- user id
- opponent id
- win (boolean)
- question id

user
- username
- mmr

