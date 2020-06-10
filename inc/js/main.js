// define needed elements
// play button
const play = document.getElementById('play');
// slots div
const slots = document.getElementById('slots');
// message p
const message = [];
message.push( document.getElementById('message-win') );
message.push( document.getElementById('message-loss') );
// slot elements as array from HtmlCollection
const elem = [...document.getElementsByClassName('elem')];
// images
let img = ["1", "2", "3"];

elem.map( element => element.innerHTML = '?' );
img = img.map( (element) => "inc/img/" + element + ".jpg" );

let playtype = ['0', '1', '2'];

// click play => shuffle
play.addEventListener( 'click', () => {
	for (let i = 0; i < elem.length; i++ ) {
    let temp = shuffle(playtype);
    if (elem[i].innerHTML != temp) {
      elem[i].innerHTML = temp;
    }
  }

  // check if all elements are the same
  if ( elem.every(e => e.innerHTML === elem[0].innerHTML) ) {
    result = 0;
  } else {
    result = 1;
  }

  // set classes accordingly
  message.map( e => e.classList.add('inactive') );
  message[result].classList.remove('inactive');
} );

function shuffle(arr) {
	result = Math.floor(Math.random() * 3);
  return arr[result];
}
