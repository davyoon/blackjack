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
		var $newdiv = $("<div style='background-image: url(\"./img/" + url + "\")' class='bj-card animated slideInUp'></div>")
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
			$(".bj-dealer").append($("<div class='bj-hiddenCard animated slideInUp'></div>"))
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
			setTimeout(gameOver, 2500);
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
			setTimeout(gameOver, 2500);
		}
	}

	function gameOver(){
		wager = 0;
		dealerHand = ["Dealer"];
		playerHand = ["Player"];
		$(".bj-chip").on("click", bindChips);
		$(".bj-bet-amount").html(0);
		$(".bj-bet-phase").removeClass("hide");
		$(".bj-hit-phase").addClass("hide");
		$(".bj-dealer").empty();
		$(".bj-player").empty();
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
			setTimeout(gameOver, 2500);
		}else if(dealerTotal === playerTotal){
			swal({ title: "It's a tie!" , text: "You get back $" + wager + "!" , timer: 2000, showConfirmButton: false });
			$(".bj-bank-amount").html(currentBank + wager);
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			setTimeout(gameOver, 2500);
		}else if(dealerTotal > playerTotal){
			swal({ title: "Dealer wins..." , text: "You lose $" + wager + "..." , timer: 2000, showConfirmButton: false });
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			setTimeout(gameOver, 2500);
		}else if(dealerTotal < playerTotal){
			swal({ title: "You win!" , text: "You win $" + wager + "!" , timer: 2000, showConfirmButton: false });
			$(".bj-bank-amount").html(currentBank + wager * 2);
			$(".bj-hiddenCard").remove();
			$("#bj-show-sound")[0].play();
			setTimeout(gameOver, 2500);
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