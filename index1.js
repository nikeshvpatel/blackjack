let blackjackGame = {
  "You": {
    "scoreSpan": "#your-blackjack-result",
    "div": "#your-box",
    "score": 0
  },
  "Dealer": {
    "scoreSpan": "#dealer-blackjack-result",
    "div": "#dealer-box",
    "score": 0
  },
  "Cards": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  "CardsMap": {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 10,
    "Q": 10,
    "K": 10,
    "A": [1, 11]
  },
  "wins": 0,
  "losses": 0,
  "draws": 0,
  "isStand": false,
  "turnsOver": false,

};
const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lossSound = new Audio("sounds/aww.mp3");
const YOU = blackjackGame["You"];
const DEALER = blackjackGame["Dealer"]
document.querySelector("#blackjack-Hit-button").addEventListener("click", blackjackHit);
document.querySelector("#blackjack-Stand-button").addEventListener("click", dealerLogic);
document.querySelector("#blackjack-Deal-button").addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    var card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  var randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["Cards"][randomIndex];
};

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    var cardImage = document.createElement("img");
    cardImage.src = "images/" + card + ".png";
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  // if you want to play 2 player then active this function.
  // showResult(computeWinner());
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;
    var yourImages = document.querySelector("#your-box").querySelectorAll("img");
    var dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");

    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    };
    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;
    document.querySelector("#your-blackjack-result").style.color = "white";
    document.querySelector("#dealer-blackjack-result").style.color = "white";
    document.querySelector("#blackjack-result").textContent = "Let's Play!"
    document.querySelector("#blackjack-result").style.color = "white";
    blackjackGame["turnsOver"] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["CardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["CardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["CardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["CardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
  }
}

function dealerLogic() {
  blackjackGame["isStand"] = true;
  var card = randomCard();
  showCard(card, DEALER);
  updateScore(card, DEALER);
  showScore(DEALER);

  if (DEALER["score"] > 17) {
    blackjackGame["turnsOver"] = true;
    showResult(computeWinner());
  }
}

function computeWinner() {

  var winner;

  if (YOU["score"] <= 21) {

    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;

    }
  } // When User Busted but Dealer is not
  else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;
  }
  //When you and Dealer both busted
  else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }
  return winner;
}

function showResult(winner) {

  var message, messageColor;

  if (blackjackGame["turnsOver"] === true) {

    if (winner === YOU) {
      document.querySelector("#Wins").textContent = blackjackGame["wins"];
      message = "You Won!!!";
      messageColor = "#fbd46d";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#Losses").textContent = blackjackGame["losses"];
      message = "You Lost!"
      messageColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#Draws").textContent = blackjackGame["draws"];
      message = "You Drew!";
      messageColor = "#776d8a";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}
