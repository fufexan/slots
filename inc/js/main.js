/*
 * needed elements
 */
let money;
let LBlength;
let moves;
let highscore;

let currentEntry = {
  user: null,
  date: null,
  hs: null,
  moves: null
};

// play type
const slotType = [numbers, images, emoji];
// slot elements as array from HtmlCollection
let slot = [...document.getElementsByClassName('elem')];
// slot values
const arr_numbers = ['1', '2', '3'];
const arr_images = arr_numbers.map( element => '<img src="inc/img/' + element + '.jpg" class="slot-img">' );
const arr_emoji = ['😍', '🤣', '💩'];
let playtype;
// messages
const messages_fail = ['Oof', 'Too bad', 'Try again', 'Next time', 'Bad luck'];
const messages_semi = ['Nice!', 'Good!', 'Well done!', 'Keep going!'];
const messages_jackpot = ['Astonishing!', 'Amazing!', 'Unbelievable!', 'Miraculous!', 'Incredible!'];

/*
 * event listeners
 */

// get play type
slotType.map( e => e.addEventListener( 'click', getPlayType ) );
// click play => shuffle
play.addEventListener( 'click', playGame );
// reset game
reset.addEventListener( 'click', resetGame );
// check when wallet reaches 0
// TBI (if ever)

/*
 * game start
 */

//startGame();
getPlayType();
resetGame();

// functions
function doNothing() {}

function resetGame() {
  addToLB(currentEntry);
  checkLB();
  setBet();
  resetElements();
  money = 100;
  highscore = 0;
  moves = 0;
  wallet.innerHTML = 'Wallet: ' + money;
}

// change between numbers, emoji and images
function resetElements() {
  slot.map( element => element.innerHTML = '?' );
  message.innerHTML = '';
  brokenrule.classList.add('inactive');
  brokenrule.classList.remove('bad');
  message.classList.add('inactive');
  message.classList.remove('bad', 'green', 'gold')
}

function getPlayType() {
  let changed = 0;
  // seems like 0 would not trigger !changed at first glance, but it will be
  // the changed type if no other element is changed. kind of a neat hack
  for (let i = 0; i < slotType.length && !changed; i++) {
    if (slotType[i].checked) {
      changed = i;
    }
  }
  // because idk how to set arr_(slotType[changed].id)
  // and don't wanna use eval
  playtype = slotType[changed].id;
  switch (playtype) {
  case 'numbers':
    playtype = arr_numbers;
    break;
  case 'images':
    playtype = arr_images;
    break;
  case 'emoji':
    playtype = arr_emoji;
    break;
  }
  resetElements();
}

function playGame() {
  if (username.value != '') {
    brokenrule.classList.add('inactive');
    brokenrule.classList.remove('bad');

    let result;
    // get bet
    // 0 = can play
    // 1 = no money
    // 2 = bet too much
    // 3 = not enough bet
    if (money == 0) {
      result = 1;
    } else if (bet.value > money) {
      result = 2;
    } else if (bet.value < money / 2) {
      result = 3;
    } else {
      result = 0;
      money -= bet.value;
    }

    if (!result) {
      // shuffle slots
      for (let i = 0; i < slot.length; i++ ) {
        let temp = shuffle(playtype);
        // save time by not changing same elements
        if (slot[i].innerHTML != temp) {
          slot[i].innerHTML = temp;
        }
      }

      // check how many elements are the same
      // 0 - fail, 1 - semi, 2 - jackpot
      let same;
      if (slot[0].innerHTML == slot[1].innerHTML && slot[0].innerHTML == slot[2].innerHTML) {
        same = 2;
        money += bet.value * 2;
      } else if (slot[0].innerHTML == slot[1].innerHTML || slot[0].innerHTML == slot[2].innerHTML || slot[1].innerHTML == slot[2].innerHTML) {
        same = 1;
        money += bet.value * 1.5;
      } else {
        same = 0;
      }

      // set highscore
      if (money > highscore) highscore = money;
        updateLBEntry();
      // set corresponding money and message
      wallet.innerHTML = 'Wallet: ' + money;
      switch (same) {
      case 0:
        setMessage(messages_fail, 'bad');
        break;
      case 1:
        setMessage(messages_semi, 'green');
        break;
      case 2:
        setMessage(messages_jackpot, 'gold');
      }
    } else if (result == 1) {
      setBrokenRule('No more money!');
      resetGame();
    } else if (result == 2) {
      setBrokenRule('You bet too much!');
    } else {
      setBrokenRule('Bet more!');
    }

    setBet();
  } else {
    setBrokenRule('Choose a username!');
  }
}

function shuffle(arr) {
	let result = Math.floor(Math.random() * arr.length);
	return arr[result];
}

// user
function getUsername() {
  return username.value;
}

function newLBEntry() {
  currentEntry.user = username.value;
  currentEntry.date = Date().toUTCString();
  currentEntry.hs = 0;
  currentEntry.moves = 0;
}

function updateLBEntry() {
  currentEntry.moves++;
  currentEntry.hs = highscore;
}

// money and message
function setMessage(arr, color) {
  let colors = ['bad', 'green', 'gold'];
  colors.splice(colors.indexOf(color), 1);

  message.innerHTML = shuffle(arr);

  message.classList.add(color);
  message.classList.remove(colors[0], colors[1], 'inactive');
}

function setBrokenRule(msg) {
  brokenrule.innerHTML = msg;
  brokenrule.classList.add('bad');
  brokenrule.classList.remove('inactive');
}

function setBet() {
  bet.value = Math.ceil(money / 2);
}

// leaderboard functions
function checkLB() {
  if (tbody.innerHTML == '') {
    leaderboard.classList.add('inactive');
  }
}

function resetLB() {
  LBlength = 0;
  tbody.innerHTML = '';
}

function addToLB(content) {
  let d = '<td>';
  let e = '</td>'
  let fcontent = '<tr>' + d + ++LBlength + e + d + content.user + e + d +
    content.timestamp + e + d + content.score + e + d + content.moves + e + '</tr>';
  tbody.innerHTML += fcontent;
}

function updateFirebaseLB() {

}

function GetFirebaseLB() {

}