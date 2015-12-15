

// ___________BLACKJACK__________

(function(){
	var deck;
	var wager = 0;
	var dealerHand = ["Dealer"];
	var playerHand = ["Player"];

	// Constructor function to make cards
	function Card (value, image, type){
		this.value = value,
		this.image = image,
		this.type = type
	}

	// Make deck of cards in order
	function unshuffledDeck(){
		var deck = []
		var value = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, "A", "A", "A", "A"]
		var img = ["2_of_diamonds.png", "2_of_clubs.png", "2_of_hearts.png", "2_of_spades.png", "3_of_diamonds.png", "3_of_clubs.png", "3_of_hearts.png", "3_of_spades.png", "4_of_diamonds.png", "4_of_clubs.png", "4_of_hearts.png", "4_of_spades.png", "5_of_diamonds.png", "5_of_clubs.png", "5_of_hearts.png", "5_of_spades.png", "6_of_diamonds.png", "6_of_clubs.png", "6_of_hearts.png", "6_of_spades.png", "7_of_diamonds.png", "7_of_clubs.png", "7_of_hearts.png", "7_of_spades.png", "8_of_diamonds.png", "8_of_clubs.png", "8_of_hearts.png", "8_of_spades.png", "9_of_diamonds.png", "9_of_clubs.png", "9_of_hearts.png", "9_of_spades.png", "10_of_diamonds.png", "10_of_clubs.png", "10_of_hearts.png", "10_of_spades.png", "jack_of_diamonds.png", "jack_of_clubs.png", "jack_of_hearts.png", "jack_of_spades.png", "queen_of_diamonds.png", "queen_of_clubs.png", "queen_of_hearts.png", "queen_of_spades.png", "king_of_diamonds.png", "king_of_clubs.png", "king_of_hearts.png", "king_of_spades.png", "ace_of_diamonds.png", "ace_of_clubs.png", "ace_of_hearts.png", "ace_of_spades2.png"]
		for(var i = 0; i < 52; i ++){
			var t = new Card(value[i], img[i])
			deck.push(t)
		}
		return deck
	}

	// FISHER-YATES SHUFFLE
	function shuffle(array){
		var shuffled = [], n = array.length, i;
		while(n){
			i = Math.floor(Math.random() * n--);
			shuffled.push(array.splice(i, 1)[0]);
		}
		return shuffled
	}

	//Deal card to 1 player, remove from deck, add to array, and append to dom
	function deal(deck, parent, player){
		var url = deck[0].image;
		player.push(deck.splice(0, 1)[0]);
		var $newdiv = $("<div style='background-image: url(\"./img/" + url + "\")' class='bj-card animated flipInY'></div>")
		parent.append($newdiv)
		$("#bj-deal-sound")[0].play();
	}

	//Bind chips for click event
	function bindDeal(){
		var currentBet = Number($(".bj-bet-amount").html());
		if(currentBet === 0){
			swal({ title: "Must place a bet!", text: "Enter a bet between 1 - 2000.", timer: 2000, showConfirmButton: false });
		}else{
			var bet = Number($(".bj-bet-amount").html());
			wager = bet;
			var toShuffle = unshuffledDeck();
			deck = shuffle(toShuffle);
			deal(deck, $(".bj-player"), playerHand);
			deal(deck, $(".bj-dealer"), dealerHand);
			$(".bj-dealer").append($("<div class='bj-hiddenCard animated flipInY'></div>"))
			deal(deck, $(".bj-player"), playerHand);
			deal(deck, $(".bj-dealer"), dealerHand);
			$(".bj-bet-phase").addClass("hide");
			$(".bj-hit-phase").removeClass("hide");
			$(".bj-chip").unbind("click");
			checkForBlackJack(playerHand);
			checkForBlackJack(dealerHand);
		}
	}

	function bindChips(){
		var chip = $(event.target).prop("id").split("p");
		var value = Number(chip[1])
		var currentBet = Number($(".bj-bet-amount").html());
		var currentBank = Number($(".bj-bank-amount").html());
		
		if(currentBet + value <= 2000 && currentBank - value >= 0){
			$(".bj-bet-amount").html(currentBet + value);
			$(".bj-bank-amount").html(currentBank - value);
			$("#bj-chip-sound")[0].play();
		}else if(currentBank - value < 0){
			swal({ title: "Insufficient funds!", text: "Try making smaller bets.", timer: 2000, showConfirmButton: false });
		}else{
			swal({ title: "Maximum bet exceeded!", text: "Maximum bet is $2000.", timer: 2000, showConfirmButton: false });
		}
	}

	function checkForAce(player){
		var aces = [];
		for(var i = 1; i < player.length; i++){
			if(player[i].value === "A"){
				aces.push(i);
			}
		}
		return {
			aces: aces,
			sum: 0,
			getSum: function(player){
				for(var i = 1; i < player.length; i++){
					if(player[i].value !== "A"){
						this.sum += player[i].value;
					}
				}
				if(aces.length){
					for(var i = 0; i < aces.length; i++){
						if(this.sum + 11 <= 21){
							player[aces[i]].value = 11;
							this.sum += 11;
						}else{
							player[aces[i]].value = 1;
							this.sum += 1;
						}
					}
				}
				return this.sum;
			}
		}
	}

	function checkForBlackJack(player){
		var name = player[0];
		var aces = checkForAce(player);
		var total = aces.getSum(player);
		var currentBank = Number($(".bj-bank-amount").html());
		if(total === 21){
			swal({ title: "BlackJack!" , text: player[0] + " wins by blackjack.", timer: 2000, showConfirmButton: false });
			if(name === "Player"){
				$(".bj-bank-amount").html(currentBank + wager * 3);
			}
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}
	}

	function checkForBust(player){
		var name = player[0];
		var aces = checkForAce(player);
		var total = aces.getSum(player);
		var currentBank = Number($(".bj-bank-amount").html());
		if(total > 21){
			if(name === "Dealer"){
				swal({ title: "Dealer busts!" , text: "You win $" + wager + "!" , timer: 2000, showConfirmButton: false });
				$(".bj-bank-amount").html(currentBank + wager);
			}else{
				swal({ title: "You bust..." , text: "You lose $" + wager + "..." , timer: 2000, showConfirmButton: false });
			}
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}
	}

	function gameOver(){
		var currentBank = Number($(".bj-bank-amount").html());
		wager = 0;
		dealerHand = ["Dealer"];
		playerHand = ["Player"];
		$(".bj-chip").on("click", bindChips);
		$(".bj-bet-amount").html(0);
		$(".bj-bet-phase").removeClass("hide");
		$(".bj-hit-phase").addClass("hide");
		setTimeout(function(){
			$(".bj-dealer").children().fadeOut(500,"linear", function(){
				$(".bj-dealer").empty();
			})
			$(".bj-player").children().fadeOut(500, "linear", function(){
				$(".bj-player").empty();
			});
			
		},3000);
		if(currentBank === 0){
			swal({   title: "You're broke!",   text: "Here's your money back. You broke bastard.",   imageUrl: "./img/nomoney.png" });
			$(".bj-bank-amount").html(2500);
		}
	}

	function compare(player, dealer){
		var playerName = player[0];
		var dealerName = dealer[0];
		var playerTotal = checkForAce(player).getSum(player);
		var dealerTotal = checkForAce(dealer).getSum(dealer);
		var currentBank = Number($(".bj-bank-amount").html());

		if(dealerTotal < 17){
			deal(deck, $(".bj-dealer"), dealerHand);
			compare(player, dealer);
		}else if(dealerTotal > 21){
			swal({ title: "Dealer busts!" , text: "You win $" + wager + "!" , timer: 2000, showConfirmButton: false });
			$(".bj-bank-amount").html(currentBank + wager * 2);
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}else if(dealerTotal === playerTotal){
			swal({ title: "It's a tie!" , text: "You get back $" + wager + "!" , timer: 2000, showConfirmButton: false });
			$(".bj-bank-amount").html(currentBank + wager);
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}else if(dealerTotal > playerTotal){
			swal({ title: "Dealer wins..." , text: "You lose $" + wager + "..." , timer: 2000, showConfirmButton: false });
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}else if(dealerTotal < playerTotal){
			swal({ title: "You win!" , text: "You win $" + wager + "!" , timer: 2000, showConfirmButton: false });
			$(".bj-bank-amount").html(currentBank + wager * 2);
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			gameOver();
		}
	}

	$(".bj-deal").on("click", bindDeal)

	// Update value of bet and balance while checking for funds/max
	$(".bj-chip").on("click", bindChips);

	$(".bj-hit").on("click", function(){
		deal(deck, $(".bj-player"), playerHand);
		checkForBust(playerHand);
	});

	$(".bj-stand").on("click", function(){
		compare(playerHand, dealerHand);
	})

})();

