
document.addEventListener('DOMContentLoaded', function() {
	
	const content = document.getElementById("content");
	const active = document.querySelector(".active");
	const all_question_cards =  document.getElementsByClassName("question");
	const hello_card = document.getElementById("hello");
	const next_button_in_hello_card = document.getElementById("button");
	const next_button_in_question_card = document.getElementsByClassName("button");
	//const category = document.getElementById("category");
	
	 
	
	const start_quiz = {
		change_card: function() {
			next_button_in_hello_card.addEventListener("click", function() {
				//hello_card.style.zIndex = 0;
				//question_card_1.style.zIndex = 2;
				active.nextElementSibling.classList.add("active");
				active.classList.remove("active");
			} )	
		}
	}
	
/*	function loadJSON(callback) {   

		var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
		xobj.open('GET', './halloween.json', true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = function () {
			  if (xobj.readyState == 4 && xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);
			  }
		};
		xobj.send(null);  
	}
	
	function init() {
	 loadJSON(function(response) {
	  // Parse JSON string into object
		var actual_JSON = JSON.parse(response);
		console.log(actual_JSON);
	 });
	} */
	
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	//console.log(this.readyState)
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			//document.getElementById("demo").innerHTML = myObj.name;
			//console.log(myObj[0].text);
			add_questions_and_answers(myObj);
			return myObj;
			//mojObiekt.dodaj.myObj - prototype
		}
	};
		
	xmlhttp.open("GET", "./halloween.json", true);
	xmlhttp.send();
	//console.log("response: ", xmlhttp.onreadystatechange());
	
	function add_cards() {
		const cards_array = [all_question_cards[0]];
		for (let i=2; i <= 20; i++) {
			const card = document.createElement("div");
			card.id = "question"+i;
			card.classList.add("card");
			card.classList.add("question");
			content.appendChild(card);
			cards_array.push(card);
		}
		return cards_array;
	}
	
	
	function random_question(arr) {
		const questions = arr
		const random = Math.floor(Math.random() * (questions.length-1));
		questions.splice(random, 1);
		return random;
	}
	
	
	function add_questions_and_answers(arr) {
		const cards = add_cards();
		for (i=0; i < cards.length; i++) {
			const question_number = random_question(arr);
			//console.log(cards.length);
			//console.log(question_number);
			const next_button= document.createElement("button");
			next_button.innerText = "Next";
			next_button.classList.add("button");
			next_button.id = i;
			const header = document.createElement("h2");
			const paragraph = document.createElement("p");
			const ul_list = document.createElement("ul");
			paragraph.classList.add("answers-paragraph");
			header.innerText = arr[question_number].text
			cards[i].appendChild(header);
			cards[i].appendChild(paragraph);
			paragraph.appendChild(ul_list);
			for (let i=0; i < arr[question_number].choices.length; i++) {
				const li = document.createElement("li");
				const label = document.createElement("label");
				const answer = document.createElement("input");
				answer.type = "radio";
				answer.name = "answer";
				answer.id = i;
				const for_label = label.setAttribute("for", i);
				//for_label = i;
				label.innerText = arr[question_number].choices[i];
				ul_list.appendChild(li);
				li.appendChild(answer);
				li.appendChild(label);
				//answer.appendChild(label); 
			}
			cards[i].appendChild(next_button);
			switch_card(next_button)
		}
		add_score_card();
	}
	
	function add_score_card() {
		const score = document.createElement("div");
		score.id = "score";
		score.classList.add("card");
		content.appendChild(score);
	}
	
	function switch_card(next_button) {
		next_button.addEventListener("click", function() {
			document.querySelector(".active").nextElementSibling.classList.add("active");
			document.querySelector(".active").classList.remove("active");
		})
	}
	
	start_quiz.change_card();
	//console.log(next_button_in_question_card);
	
});