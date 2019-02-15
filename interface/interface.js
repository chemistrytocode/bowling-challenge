var scorecard = new Scorecard();
var turnCounter = 1;
var frameCounter = 1;

document.addEventListener("DOMContentLoaded", function() {
  console.log("Hello World");
});

function pinHit(number) {
  if (frameCounter > 9) {
    turnTenRules(number);
  } else {
    if (turnCounter === 1) {
      // If Turn 1
      scorecard.firstThrow(number);
      if (scorecard.strikeCheck(scorecard._firstThrow)) {
        ifStrike();
        frameCounter++;
      } else {
        displayAndIncrement(number);
      }
    } else {
      scorecard.secondThrow(number);
      if (scorecard.spareCheck(scorecard._firstThrow, scorecard._secondThrow)) {
        ifSpare();
        incrementCounters();
      } else {
        displayAndIncrement(number);
      }
    }
  }
}

function ifStrike() {
  scorecard.recordStrike();
  displayThrow(frameCounter, 2, "X");
  updateScores();
}

function ifSpare() {
  displayThrow(frameCounter, 2, "/");
}

function displayAndIncrement(number) {
  displayThrow(frameCounter, turnCounter, number);
  incrementCounters();
}

function incrementCounters() {
  turnCounter++;
  if (turnCounter === 3) {
    scorecard.addToFrames();
    updateScores();
    turnCounter = 1;
    frameCounter++;
  }
}

function displayThrow(frame, turn, number) {
  let idToChange = `f${frame}t${turn}`;
  document.getElementById(idToChange).innerHTML = number;
}

function displayScores() {
  for (var i = 1; i <= 10; i++) {
    let score = scorecard._score[i - 1];
    if (typeof score === "undefined") {
      score = "";
    }
    if (isNaN(score)) {
      score = "";
    }
    document.getElementById(`f${i}total`).innerHTML = score;
  }
}

function updateTotal() {
  scorecard.updateScores();
  total = scorecard.calculateTotal();
  if (!isNaN(total)) {
    document.getElementById("total").innerHTML = scorecard.calculateTotal();
  }
}

function updateScores() {
  updateTotal();
  displayScores();
}

// console.log(`f${frameCounter}t${turnCounter}`);

function turnTenRules(number) {
  if (turnCounter === 1) {
    // If Turn 1
    scorecard.firstThrow(number);
    // If Strike, display Strike and trigger extra turn
    if (scorecard.strikeCheck(number)) {
      displayThrow(frameCounter, turnCounter, "X");
      // Else Display Number
    } else {
      displayThrow(frameCounter, turnCounter, number);
    }
    console.log("Turn 1 Push");
    scorecard._allFrames[9] = [number];
  } // End of Turn 1 Check
  if (turnCounter === 2) {
    // If Turn 2
    scorecard.secondThrow(number);
    // If Strike, display Strike and trigger extra turn
    if (scorecard.strikeCheck(number)) {
      console.log(`Strike At: f${frameCounter}t${turnCounter}`);
      displayThrow(frameCounter, turnCounter, "X");
    }
    // If Spare, display Spare and trigger extra turn
    else if (
      scorecard.spareCheck(scorecard._firstThrow, scorecard._secondThrow)
    ) {
      console.log(`Spare At: f${frameCounter}t${turnCounter}`);
      displayThrow(frameCounter, turnCounter, "/");
      // Else Display Number
    } else {
      displayThrow(frameCounter, turnCounter, number);
    }
    // Add to Frame and Update Scores after Turn 2
    console.log("Turn 2 Push");
    scorecard._allFrames[9].push(number);
  } // End of Turn 2 Check
  // If Turn 3 was trigger, Strike/Spare on previous rolls
  if (turnCounter >= 3) {
    if (
      scorecard._allFrames[9][0] === 10 ||
      scorecard._allFrames[9][1] === 10 ||
      scorecard._allFrames[9][0] + scorecard._allFrames[9][1] === 10
    ) {
      // If Strike, display Strike
      if (scorecard.strikeCheck(number)) {
        console.log(`Third Turn Strike At: f${frameCounter}t${turnCounter}`);
        displayThrow(frameCounter, turnCounter, "X");
      }
      // Else display number
      else {
        console.log(`Third Turn Normal: f${frameCounter}t${turnCounter}`);
        displayThrow(frameCounter, turnCounter, number);
      }
      // Push extra turn score to existing array
      console.log("Turn 3 Push");
      console.log(`${turnCounter}`);
      scorecard._allFrames[9].push(number);
      updateScores();
    }
  }
  // After each turn, increment Turn and update Scores
  console.log(`Score For: ${turnCounter}`);
  console.log(scorecard._allFrames);
  console.log(scorecard._score);
  updateScores();
  turnCounter++;
}
