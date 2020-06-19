/*
 * needed elements
 */
let money;
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
const messages_won2 = ['Nice!', 'Good!', 'Well done!', 'Keep going!'];
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
// TBI

/*
 * game start
 */
getPlayType();
resetGame();

// functions

function doNothing() {}

function resetGame() {
  resetElements();
  money = 100;
  wallet.innerHTML = 'Wallet: ' + money;
}

function resetElements() {
  slot.map( element => element.innerHTML = '?' );
  message.innerHTML = '';
  brokenrule.classList.add('inactive');
  brokenrule.classList.remove('bad');
  message.classList.add('inactive');
  message.classList.remove('bad', 'green', 'gold')
}

function getPlayType() {
  let changed = false;
  for (let i = 0; i < slotType.length && !changed; i++) {
    if (slotType[i].checked) {
      changed = i;
    }
  }

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
  brokenrule.classList.add('inactive');
  brokenrule.classList.remove('bad');
  let result;
  // get bet
  // 0 = too much
  // 1 = not enough
  // 2 = can play
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
      if (slot[i].innerHTML != temp) {
        slot[i].innerHTML = temp;
      }
    }
    let same;
    // check how many elements are the same
    if (slot[0].innerHTML == slot[1].innerHTML && slot[0].innerHTML == slot[2].innerHTML) {
      same = 'jackpot';
      money += bet.value * 2;
    } else if (slot[0].innerHTML == slot[1].innerHTML || slot[0].innerHTML == slot[2].innerHTML || slot[1].innerHTML == slot[2].innerHTML) {
      same = 2;
      money += bet.value * 1.5;
    } else {
      same = 'none';
    }
    // set corresponding money and message
    wallet.innerHTML = 'Wallet: ' + money;
    switch (same) {
    case 'none':
      result = shuffle(messages_fail);
      message.classList.add('bad')
      message.classList.remove('green', 'gold');
      break;
    case 2:
      result = shuffle(messages_won2);
      message.classList.add('green')
      message.classList.remove('bad', 'gold');
      break;
    case 'jackpot':
      result = shuffle(messages_jackpot)
      message.classList.add('gold')
      message.classList.remove('bad', 'green');
    }

    message.classList.remove('inactive');
    message.innerHTML = result;
  } else if (result == 1) {
    brokenrule.innerHTML = 'No more money!';
    brokenrule.classList.remove('inactive');
    brokenrule.classList.add('bad');
    resetGame();
  } else if (result == 2) {
    brokenrule.innerHTML = 'You bet too much!';
    brokenrule.classList.remove('inactive');
    brokenrule.classList.add('bad');
  } else {
    brokenrule.innerHTML = 'Bet more!';
    brokenrule.classList.remove('inactive');
    brokenrule.classList.add('bad');
  }
}

function shuffle(arr) {
	let result = Math.floor(Math.random() * arr.length);
	return arr[result];
}

// user functions
function getUsername() {
  return username.value;
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