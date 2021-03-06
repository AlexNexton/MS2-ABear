// Reference to tutorial added to Acknowlegments Section that helped me write this code in README.md

//---------------------------Start of Audio controller class------------------------------------------------------

class AudioController{ // adding the audio for the game and the card sounds
    constructor(){
            //ref https://www.zapsplat.com/sound-effect-category/button-clicks/
            this.backgroundMusic = new Audio('assets/audio/backgroundMusic.mp3');
            this.flipSound =  new Audio('assets/audio/flipSound.mp3'); 
            this.matchSound =  new Audio('assets/audio/match.wav');
            this.victorySound =  new Audio('assets/audio/victorySound.mp3');
            this.gameOverSound = new Audio('assets/audio/gameover.mp3');
            this.backgroundMusic.volume = 0.3;
            this.backgroundMusic.loop = true;

    } // functions to be called for the cards and background music
    startMusic(){
        this.backgroundMusic.play();
    }
    stopMusic(){
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        
         setTimeout(() =>{
            this.matchSound.play();
        }, 600); // so the sound plays after the second card is flipped
        
    }
    victory(){
        this.stopMusic(); //stops background music once the game is complete
         setTimeout(() =>{
            this.victorySound.play();
        }, 600); // victory is played after the final card is flipped but delayed slightly
        
        
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }

}
//---------------------------end of Audio controller class------------------------------------------------------



//---------------------------Start of Animal Word Match class------------------------------------------------------

class MixorMatch{
    constructor(totalTime, cards){
            this.cardsArray = cards;
            this.totalTime = totalTime;
            this.timeRemanining = totalTime;
            this.timer = document.getElementById('time-remaining');
            this.ticker = document.getElementById('flips');
            this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemanining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() =>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemanining; // reseting timer and ticker
        this.ticker.innerText = this.totalClicks;
    }
    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('vis');
            card.classList.remove('matched');
        });
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();

            this.totalClicks++; // counts eachtime the cards are clicked
            this.ticker.innerText = this.totalClicks;

            card.classList.add('vis'); //flips the cards using class I created in html 'vis'
            

            if(this.cardToCheck)//for matching cards
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
            
        }
    }
    
     checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
           
            this.cardMatch(card, this.cardToCheck);
        else
             this.cardMisMatch(card, this.cardToCheck);
        
        this.cardToCheck = null;

        
     }
     cardMatch(card1, card2){
        this.matchedCards.push(card1);
         this.matchedCards.push(card2);
         card1.classList.add('matched');
         card2.classList.add('matched');
         this.audioController.match();
         if(this.matchedCards.length === this.cardsArray.length)
         this.victory();
     }
     cardMisMatch(card1, card2){
         //if there's a mis match the user gets a second before the cards flip back
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('vis');
            card2.classList.remove('vis');
            this.busy = false;
        }, 1000);
     }
     getCardType(card){
        return card.dataset.framework; //------------------------------------------So that card words match with pictures-------------------------------------------
     }
    startCountDown(){
        return setInterval(() => {
            this.timeRemanining--; // decrements the clock
            this.timer.innerText = this.timeRemanining; //changes the html clock
            if(this.timeRemanining === 0)
                this.gameOver();
            
        }, 1000);
    }
    gameOver(){ //game over screen pops up
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('vis'); 

    }
    victory(){ //victory text pops up
        clearInterval(this.countDown);
         setTimeout(() =>{
            this.audioController.victory();
         document.getElementById('victory-text').classList.add('vis');
        }, 600); // victory is played after the final card is flipped but delayed slightly
        
    }
     shuffleCards(){ //fisher and yates shuffle - taken from the internet https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
            for(let i = this.cardsArray.length - 1; i > 0; i--)
            {
                let randIndex = Math.floor(Math.random() * (i+1));
                this.cardsArray[randIndex].style.order = i;
                this.cardsArray[i].style.order = randIndex;
            }
        }
    canFlipCard(card){ // if all three of these statements are false then this will return true --to see the card flipping for now
     return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

//---------------------------end of Animal word match class------------------------------------------------------



//---------------------------Start of Ready Function ------------------------------------------------------
function ready(){
    let intro = document.getElementById('intro'); //shows the intro message
    let startgame = document.getElementById('startgame'); //starts the game
    let cards = Array.from(document.getElementsByClassName('card')); // gets the array of cards from the html page
    let game = new MixorMatch(99, cards); // instance for card game #1
     startgame.addEventListener('click',() =>{
        intro.classList.remove('vis');
                
        });
 //To Start the game once clicked on the Overlay screen.
     window.onload=function(){

        startgame.addEventListener("click", startGameBtn, false); 

        function startGameBtn() { 
        game.startGame(); 
        }//starts the game #1

        cards.forEach(card => {
        card.addEventListener('click', () =>{
            game.flipCard(card); //flips a card #1
        });
    });
};
            
    
}
if(document.readyState === 'loading'){
 document.addEventListener('DOMContentLoaded', ready()); //loads script once the html has finished loading.
}else{
    ready(); //else call it anyway assumming it's already loaded
}
