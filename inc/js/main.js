/*
 * define needed elements
 */

// play button
const play = document.getElementById('play');
// play type
const slotType = [...document.getElementsByName('playtype')];
// slots div
const slots = document.getElementById('slots');
// message p
const message = document.getElementById('message');
// slot elements as array from HtmlCollection
const elem = [...document.getElementsByClassName('elem')];
// images
let images = ["0", "1", "2"];
images = images.map( element => '<img src="inc/img/' + element + '.jpg" class="slot-img">' );
// emoji
const emoji = ['😍', '🤣', '💩'];
// numbers
const numbers = ['1', '2', '3']

/*
 * game start
 */

getPlayType();

// set elements to ? before game
function resetElements() {
	elem.map( element => element.innerHTML = '?' );
	message.innerHTML = '';
}

function getPlayType() {
	let changed = false;
	for (let i = 0; i < slotType.length && !changed; i++) {
		if (slotType[i].checked) {
			changed = i;
		}
	}

	console.log('element changed!', changed);

	playtype = slotType[changed].id;
	switch (playtype) {
	case 'numbers':
		playtype = numbers;
		break;
	case 'images':
		playtype = images;
		break;
	case 'emoji':
		playtype = emoji;
		break;
	}

	resetElements();
}

function playGame() {
	for (let i = 0; i < elem.length; i++ ) {
		let temp = shuffle(playtype);
		if (elem[i].innerHTML != temp) {
			elem[i].innerHTML = temp;
		}
	}

	// check if all elements are the same
	if ( elem.every(e => e.innerHTML === elem[0].innerHTML) ) {
		result = 'Winner! 🥳';
	} else {
		result = 'Oof, loser 😢';
	}

	message.classList.remove('inactive');
	message.innerHTML = result;
}

// get play type
slotType.map( e => e.addEventListener( 'click', getPlayType ) );

// click play => shuffle
play.addEventListener( 'click',  playGame);

function shuffle(arr) {
	result = Math.floor(Math.random() * arr.length);
	return arr[result];
}
