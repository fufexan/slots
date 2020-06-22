var vm = new Vue({
  el: '#vm',
  data: {
    money: 100,
    username: null,
    bet: null,
    currentEntry: {
      user: null,
      date: null,
      hs: null,
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
  },
  methods: {
    // creates a new entry in the HTML leaderboard with the given content
    addToLB: function (content) {
      let d = '<td>';
      let e = '</td>'
      let fcontent = '<tr>' + d + e + d + content.user + e + d +
        content.date + e + d + content.hs + e + d + content.moves + e + '</tr>';
      tbody.innerHTML += fcontent;
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
      console.log(event);
      if (this.currentEntry.user != (null || '') && this.currentEntry.moves) {
        this.addToLB(this.currentEntry);
      }
      this.isLBEmpty();
      this.newLBEntry();
      this.resetElements();
      this.money = 100;
      this.setBet();
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
          if (this.money > this.currentEntry.hs) {
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
        this.setBet();
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
      this.currentEntry.date = this.getDate();
      this.currentEntry.hs = 0;
      this.currentEntry.moves = 0;
    },

    // updates moves [and highscore]
    updateLBEntry: function (what = null) {
      this.currentEntry.moves++;
      if (what == 'both') {
        this.currentEntry.hs = this.money;
      }
    },

    // format date as DD.MM.YYYY HH:MM
    getDate: function () {
      let d = new Date();
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

    // set bet as (a bit more than) half the money
    setBet: function () {
      this.bet = Math.ceil(this.money / 2);
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

    updateFirebaseLB: function () {

    },

    getFirebaseLB: function () {

    },

    setImages: function (ricardo = false) {
      this.arr_images = this.arr_numbers.map( e => '<img src="inc/img/' + (ricardo ? 'ricardo' : '') + e + '.jpg" class="slot-img">' );
      this.playType = this.arr_images;
    },

    resetHold: function (event) {
      console.log(event);
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
    }
  },
})

vm.setImages();
vm.playType = vm.arr_numbers;
vm.resetGame();
tbody.innerHTML = null;
vm.isLBEmpty();