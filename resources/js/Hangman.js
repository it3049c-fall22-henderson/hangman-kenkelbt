class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.word = "";
    this.isOver = false;
    this.didWin = false;
    this.guesses = [];
    this.incorrectGuesses = 0;
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  start(difficulty, next) {
    // get word and set it to the class's this.word
    this.word = this.getRandomWord(difficulty);

    // clear canvas
    this.clearCanvas();

    // draw base
    this.drawBase();

    // reset this.guesses to empty array
    this.guesses = [];

    // reset this.isOver to false
    this.isOver = false;

    // reset this.didWin to false
    this.isOver = false;

    next();
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {

    try {
      // Check if nothing was provided and throw an error if so
    if(letter == ""){
      throw "You did not enter a guess.";
    }

    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    if(!/^[a-zA-Z]*$/.test(letter)){
      throw "You did not type a letter.";
    }

    // Check if more than one letter was provided. throw an error if it is.
    if(letter.length > 1){
      throw "You typed more than one letter.";
    }

    // if it's a letter, convert it to lower case for consistency.
    letter = letter.toLowerCase();

    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    let i;
    for(i = 0; i < this.guesses.length; i++){
      if(this.guesses[i] === letter){
        throw "This letter has already been guessed before.";
      }
    }

    // add the new letter to the guesses array.
    this.guesses.push(letter);

    // check if the word includes the guessed letter:
    if(this.word.toString().includes(letter)){
      this.checkWin();
    } else {
      this.onWrongGuess();
    }

    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    }
    catch (error) {
      console.error(error);
      alert(error);
    }
    
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    let i;
    let j;
    let lettersKnown;
    let wordLength = this.word.toString().length;
    let guessLength = this.guesses.length;

    for(i = 0; i < wordLength; i++){
      for(j = 0; j < guessLength; j++){
        if(this.word.toString().charAt(i) === this.guesses[j]){
          lettersKnown++;
        }
      }
    }

    // if zero, set both didWin, and isOver to true
    if(wordLength - lettersKnown == 0){
      this.didWin = true;
      this.isOver = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    switch (this.incorrectGuesses) {
      case 0:
        this.drawHead();
        break;
      case 1:
        this.drawBody();
        break;
      case 2:
        this.drawLeftArm();
        break;
      case 3:
        this.drawRightArm();
        break;
      case 4:
        this.drawLeftLeg();
        break;
      case 5:
        this.drawRightLeg();
        this.isOver = true;
        this.didWin = false;
        break;
    }
    this.incorrectGuesses++;
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    let wordArray = this.word.toString().split('');
    let wordHolderTextAr = "";
    let i;

    for (i = 0; i < this.word.toString().length; i++) {
      if (this.guesses.includes(wordArray[i])) {
        wordHolderTextAr += wordArray[i];
      } else {
        wordHolderTextAr += "_ ";
      }
    }

    return wordHolderTextAr;
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    let guessesText = "Letters Guessed: ";

    guessesText += this.guesses.join(", ");

    return guessesText;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(250, 95, 35, 0, Math.PI*2, false);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(250, 130);
    this.ctx.lineTo(250, 240);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(250, 160);
    this.ctx.lineTo(185, 250);
    this.ctx.stroke();
  }

  drawRightArm() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(250, 160);
    this.ctx.lineTo(315, 250);
    this.ctx.stroke();
  }

  drawLeftLeg() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(250, 240);
    this.ctx.lineTo(185, 335);
    this.ctx.stroke();
  }

  drawRightLeg() {
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(250, 240);
    this.ctx.lineTo(315, 335);
    this.ctx.stroke();
  }
}
