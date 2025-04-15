class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }
  
    render(root, onClick) {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerText = `${this.rank}${this.suit}`;
      div.onclick = () => onClick(this);
      root.appendChild(div);
    }
  
    matches(otherCard) {
      return this.rank === otherCard.rank || this.suit === otherCard.suit;
    }
  }

  class Deck {
    constructor() {
      this.cards = [];
      const suits = ["♥", "♠", "♦", "♣"];
      const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  
      for (let suit of suits) {
        for (let rank of ranks) {
          this.cards.push(new Card(rank, suit));
        }
      }
  
      this.shuffle();
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    draw() {
      return this.cards.pop();
    }
  }

  class Player {
    constructor(name) {
      this.name = name;
      this.hand = [];
    }
  
    draw(deck) {
      const card = deck.draw();
      if (card) this.hand.push(card);
    }
  
    playCard(card) {
      const index = this.hand.indexOf(card);
      if (index !== -1) {
        return this.hand.splice(index, 1)[0];
      }
      return null;
    }
  }

  class Game {
    constructor() {
      this.deck = new Deck();
      this.player = new Player("Speler");
      this.discardPile = [];
      this.init();
    }
  
    init() {
      // Begin met 7 kaarten
      for (let i = 0; i < 7; i++) {
        this.player.draw(this.deck);
      }
  
      // Leg een kaart open op de aflegstapel
      const firstCard = this.deck.draw();
      this.discardPile.push(firstCard);
      this.updateUI();
    }
  
    drawCard() {
      this.player.draw(this.deck);
      this.updateUI();
    }
  
    playCard(card) {
      const topCard = this.discardPile[this.discardPile.length - 1];
      if (card.matches(topCard)) {
        const played = this.player.playCard(card);
        this.discardPile.push(played);
        this.updateUI();
        this.checkWin();
      } else {
        alert("Je mag deze kaart niet spelen!");
      }
    }
  
    checkWin() {
      if (this.player.hand.length === 0) {
        document.getElementById("game-status").innerText = "Je hebt gewonnen!";
      }
    }
  
    updateUI() {
      const handRoot = document.getElementById("player-hand");
      handRoot.innerHTML = "";
      this.player.hand.forEach(card => {
        card.render(handRoot, (c) => this.playCard(c));
      });
  
      const discardRoot = document.getElementById("discard-pile");
      const topCard = this.discardPile[this.discardPile.length - 1];
      discardRoot.innerText = `${topCard.rank}${topCard.suit}`;
    }
  }

  const game = new Game();

document.getElementById("draw-button").addEventListener("click", () => {
  game.drawCard();
});