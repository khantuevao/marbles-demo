const Player = (name) => {
  let score = 10;
  let bet;
  let role;
  let ready = false;
  let choice;

  return { name, score, bet, role, ready, choice };
};

let gameStarted = false;

let playerOne;
let playerTwo;

let roundCount = 0;

const betForm = document.getElementById('betForm');

const rules = document.getElementById('rules');

const roleOne = document.getElementById('roleOne');
const roleTwo = document.getElementById('roleTwo');

const announcements = document.getElementById("announcements");
const logs = document.querySelector('.logs');

const nameInfoSubmit = document.getElementById('nameInfoSubmit');
nameInfoSubmit.addEventListener('click', () => {
  const nameInfoInput = document.getElementById('nameInfoInput');
  if (nameInfoInput.value === "") {
    playerOne = Player("Player One");
  } else {
    playerOne = Player(`${nameInfoInput.value}`);
  }
  playerOne.ready = true;

  playerTwo = Player('A.I.')
  playerTwo.ready = true;

  const getInfo = document.querySelector('.getInfo');
  getInfo.classList.add('none')
  getInfo.innerHTML = '';

  const playerTwoDiv = document.getElementById('playerTwo');
  playerTwoDiv.classList.remove('hidden');
  
  const scoreOne = document.getElementById('scoreOne');
  scoreOne.classList.remove('hidden')

  const nameOne = document.getElementById('nameOne');
  nameOne.innerHTML = `${playerOne.name}`;
  const nameTwo = document.getElementById('nameTwo');
  nameTwo.innerHTML = `${playerTwo.name}`;

  if (bothReady()) playRound();
})

function bothReady() {
  if (playerOne.ready && playerTwo.ready) playRound();
}

function playRound() {
  gameStarted = true;
  updateLanguage();
  const gameboard = document.getElementById('gameboard');
  gameboard.classList.add('withBorders')
  logs.classList.remove('none')
  resolveTurn();
  roundCount++;

  playerOne.ready = false;
  playerTwo.ready = false;

  betForm.classList.remove("hidden");

  renderScore();
  renderMarbles();

  if (roundCount === 1) {
    //first round
    decideRoles();
    renderRoles();

    const message = document.createElement('p');
    message.innerHTML = `<div>Players have been assigned roles randomly</div>
    <p><div>Round ${roundCount}</div>
    <div>Make your moves</div></p>`;
    logs.appendChild(message)
    logs.scrollTop = logs.scrollHeight;

    //changeAnnouncement();
    placeBets();
  } else if (playerOne.score === 0 || playerTwo.score === 0) {
    //game ends
    betForm.classList.add("hidden");
    roleOne.classList.add("none");
    roleTwo.classList.add("none");

    const message = document.createElement('p');
    message.innerHTML = `<div>${roundWinner} ${outcome} and won ${wonAmount} marbles.</div>
    <div>${playerOne.name} bet ${playerOne.bet} as ${playerOne.role} vs ${playerTwo.name}'s ${playerTwo.bet} as ${playerTwo.role}</div>
    <div>Game over</div>
                              <div>${roundWinner} is the winner</div>`
    logs.appendChild(message)
    logs.scrollTop = logs.scrollHeight;

    //announcements.innerHTML = `<p><strong>${roundWinner}</strong> ${outcome} and won <strong>${wonAmount} marbles.</strong></p>
    //                             <h3>Game over</h3>
    //                             <p>${roundWinner} is the winner</p>`;
    const popupResult = document.getElementById('popupResult');
    if (roundWinner === playerOne.name && language === 'EN') {
      popupResult.innerHTML = 'You won!🥳';
    } else if (roundWinner === playerOne.name && language === 'RU') {
      popupResult.innerHTML = 'Вы победили!🥳';
    } else if (roundWinner === playerTwo.name && language === 'EN') {
      popupResult.innerHTML = 'You lost🙁';
    } else if (roundWinner === playerTwo.name && language === 'RU') {
      popupResult.innerHTML = 'Вы проиграли🙁';
    }
    const popupBtn = document.querySelector('.button');
    popupBtn.click();

    const tryAgain = document.createElement('button');
    tryAgain.setAttribute('id', 'tryAgain');
    if (language === 'EN') {
      tryAgain.innerHTML = 'Try Again';
    } else {
      tryAgain.innerHTML = 'Еще раз'
    }
    tryAgain.classList.add('visible')
    betForm.appendChild(tryAgain);
    tryAgain.addEventListener('click', () => {
      window.location.reload();
    })
  } else {
    //default

    const message = document.createElement('p');
    message.innerHTML = `<div>${roundWinner} ${outcome} and won ${wonAmount} marbles.</div>
    <div>${playerOne.name} bet ${playerOne.bet} as ${playerOne.role} vs ${playerTwo.name}'s ${playerTwo.bet} as ${playerTwo.role}</div>
    <p><div>Round ${roundCount}</div>
    <div>Make your moves</div></p>`
    logs.appendChild(message)
    logs.scrollTop = logs.scrollHeight;

    //changeAnnouncement();
    changeRoles();
    renderRoles();
    placeBets();
  }
}

