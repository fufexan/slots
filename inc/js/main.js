// firebase config
var firebaseConfig = {
    apiKey: "AIzaSyDTvNXN6mfr3dvHOYlyUgUAI3Tcou0N1Vw",
    authDomain: "gloslots.firebaseapp.com",
    databaseURL: "https://gloslots.firebaseio.com",
    projectId: "gloslots",
    storageBucket: "gloslots.appspot.com",
    messagingSenderId: "362358748175",
    appId: "1:362358748175:web:6e534a75080839c0a11f7a",
    measurementId: "G-B66LH8Q9HX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var lb = firebase.firestore().collection('leaderboard');

var vm = new Vue({
  el: '#vm',
  data: {
    money: 100,
    username: null,
    prevUsername: null,
    bet: null,
    currentEntry: {
      user: null,
      date: null,
      highscore: null,
      moves: null
    },
    slot: ['?', '?', '?'],

    arr_numbers: [1, 2, 3],
    arr_images: null,
    arr_emoji: ['😍', '🤣', '💩'],

    messages_fail: ['Oof', 'Too bad', 'Try again', 'Next time', 'Bad luck'],
    messages_semi: ['Nice!', 'Good!', 'Well done!', 'Keep going!'],
    messages_jackpot: ['Astonishing!', 'Amazing!', 'Unbelievable!', 'Miraculous!', 'Incredible!'],

    playType: null,
    message: null,
    brokenrule: null,
    LBEmpty: true,
    fullBet: false,

    sortAsc: '&#x25b2;',
    sortDesc: '&#x25bc;',
    sorter: '&#x25b2;',
    prev: 'user',
    order: 'asc',
  },
  methods: {
    reverseOrder: function () {
      if (this.order == 'asc') {
        this.order = 'desc';
        this.sorter = this.sortDesc;
      } else {
        this.order = 'asc';
        this.sorter = this.sortAsc;
      }
    },

    // creates a new entry in the HTML leaderboard with the given content
    addToLB: function (content, fromFirebase = false) {
      let d = '<td>';
      let e = '</td>';
      let date;
      if (fromFirebase) {
        date = content.date.toDate();
      } else {
        date = content.date;
      }
      let fcontent = '<tr>' + d + e + d + content.user + e + d +
        this.getDate(date) + e + d + content.highscore + e + d + content.moves + e + '</tr>';
      tbody.innerHTML += fcontent;
      this.isLBEmpty();
    },

    // slots get reset to '?' and all messages disappear
    resetElements: function () {
      this.slot = this.slot.map( e => e = '?' );
      this.message = '';
      this.brokenrule = '';
    },

    // resets elements and currentEntry after adding to LB
    // resets money and sets corresponding bet
    resetGame: function (event) {
      if (!!this.currentEntry.user && !!this.currentEntry.moves) {
        this.updateFirebaseLB(this.currentEntry);
      }
      this.getFirebaseLB(this.prev, this.order);
      this.isLBEmpty();
      this.newLBEntry();
      this.resetElements();
      this.money = 100;
      this.setBet(this.fullBet);
    },

    // numbers, images, emoji
    getPlayType: function (event) {
      this.playType = vm['arr_' + event.target.id];
      this.resetElements();
    },

    // main logic
    playGame: function () {
      // check if username is set
      if (this.username != ('' || null)) {
        // rules not broken anymore (at least momentarily)
        this.brokenrule = null;

        let result;
        // get bet
        if (this.money == 0) {
          result = 1;
          // 1 = no money
        } else if (this.bet > this.money) {
          result = 2;
          // 2 = bet too much
        } else if (this.bet < this.money / 2) {
          result = 3;
          // 3 = not enough bet
        } else {
          result = 0;
          // 0 = can play
          this.money -= this.bet;
        }
        
        if (!result) {
          // shuffle slots
          for (let i = 0; i < this.slot.length; i++ ) {
            let temp = this.shuffle(this.playType);
            // save time by not changing same elements
            if (this.slot[i] != temp) {
              this.slot[i] = temp;
            }
          }

          // check how many elements are the same
          if (this.slot[0] == this.slot[1] && this.slot[0] == this.slot[2]) {
            this.setMessage(this.messages_jackpot); // jackpot
            this.money += this.bet * 2;
          } else if (this.slot[0] == this.slot[1] || this.slot[0] == this.slot[2] || this.slot[1] == this.slot[2]) {
            this.setMessage(this.messages_semi); // semi win
            this.money += this.bet * 1.5;
          } else {
            this.setMessage(this.messages_fail); // loss
          }

          // set highscore
          let what = null;
          if (this.money > this.currentEntry.highscore) {
            what = 'both';
          }
          // auto increments moves no matter what (get it?)
          this.updateLBEntry(what);
        } else if (result == 1) {
          this.brokenrule = 'No more money!';
          this.resetGame();
        } else if (result == 2) {
          this.brokenrule = 'You bet too much!';
        } else {
          this.brokenrule = 'Bet more!';
        }
        // set new bet to half the money
        this.setBet(this.fullBet);
      } else {
        this.brokenrule = 'Choose a username!';
      }
    },

    // shuffle any array
    shuffle: function (arr) {
      let result = Math.floor(Math.random() * arr.length);
      return arr[result];
    },

    // resets currentEntry
    newLBEntry: function () {
      this.currentEntry.user = this.username;
      this.currentEntry.date = new Date();
      this.currentEntry.highscore = 0;
      this.currentEntry.moves = 0;
    },

    // updates moves [and highscore]
    updateLBEntry: function (what = null) {
      this.currentEntry.moves++;
      if (what == 'both') {
        this.currentEntry.highscore = this.money;
      }
    },

    // format date as DD.MM.YYYY HH:MM
    getDate: function (time) {
      let d = new Date(time);
      // what ('0' + etc).slice(-2) does: if etc is a digit, it adds 0 before it
      // if etc is 2 digits, that 0 gets cut at the end
      let date = ('0' + d.getDate()).slice(-2) + '.' + ('0' + d.getMonth()).slice(-2) + '.' + d.getFullYear();
      date += ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
      return date;
    },

    // get a random message from arr
    setMessage: function (arr) {
      this.message = this.shuffle(arr);
    },

    // set bet as [(a bit more than) half] the money
    setBet: function (full = false) {
      if (full) {
        this.bet = this.money;
      } else if (this.money > 1) {
        this.bet = Math.ceil(this.money / 2);
      } else {
        this.bet = this.money / 2;
      }
    },

    // leaderboard functions
    isLBEmpty: function () {
      if (tbody.innerHTML == '') {
        this.LBEmpty = true;
        return true;
      }
      else {
        this.LBEmpty = false;
        return false;
      }
    },

    resetLB: function () {
      tbody.innerHTML = '';
      this.isLBEmpty();
    },

    updateFirebaseLB: async function (content) {
      lb.add({
        user: content.user,
        date: firebase.firestore.Timestamp.fromDate(content.date),
        highscore: content.highscore,
        moves: content.moves
      })
    },

    getFirebaseLB: async function (orderBy = 'user', order = 'asc') {
    // orderBy: [highscore, moves, user, date]
    // order: [asc, desc]
    this.resetLB();
    lb.orderBy(orderBy, order).get().then(function (docs) {
      docs.forEach(function (doc) {
          vm.addToLB(doc.data(), true);
        });
      });
    },

    setImages: function () {
      let r = false;
      if (this.username) {
        this.username.toLowerCase().includes('ricardo') ? r = true : '';
      }
      this.arr_images = this.arr_numbers.map( e => '<img src="inc/img/' +
        (r ? 'ricardo' : '') + e + '.jpg" class="slot-img">' );
      if (r) {
        this.playType = this.arr_images;
      }
    },

  },
  computed: {
    brokenruleClass: function () {
      return {
        inactive: !this.brokenrule,
        bad: !!this.brokenrule,
      }
    },
    messageClass: function () {
      return {
        inactive: !this.message,
        bad: this.messages_fail.includes(this.message),
        green: this.messages_semi.includes(this.message),
        gold: this.messages_jackpot.includes(this.message),
      }
    },
  },
  watch: {
    username: function () {
      this.setImages();
    },
  },
  beforeMount: function () {
    this.setImages();
    this.playType = this.arr_numbers;
    this.resetGame();
    tbody.innerHTML = null;
    this.isLBEmpty();
  }
})