// ___________TICTACTOE__________

(function(){

	//set defaults for game
	var turnCounter = 0;
	var oArray = [null, null, null, null, null, null, null, null, null];
	var xArray = [null, null, null, null, null, null, null, null, null];
	var gameOver = false;

	$(".start").on("click", function(){
		var name1 = $(".name1Input").val();
		var name2 = $(".name2Input").val();
		$(".name1").text(name1);
		$(".name2").text(name2);
		$(".toe-welcome").addClass("hide");
		$(".toe-main").removeClass("hide");
		setGame();
	});


	//create boxes for game and run startGame function
	function setGame(){
		for(var i = 0; i < 9; i++){
				$div = $("<div class='box'>").attr("id",[i]);
				var $container = $(".container");
				$container.append($div);
			}
			startGame();
		}

	//check if a player won
	function checkWinner(){
		var score1 = parseInt($("#score1").text());
		var score2 = parseInt($("#score2").text());
		var $playButton = $(".playButton");
		if(oArray[0] === "O" && oArray[0] === oArray[1] && oArray[1] === oArray[2]  ||  oArray[3] === "O" && oArray[3] === oArray[4] && oArray[4] === oArray[5]  ||  oArray[6] === "O" && oArray[6] === oArray[7] && oArray[7] === oArray[8]
			|| oArray[2] === "O" && oArray[2] === oArray[5] && oArray[5] === oArray[8]  ||  oArray[1] === "O" && oArray[1] === oArray[4] && oArray[4] === oArray[7]	||  oArray[0] === "O" && oArray[0] === oArray[3] && oArray[3] === oArray[6]
			|| oArray[0] === "O" && oArray[0] === oArray[4] && oArray[4] === oArray[8]	||	oArray[2] === "O" && oArray[2] === oArray[4] && oArray[4] === oArray[6]){
			gameOver = true;
			$("#score1").text(score1 += 1);
			$playButton.removeClass("hide");
			swal({   title: "O Wins!",   text: "Score is " + score1 + " - " + score2 + ".",   imageUrl: "./img/congrats.jpg" });
			playAgain();
		}else if(xArray[0] === "X" && xArray[0] === xArray[1] && xArray[1] === xArray[2]  ||  xArray[3] === "X" && xArray[3] === xArray[4] && xArray[4] === xArray[5]  ||  xArray[6] === "X" && xArray[6] === xArray[7] && xArray[7] === xArray[8]
			|| xArray[2] === "X" && xArray[2] === xArray[5] && xArray[5] === xArray[8]  ||  xArray[1] === "X" && xArray[1] === xArray[4] && xArray[4] === xArray[7]	||  xArray[0] === "X" && xArray[0] === xArray[3] && xArray[3] === xArray[6]
			|| xArray[0] === "X" && xArray[0] === xArray[4] && xArray[4] === xArray[8]	||	xArray[2] === "X" && xArray[2] === xArray[4] && xArray[4] === xArray[6]){
			gameOver = true;
			$("#score2").text(score2 += 1);
			$playButton.removeClass("hide");
			swal({   title: "X Wins!",   text: "Score is " + score1 + " - " + score2 + ".",   imageUrl: "./img/congrats.jpg" });
			playAgain();
		}
		else if(turnCounter === 9){
			gameOver = true;
			$playButton.removeClass("hide");
			swal({   title: "It's a Tie!",   text: "Score is still " + score1 + " - " + score2 + ".",   imageUrl: "./img/congrats.jpg" });
			playAgain();
		}
	}

	//reset all default values, remove all divs from the dom and re-append
	function playAgain(){
		var $playButton = $(".playButton");
		$playButton.on("click", function(){
			turnCounter = 0;
			oArray = [null, null, null, null, null, null, null, null, null];
			xArray = [null, null, null, null, null, null, null, null, null];
			gameOver = false;
			$playButton.addClass("hide");
			$(".congrats").toggle();
			$(".box").remove();
			setGame();
		 });
	}

	//bind all divs and alternate turns
	function startGame() {
		var $spot = $(".box");
		function proceed(event){
			//unbind all divs if gameover
			if(gameOver === true){
				$spot.unbind("click");
			}else if(gameOver === false){
				$(event.target).unbind("click");
				//if counter is even, O turn
				if(turnCounter % 2 === 0){
					$(event.target).addClass("opic animated flip");
					var boxNum = $(event.target).prop("id");
					oArray[boxNum] = "O";
				//if counter is not even, X turn
				}else{
					$(event.target).addClass("xpic animated flip");
					var boxNum = $(event.target).prop("id");
					xArray[boxNum] = "X";
				}
				//add 1 to counter and checkWinner
				turnCounter += 1;
				checkWinner();
			};
		} 
		//run function proceed when a div is clicked
		$spot.click(proceed);
	}

})();

// ___________LANDING__________

$(".landing-black").on("click", function(){
		$(".landing-page").addClass("hide");
		$(".blackjack").removeClass("hide");
})

$(".landing-black").hover(function(){
	$(".landing-bj-hover").toggleClass("hide");
})

$(".landing-toe").hover(function(){
	$(".landing-toe-hover").toggleClass("hide");
})

$(".landing-toe").on("click", function(){
		$(".landing-page").addClass("hide");
		$(".tictactoe").removeClass("hide");
})