function renderRoles() {
  if (language === 'EN' && playerOne.role === 'guesser') {
    roleOne.innerHTML = 'guesser';
    roleTwo.innerHTML = 'hider';
  } else if (language === 'EN' && playerOne.role === 'hider') {
    roleOne.innerHTML = 'hider';
    roleTwo.innerHTML = 'guesser';
  } else if (language === 'RU' && playerOne.role === 'guesser') {
    roleOne.innerHTML = 'Угадывающий'
    roleTwo.innerHTML = 'Загадывающий'
  } else if (language === 'RU' && playerOne.role === 'hider') {
    roleOne.innerHTML = 'Загадывающий'
    roleTwo.innerHTML = 'Угадывающий'
  }
}

function decideRoles() {
  const result = Math.floor(Math.random() * 2);
  if (result === 0) {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  } else {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  }
}

function changeRoles() {
  if (playerOne.score === 1) {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  } else if (playerTwo.score === 1) {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  } else if (playerOne.role === "hider") {
    playerOne.role = "guesser";
    playerTwo.role = "hider";
  } else if (playerOne.role === "guesser") {
    playerOne.role = "hider";
    playerTwo.role = "guesser";
  }
}

function renderScore() {
  const scoreNumberOne = document.getElementById('scoreNumberOne');
  scoreNumberOne.innerHTML = `${playerOne.score}`;

  const scoreNumberTwo = document.getElementById('scoreNumberTwo');
  scoreNumberTwo.innerHTML = `${playerTwo.score}`;
}

/*
function changeAnnouncement() {
  switch (roundCount) {
    case 1:
      announcements.innerHTML = `<p>Привет have been assigned roles randomly</p>
                                 <h3>Round ${roundCount}</h3>
                                 <p>Make your moves</p>`;
      break;
    default:
      announcements.innerHTML = `<p><strong>${roundWinner}</strong> ${outcome} and won <strong>${wonAmount} marbles.</strong></p>
                                 <h3>Round ${roundCount}</h3>
                                 <p>Make your moves</p>`;
  }
}
*/

