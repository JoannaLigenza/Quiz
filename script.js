
document.addEventListener('DOMContentLoaded', function() {
	
	const content = document.getElementById("content");
	const name = document.getElementById("name");
	const options = document.getElementsByTagName("option");
	const active = document.querySelector(".active");
	const all_question_cards =  document.getElementsByClassName("question");
	const hello_card = document.getElementById("hello");
	const next_button_in_hello_card = document.getElementById("button");
	const next_button_in_question_card = document.getElementsByClassName("button");
	const questions_number = 5;
	const score = [];	 
	
	const start_quiz = {
		category: "deflaut",
		
		get_name: function() {
			const read_name = name.value;
			return read_name;
		},
		
		get_category: function() {
			for (i=0; i < options.length; i++) {
				if (options[i].selected) {
					category = options[i].value
				}
			}
			return category;
		},
		
		change_card: function() {
			next_button_in_hello_card.addEventListener("click", function() {
				const read_category = start_quiz.get_category();
				solve_quiz.read_status_and_parse_json(read_category);
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
	
	
	const solve_quiz = {
	
		read_status_and_parse_json: function(read_category) { 
		
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
			//console.log(this.readyState)
				if (this.readyState == 4 && this.status == 200) {
					var myObj = JSON.parse(this.responseText);
					solve_quiz.add_questions_and_answers(myObj);
				}
			};
				
			//xmlhttp.open("GET", "./halloween.json", true);	
			xmlhttp.open("GET", "./" + read_category + ".json", true);
			xmlhttp.send();
			//console.log("response: ", xmlhttp.onreadystatechange());
		},
		
		add_questions_and_answers: function(arr) {
			const cards = solve_quiz.add_cards();
			for (i=0; i < cards.length; i++) {
				const number_of_question = solve_quiz.random_question(arr);
				const next_button= document.createElement("button");
				const check_answer_button = document.createElement("button");
				const header = document.createElement("h2");
				const paragraph = document.createElement("p");
				const ul_list = document.createElement("ul");
				const card_list_elements = [];
				const card_inputs = [];
				next_button.innerText = "Next";
				next_button.classList.add("button");
				next_button.id = i;
				check_answer_button.innerText = "Check Answer";
				check_answer_button.classList.add("check-answer-button");
				check_answer_button.id = i;
				paragraph.classList.add("answers-paragraph");
				header.innerText = arr[number_of_question].text
				cards[i].appendChild(header);
				cards[i].appendChild(paragraph);
				paragraph.appendChild(ul_list);
				for (let i=0; i < arr[number_of_question].choices.length; i++) {
					const li = document.createElement("li");
					const label = document.createElement("label");
					const answer = document.createElement("input");
					answer.type = "radio";
					answer.name = "answer";
					answer.id = i;
					const for_label = label.setAttribute("for", i);
					label.innerText = arr[number_of_question].choices[i];
					ul_list.appendChild(li);
					li.appendChild(label);
					label.insertBefore(answer, label.childNodes[0]);
					card_list_elements.push(li);
					card_inputs.push(answer);
				}
				cards[i].appendChild(check_answer_button);
				cards[i].appendChild(next_button);
				next_button.disabled = true;
				solve_quiz.check_answers(card_list_elements, arr[number_of_question], check_answer_button, next_button);
				solve_quiz.switch_card(next_button);
				arr.splice(number_of_question, 1);
			}
			set_score.add_score_card();
		},
		
		add_cards: function () {
			const cards_array = [all_question_cards[0]];
			for (let i=2; i <= questions_number; i++) {
				const card = document.createElement("div");
				card.id = "question"+i;
				card.classList.add("card");
				card.classList.add("question");
				content.appendChild(card);
				cards_array.push(card);
			}
			return cards_array;
		},
		
		
		random_question: function(arr) {
			let questions = arr.length
			const random = Math.floor(Math.random() * (questions-1));
			questions -= 1; 
			return random;
		},
		
		
		check_answers: function(list_element, question, check_answer_button, next_button) {
				check_answer_button.addEventListener("click", function(e) {
					const all_checkbox = [];
					for (i=0; i < list_element.length; i++) {
						if (list_element[i].childNodes[0].childNodes[0].checked && list_element[i].childNodes[0].innerText == question.correct) {	
							console.log("yupi!");
							score.push(1);	
							list_element[i].classList.add("correct_answer");					
						}
						if (list_element[i].childNodes[0].childNodes[0].checked && list_element[i].childNodes[0].innerText != question.correct) {	
							console.log("blad");
							list_element[i].classList.add("bad_answer");
							console.log(question.choices )
						}
						if (list_element[i].childNodes[0].childNodes[0].checked === false) {
							all_checkbox.push(i);
						}
					}
					if (all_checkbox.length == 4) {
						return;
					}
					for (i=0; i < list_element.length; i++) {
						list_element[i].childNodes[0].childNodes[0].disabled = true;
					}
					if (e.target.id == next_button_in_question_card.length-1) {
						console.log("bingo!");
						set_score.add_score_to_score_card(score);
					}
					next_button.disabled = false;
					check_answer_button.disabled = true;
					console.log("sore: " , score);
				} )
		},
		
		switch_card: function(next_button) {
			next_button.addEventListener("click", function() {
				document.querySelector(".active").nextElementSibling.classList.add("active");
				document.querySelector(".active").classList.remove("active");
			})
		}
	}
	
	const set_score = { 
	
		add_score_card: function() {
			const score_card = document.createElement("div");
			score_card.id = "score";
			score_card.classList.add("card");
			content.appendChild(score_card);
			return score_card
		},
		
		add_score_to_score_card: function(score) {
			const set_name = start_quiz.get_name();
			const get_score_card = document.getElementById("score");
			const score_header = document.createElement("h2");
			score_header.innerText = set_name + ", your score: " + score.length + " / " + all_question_cards.length;
			get_score_card.appendChild(score_header);
		}
	}
	
	start_quiz.change_card();
	
});