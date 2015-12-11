(function(){	

	function Card (value, image, type){
		this.value = value,
		this.image = image,
		this.type = type
	}

	function createDeck(){
		var deck = []
		var value = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, "A", "A", "A", "A"]
		var img = ["2_of_diamonds.png", "2_of_clubs.png", "2_of_hearts.png", "2_of_spades2.png", "3_of_diamonds.png", "3_of_clubs.png", "3_of_hearts.png", "3_of_spades2.png", "4_of_diamonds.png", "4_of_clubs.png", "4_of_hearts.png", "4_of_spades2.png", "5_of_diamonds.png", "5_of_clubs.png", "5_of_hearts.png", "5_of_spades2.png", "6_of_diamonds.png", "6_of_clubs.png", "6_of_hearts.png", "6_of_spades2.png", "7_of_diamonds.png", "7_of_clubs.png", "7_of_hearts.png", "7_of_spades2.png", "8_of_diamonds.png", "8_of_clubs.png", "8_of_hearts.png", "8_of_spades2.png", "9_of_diamonds.png", "9_of_clubs.png", "9_of_hearts.png", "9_of_spades2.png", "10_of_diamonds.png", "10_of_clubs.png", "10_of_hearts.png", "10_of_spades2.png", "jack_of_diamonds.png", "jack_of_clubs.png", "jack_of_hearts.png", "jack_of_spades2.png", "queen_of_diamonds.png", "queen_of_clubs.png", "queen_of_hearts.png", "queen_of_spades2.png", "king_of_diamonds.png", "king_of_clubs.png", "king_of_hearts.png", "king_of_spades2.png", "ace_of_diamonds.png", "ace_of_clubs.png", "ace_of_hearts.png", "ace_of_spades2.png"]
		for(var i = 0; i < 10; i ++){queen

			var t = new Card(value[i], img[i])
			array.push(t)
		}
	}

})();