function placeBets() {
  const submitBetOne = document.getElementById("submitBetOne");
  submitBetOne.addEventListener("click", () => {
    const betFieldOne = document.getElementById("betFieldOne");

    if (
      betFieldOne.value > playerOne.score ||
      betFieldOne.value > playerTwo.score ||
      betFieldOne.value < 1 ||
      isNaN(betFieldOne.value)
    ) {
      return;
    } else {
      playerOne.bet = betFieldOne.value;
    }

    const evenOne = document.getElementById("evenOne");
    const oddOne = document.getElementById("oddOne");

    if (evenOne.checked === true) {
      playerOne.choice = "even";
    } else if (oddOne.checked === true) {
      playerOne.choice = "odd";
    } else {
      return;
    }

    betFieldOne.value = "";

    betForm.classList.add("hidden");

    playerOne.ready = true;


    function aiBet(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (playerTwo.score > playerOne.score) {
      playerTwo.bet = aiBet(1, playerOne.score);
    } else {
      playerTwo.bet = aiBet(1, playerTwo.score)
    }

    function aiChoice() {
      let result;
      let randomNum = aiBet(1, 2);
      if (randomNum === 1) {
        result = 'odd';
      } else {
        result = 'even';
      }
      return result;
    }
    playerTwo.choice = aiChoice();

    playerTwo.ready = true;

    if (bothReady()) playRound();
  });
}

function resolveTurn() {
  if (playerOne.role === "guesser") {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score += Number(playerOne.bet);
      playerTwo.score -= Number(playerOne.bet);
      roundWinner = playerOne.name;
      wonAmount = playerOne.bet;
      outcome = "guessed correctly";
    } else {
      playerOne.score -= Number(playerOne.bet);
      playerTwo.score += Number(playerOne.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerOne.bet;
      outcome = "has not been figured out";
    }
  } else if (playerOne.role === "hider") {
    if (playerOne.choice === playerTwo.choice) {
      playerOne.score -= Number(playerTwo.bet);
      playerTwo.score += Number(playerTwo.bet);
      roundWinner = playerTwo.name;
      wonAmount = playerTwo.bet;
      outcome = "guessed correctly";
    } else {
      playerOne.score += Number(playerTwo.bet);
      playerTwo.score -= Number(playerTwo.bet);
      roundWinner = playerOne.name;
      wonAmount = playerTwo.bet;
      outcome = "has not been figured out";
    }
  }
}

/*
function renderMarbles() {
  const marblesOne = document.getElementById('marblesOne');

  const marblePieces = document.querySelectorAll('marble')
  for (let i = 0; i < marblePieces.length; i++) {
    marblePieces[i].classList.remove('big');
    marblePieces[i].classList.add('small');
  }

  setTimeout(clear(), 1000)

  function clear() {
    marblesOne.innerHTML = '';
  }

  for (let i = 0; i < playerOne.score; i++) {
    const marbleDiv = document.createElement('div');
    marbleDiv.innerHTML = `<img src="../src/images/marble.png">`;
    marbleDiv.classList.add('marble');
    marblesOne.appendChild(marbleDiv);
  }

  const marblesTwo = document.getElementById('marblesTwo');

  marblesTwo.innerHTML = '';

  for (let i = 0; i < playerTwo.score; i++) {
    const marbleDiv = document.createElement('div');
    marbleDiv.innerHTML = `<img src="../src/images/marble.png">`;
    marbleDiv.classList.add('marble');
    marblesTwo.appendChild(marbleDiv);
  }

  for (let i = 0; i < marblePieces.length; i++) {
    marblePieces[i].classList.remove('small');
    marblePieces[i].classList.add('big');
  }

}
*/

const marblePiecesOne = document.querySelectorAll('.marble.one');
const marblePiecesTwo = document.querySelectorAll('.marble.two');
/**
function renderMarbles() {
  for (let i = 0; i < playerOne.score; i++) {
    marblePiecesOne[i].classList.remove('small')
    marblePiecesOne[i].classList.add('big')
  }

  for (let i = 0; i < playerTwo.score; i++) {
    marblePiecesTwo[i].classList.remove('small')
    marblePiecesTwo[i].classList.add('big')
  }
}
**/
/**function reRenderMarbles() {
  const marblePiecesOneBig = document.querySelectorAll('.marble.one.big');

  if (playerOne.score > marblePiecesOneBig.length) {
    let diff = playerOne.score - marblePiecesOneBig.length;
    for (let i = 0; i < diff; i++) {
      marblePiecesOne[i + marblePiecesOneBig.length].classList.remove('small')
      marblePiecesOne[i + marblePiecesOneBig.length].classList.add('big')
    }
  } else if (playerOne.score < marblePiecesOneBig.length) {
    let diff = marblePiecesOneBig.length - playerOne.score;
    for (let i = 0; i < diff; i++) {
      marblePiecesOne[i + playerOne.score].classList.remove('big')
      marblePiecesOne[i + playerOne.score].classList.add('small')
    }
  }

  const marblePiecesTwoBig = document.querySelectorAll('.marble.two.big');

  if (playerTwo.score > marblePiecesTwoBig.length) {
    let diff = playerTwo.score - marblePiecesTwoBig.length;
    for (let i = 0; i < diff; i++) {
      marblePiecesTwo[i + marblePiecesTwoBig.length].classList.remove('small')
      marblePiecesTwo[i + marblePiecesTwoBig.length].classList.add('big')
    }
  } else if (playerTwo.score < marblePiecesTwoBig.length) {
    let diff = marblePiecesTwoBig.length - playerTwo.score;
    for (let i = 0; i < diff; i++) {
      marblePiecesTwo[i + playerTwo.score].classList.remove('big')
      marblePiecesTwo[i + playerTwo.score].classList.add('small')
    }
  }
}
**/

const marblesOne = document.getElementById('marblesOne');
const marblesTwo = document.getElementById('marblesTwo')

function renderMarbles() {
  marblesOne.innerHTML = '';
  for (let i = 0; i < playerOne.score; i++) {
    const pieceOne = document.createElement('div');
    pieceOne.classList.add('marble','one','big');
    pieceOne.innerHTML = '<img src="./marble.png">';
    marblesOne.appendChild(pieceOne);
  }
  marblesTwo.innerHTML = '';
  for (let i = 0; i < playerTwo.score; i++) {
    const pieceTwo = document.createElement('div');
    pieceTwo.classList.add('marble','one','big');
    pieceTwo.innerHTML = '<img src="./marble.png">';
    marblesTwo.appendChild(pieceTwo);
  }
}

let language = 'EN';

function changeLanguage() {
  if (language === 'EN') {
    language = 'RU'
  } else {
    language = 'EN'
  }
}

function updateLanguage() {
  const tryAgain = document.getElementById('tryAgain')

  renderRoles();
  const evenLabel = document.getElementById('evenLabel');
  const oddLabel = document.getElementById('oddLabel')
  const betLabel = document.getElementById('betLabel')
  if (language === 'EN') {
    evenLabel.innerHTML = 'Even'
    oddLabel.innerHTML = 'Odd'
    betLabel.innerHTML = 'Place your bet:'
    submitBetOne.innerHTML = 'Submit'
    languageBtn.innerHTML = 'en'
    rules.innerHTML = 'rules'
    if (tryAgain) {
      tryAgain.innerHTML = 'Try again'
    }
  } else {
    evenLabel.innerHTML = 'Чет'
    oddLabel.innerHTML = 'Нечет'
    betLabel.innerHTML = 'Ваша ставка:'
    submitBetOne.innerHTML = 'Отправить'
    languageBtn.innerHTML = 'ru'
    rules.innerHTML = 'правила'
    if (tryAgain) {
      tryAgain.innerHTML = 'Еще раз'
    }
  }
 
}

function updateStarter() {
  const nameInfoLabel = document.getElementById('nameInfoLabel');
  if (language === 'EN') {
    nameInfoLabel.innerHTML = 'Enter name:'
    nameInfoSubmit.innerHTML = 'Play'
    languageBtn.innerHTML = 'en'
    rules.innerHTML = 'Rules'
  } else {
    nameInfoLabel.innerHTML = 'Введите имя:'
    nameInfoSubmit.innerHTML = 'Играть'
    languageBtn.innerHTML = 'ru'
    rules.innerHTML = 'Правила'
  }
}

window.addEventListener('load', (event) => {
  updateStarter()
  updateLink()
})

const languageBtn = document.getElementById('language');
languageBtn.addEventListener('click', () => {
  if (gameStarted) {
    changeLanguage()
    updateLanguage()
    updateLink()
  } else {
    changeLanguage()
    updateStarter()
    updateLink()
  }
  
})

function updateLink() {
  if (language === 'EN') {
    rules.setAttribute('href', '#rulesEN')
  } else {
    rules.setAttribute('href', '#rulesRU')
  }
}