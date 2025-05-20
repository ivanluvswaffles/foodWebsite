var currentPage;
var password = 'french fries';
var input;
var isPlaying = [0,0,0,0]; // keeps track of which audios are playing
var lockStatus = 0; // decides whether password lock is on or off
var rainAudio;
var lofiAudio;
var cafeAudio;
var lofiButton;
var cafeButton;
var rainButton;

var foodCategories = [
    "Famous Dishes", 
    "Food Science", 
    "Cooking Methods", 
    "World Cuisine", 
    "Food History",
    "Ingredients"
];

var jeopardyQuestions = {
    "Famous Dishes": {
        100: { question: "This Italian dish consists of a flattened disk of bread dough topped with various ingredients", answer: "What is Pizza?" },
        200: { question: "This French soup has a crust of melted cheese on top", answer: "What is French Onion Soup?" },
        300: { question: "This dish consists of thinly sliced raw fish, a Japanese specialty", answer: "What is Sashimi?" },
        400: { question: "This Mexican dish features a tortilla filled with various ingredients, then rolled and often baked", answer: "What is an Enchilada?" },
        500: { question: "This rich French dessert is made with egg yolks, sugar, and cream, with a hard caramel top", answer: "What is Crème Brûlée?" }
    },
    "Food Science": {
        100: { question: "This process uses salt, vinegar, or fermentation to preserve food", answer: "What is Pickling?" },
        200: { question: "This reaction that creates browning on food is named after a French chemist", answer: "What is the Maillard Reaction?" },
        300: { question: "This substance is used to thicken sauces and is derived from wheat flour", answer: "What is Roux?" },
        400: { question: "This cooking technique involves submerging food in water at a precisely controlled temperature", answer: "What is Sous Vide?" },
        500: { question: "This chemical process turns milk into yogurt", answer: "What is Fermentation?" }
    },
    "Cooking Methods": {
        100: { question: "This method involves cooking food in hot oil", answer: "What is Frying?" },
        200: { question: "This technique cooks food with dry heat from all sides", answer: "What is Roasting?" },
        300: { question: "This method involves cooking in a sealed vessel under pressure", answer: "What is Pressure Cooking?" },
        400: { question: "This French term refers to preparing all ingredients before cooking begins", answer: "What is Mise en Place?" },
        500: { question: "This method involves cooking over direct heat on a metal grid", answer: "What is Grilling?" }
    },
    "World Cuisine": {
        100: { question: "This country is known for pasta, pizza and gelato", answer: "What is Italy?" },
        200: { question: "This Asian cuisine features dishes like Pad Thai and Tom Yum soup", answer: "What is Thai cuisine?" },
        300: { question: "This Middle Eastern dish consists of ground chickpeas formed into balls and fried", answer: "What are Falafel?" },
        400: { question: "This Spanish rice dish often includes seafood and saffron", answer: "What is Paella?" },
        500: { question: "This Ethiopian staple is a spongy, fermented flatbread", answer: "What is Injera?" }
    },
    "Food History": {
        100: { question: "This popular condiment was developed in the 1860s by Henry J. Heinz", answer: "What is Ketchup?" },
        200: { question: "This food was accidentally invented by Ruth Wakefield in 1930", answer: "What is the Chocolate Chip Cookie?" },
        300: { question: "This sandwich was named after the 4th Earl of this English town", answer: "What is a Sandwich? (named after the Earl of Sandwich)" },
        400: { question: "This beverage was invented by pharmacist John Pemberton in 1886", answer: "What is Coca-Cola?" },
        500: { question: "This dessert was created in honor of the Russian ballerina Anna Pavlova", answer: "What is Pavlova?" }
    },
    "Ingredients": {
        100: { question: "This spice comes from the dried stigmas of a crocus flower", answer: "What is Saffron?" },
        200: { question: "This root vegetable is the main ingredient in wasabi", answer: "What is Horseradish?" },
        300: { question: "This grain is the most widely consumed staple food for over half the world's population", answer: "What is Rice?" },
        400: { question: "This type of salt has large, flaky crystals and comes from the sea", answer: "What is Fleur de Sel or Sea Salt?" },
        500: { question: "This blue-green algae is used as a dietary supplement", answer: "What is Spirulina?" }
    }
};

var currentScore = 0;
var answeredQuestions = [];
var currentQuestion = null;
var jeopardyContainer;


function startJeopardyGame(){
	jeopardyContainer = document.getElementById('jeopardyContainer');

	jeopardyContainer.innerHTML = '';

	var scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    scoreDisplay.textContent = `Score: ${currentScore}`;
    document.querySelector('.bigText').after(scoreDisplay);

	foodCategories.forEach((category) => {
        var categoryElement = document.createElement('div');
        categoryElement.classList.add('jeopardyCat');
        categoryElement.textContent = category;
        jeopardyContainer.appendChild(categoryElement);
    });

	[100, 200, 300, 400, 500].forEach((value) => {
        foodCategories.forEach((category) => {
            var questionElement = document.createElement('div');
            questionElement.classList.add('jeopardyItem');
            questionElement.textContent = `${value}`;
            
            //setting and elements dataset is logging something in the element without it being visible or css related
            questionElement.dataset.category = category;
            questionElement.dataset.value = value;
			
			var questionId = `${category}-${value}`;
            if (answeredQuestions.includes(questionId)) {
                questionElement.classList.add('answered');
                questionElement.textContent = '';
            } else {
                questionElement.addEventListener('click', () => showQuestion(category, value, questionElement));
            }

            jeopardyContainer.appendChild(questionElement);
        });
    });
}

function showQuestion(category, value, element) {
	var hideScrollBar = `
		::-webkit-scrollbar {
			display: none;
		}`
	
	var hideScrollBarStyle = document.createElement('style');
	document.head.appendChild(hideScrollBarStyle);
	hideScrollBarStyle.textContent = hideScrollBar;
	
	currentQuestion = {
        category,
        //parseInt converts argument into an integer in this case "value"
        value: parseInt(value),
        question: jeopardyQuestions[category][value].question,
        answer: jeopardyQuestions[category][value].answer,
        element
    };

    var qScreen = document.createElement('div');
    qScreen.id = 'qScreen';
    
    var qScreenContent = document.createElement('div');
    qScreenContent.classList.add('qScreenContent');
    
    var categoryTitle = document.createElement('div');
    categoryTitle.classList.add('categoryTitle');
    categoryTitle.textContent = category;
    
    var questionText = document.createElement('div');
    questionText.classList.add('qText');
    questionText.textContent = jeopardyQuestions[category][value].question;
    
    var answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.classList.add('answerInput');
    answerInput.placeholder = 'Your answer...';
    
    var submitButton = document.createElement('button');
    submitButton.classList.add('submitAnswer');
    submitButton.textContent = 'Submit Answer';
    submitButton.addEventListener('click', () => checkAnswer(answerInput.value));
    
    qScreenContent.appendChild(categoryTitle);
    qScreenContent.appendChild(questionText);
    qScreenContent.appendChild(answerInput);
    qScreenContent.appendChild(submitButton);
    qScreen.appendChild(qScreenContent);

    document.body.appendChild(qScreen);
    
    //focus makes it so you can type without having to click on the input
    answerInput.focus();

    answerInput.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
			if (answerInput.value.trim() !== ''){
				checkAnswer(answerInput.value);
			} else{
				answerInput.value = '';
			}
        }
    });
}

function checkAnswer(playerAnswer){
	var questionId = `${currentQuestion.category}-${currentQuestion.value}`;
	answeredQuestions.push(questionId);

	document.getElementById('qScreen').remove();

	var resultScreen = document.createElement('div');
    resultScreen.classList.add('resultScreen');
    
    var resultContent = document.createElement('div');
    resultContent.classList.add('resultContent');
    
    var correctAnswer = document.createElement('div');
    correctAnswer.classList.add('correctAnswer');
    correctAnswer.textContent = `Correct Answer: ${currentQuestion.answer}`;

    var cleanedPlayer = cleanAnswer(playerAnswer);
    var cleanedCorrect = cleanAnswer(currentQuestion.answer);

    var isCorrect = (
        cleanedPlayer == cleanedCorrect ||
        cleanedPlayer.split(/\s+/).every(function(word) {
            return cleanedCorrect.split(/\s+/).includes(word);
        })
    );
    
    var resultText = document.createElement('div');
    resultText.classList.add('resultText');
    
    if (isCorrect) {
        resultText.textContent = 'Correct!';
        resultText.classList.add('correct');
        currentScore += currentQuestion.value;
        
        currentQuestion.element.classList.add('answered', 'correct');
        currentQuestion.element.textContent = '';
    } else {
        resultText.textContent = 'Incorrect!';
        resultText.classList.add('incorrect');
        currentScore -= currentQuestion.value;

        currentQuestion.element.classList.add('answered', 'incorrect');
        currentQuestion.element.textContent = '';
    }
    
    var scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `Score: ${currentScore}`;
    
    var continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.classList.add('continueButton');
    continueButton.addEventListener('click', () => {
        resultScreen.remove();
        
        if (answeredQuestions.length == foodCategories.length * 5) {
            showGameOverScreen();
        }
    });

    resultContent.appendChild(resultText);
    resultContent.appendChild(correctAnswer);
    resultContent.appendChild(continueButton);
    resultScreen.appendChild(resultContent);
    
    document.body.appendChild(resultScreen);
}

function showGameOverScreen() {
    var gameOverScreen = document.createElement('div');
    gameOverScreen.classList.add('gameOverScreen');
    
    var gameOverContent = document.createElement('div');
    gameOverContent.classList.add('gameOverContent');
    
    var gameOverTitle = document.createElement('div');
    gameOverTitle.classList.add('gameOverTitle');
    gameOverTitle.textContent = 'Game Over!';
    
    var finalScore = document.createElement('div');
    finalScore.classList.add('finalScore');
    finalScore.textContent = `Final Score: ${currentScore}`;
    
    var messageElement = document.createElement('div');
    messageElement.classList.add('gameOverMessage');
    
    if (currentScore >= 3000) {
        messageElement.textContent = "Amazing! You're a food expert!";
    } else if (currentScore >= 1500) {
        messageElement.textContent = 'Great job! You know your food!';
    } else if (currentScore >= 0) {
        messageElement.textContent = 'Not bad! Keep improving!';
    } else {
        messageElement.textContent = 'Better luck next time!';
    }
    
    var playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.classList.add('playAgainButton');
    playAgainButton.addEventListener('click', () => {
        gameOverScreen.remove();
        resetGame();
    });
    
    gameOverContent.appendChild(gameOverTitle);
    gameOverContent.appendChild(finalScore);
    gameOverContent.appendChild(messageElement);
    gameOverContent.appendChild(playAgainButton);
    gameOverScreen.appendChild(gameOverContent);
    
    document.body.appendChild(gameOverScreen);
}

function resetGame() {
    currentScore = 0;
    answeredQuestions = [];
    currentQuestion = null;
    
    var existingScoreDisplay = document.getElementById('scoreDisplay');
    existingScoreDisplay.remove();
    
    startJeopardyGame();
}

function cleanAnswer(answer) {
    return answer
        .toLowerCase()
        .replace(/what is |what are |who is |who are |where is |where are |when is |when are |why is |why are |how is |how are |define |explain |a |an |the |is |was |were |are |do |does |did |can |could |should |would |will |shall |may |might |must /g, '')
        .replace(/\?/g, '')
        .trim();
}

function filterReviews(btn, category) {
	var reviewSections = document.querySelectorAll('.reviewSection');
	var reviewButtons = document.querySelectorAll('.reviewCategoryBtn');

	reviewButtons.forEach(btn => {
		btn.classList.remove('active');
	});

	btn.classList.add('active');

	if (category == "all"){
		reviewSections.forEach( section => {
			section.style.display = 'block';
		});
	} else {
		reviewSections.forEach ( section => {
			if (section.id == category){
				section.style.display = 'block';
			} else{
				section.style.display = 'none';
			}
		});
	}
}

function reviewBtnListeners(){
	var reviewButtons = document.querySelectorAll('.reviewCategoryBtn');

	for (var i = 0; i < reviewButtons.length; i++){
		(function(btn) {
			btn.addEventListener("click", function() {
				filterReviews(btn, btn.id);
			});
		})(reviewButtons[i]);
	}
}

function recipeNumListeners(container) {
    var stepNumbersInRecipe = container.querySelectorAll('.stepNumber');
    var recipeProgressBarInRecipe = container.querySelector('.recipeProgressBar');

    for (var i = 0; i < stepNumbersInRecipe.length; i++) {
        (function(number, stepNum) {
            number.addEventListener("click", function() {
                var activeStepDivInRecipe = container.querySelector('.stepActive');
                var activeStepNumberInRecipe = parseInt(activeStepDivInRecipe.querySelector('.stepNumber').textContent);
                var numberClickedInRecipe = parseInt(number.textContent);

                if (numberClickedInRecipe == activeStepNumberInRecipe) {
                    var stepsLeftInRecipe = stepNumbersInRecipe.length - stepNum;

                    activeStepDivInRecipe.classList.remove('stepActive');
                    activeStepDivInRecipe.classList.add('stepCompleted');

                    recipeProgressBarInRecipe.style.width = ((stepNum / stepNumbersInRecipe.length) * 100) + '%';


                    if (stepsLeftInRecipe > 0) {
                        var nextStepDivInRecipe = activeStepDivInRecipe.nextElementSibling;
                        if (nextStepDivInRecipe && nextStepDivInRecipe.classList.contains('step')) {
                            nextStepDivInRecipe.classList.remove('step');
                            nextStepDivInRecipe.classList.add('stepActive');
                        }
                    }
                }
            });
        })(stepNumbersInRecipe[i], i + 1);
    }
}

function filterRecipes(){
    var searchTerm = document.getElementById('recipeSearchBar').value.toLowerCase();
    var recipeWrappers = document.querySelectorAll('.recipeWrapper');

    recipeWrappers.forEach(wrapper => {
        var recipeName = wrapper.querySelector('.recipeHeading').textContent.toLowerCase();
        var ingredientsList = wrapper.querySelector('.ingredients ul');
        var ingredientsText = '';
        var howHard = wrapper.querySelector('.difficulty').textContent.toLocaleLowerCase();

        ingredientsList.querySelectorAll('li').forEach(li => {
            ingredientsText += li.textContent.toLowerCase() + ' ';
        });

        if (recipeName.includes(searchTerm) || ingredientsText.includes(searchTerm) || howHard.includes(searchTerm)){
            wrapper.style.display = '';
        } else {
            wrapper.style.display = 'none';
        }
    });
}

function displayRecipe(meal){
    var recipesHostContainer = document.getElementById('recipesHostContainer');
    var ingredientsCount = 0;

    var ingredientsHTML = '';
    for (var i = 1; i <= 20; i++) {
        var ingredient = meal[`strIngredient${i}`];
        var measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredientsHTML += `<li>${measure ? measure.trim() : ''} ${ingredient.trim()}</li>`;
            ingredientsCount++;
        } else {
            break;
        }
    }

    var stepsHTML = '';
    var instructions = meal.strInstructions;
    var instructionSteps = instructions.split('\n').map(function(step) {
        step = step.trim();

        step = step.replace(/step/gi, '');

        step = step.replace(/\d+\./g, '');

        return step.trim();
    }).filter(function(step) {
        return step.length >= 5;
    });


    var stepsCount = instructionSteps.length;
    var difficultyRating = stepsCount + ingredientsCount;
    var difficultyColor;
    var mealDifficulty;

    if (difficultyRating > 20){
        difficultyColor = "red";
        mealDifficulty = "Hard"
    } else if (difficultyRating > 10){
        difficultyColor = "orange"
        mealDifficulty = "Medium"
    } else {
        difficultyColor = "limegreen"
        mealDifficulty = "Easy"
    }

    instructionSteps.forEach((stepText, index) => {
        var stepClass = (index == 0) ? 'stepActive' : 'step';
        stepsHTML += `
            <div class="${stepClass}">
                <div class="stepNumber">${index + 1}</div>
                <div class="stepText">${stepText.trim()}</div>
            </div>
        `;
    });
    
    var recipeWrapper = document.createElement('div');
    recipeWrapper.classList.add('recipeWrapper');

    recipeWrapper.innerHTML = `
        <p class="recipeHeading">${meal.strMeal}</p>
        <p class="recipeDifficulty">Difficulty: <span style="color: ${difficultyColor}" class="difficulty">${mealDifficulty}</span></p>
        <div class="picAndIngredients">
            <div class="recipePictures">
                <img src="${meal.strMealThumb}" class="recipeImage" alt="${meal.strMeal}">
            </div>
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredientsHTML}
                </ul>
            </div>
        </div>
        <div class="interactiveSteps">
            <h3 style="text-align: center">Follow Along Recipe Steps</h3>
            <div class="recipeProgressContainer">
                <div class="recipeProgressBar" style="width: 0%;"></div>
            </div>
            ${stepsHTML}
        </div>
        <br>
        <br>
    `;

    recipesHostContainer.appendChild(recipeWrapper);

    var currentRecipeInteractiveSteps = recipeWrapper.querySelector('.interactiveSteps');
    recipeNumListeners(currentRecipeInteractiveSteps);
}

function rain(){
	if (isPlaying[0] == 0){
		rainAudio.play();
		isPlaying[0] = 1;
		document.getElementById('rainButton').value = 'Pause Rain!'; // changes button text
	} else{
		rainAudio.pause();
		isPlaying[0] = 0;
		document.getElementById('rainButton').value = 'Play Rain!';
	}
}

function cafe(){
	if (isPlaying[1] == 0){
		cafeAudio.play();
		isPlaying[1] = 1;
		document.getElementById('cafeButton').value = 'Pause Cafe!';
	} else{
		cafeAudio.pause();
		isPlaying[1] = 0;
		document.getElementById('cafeButton').value = 'Play Cafe!';
	}
}

function lofi(){
	if (isPlaying[2] == 0){
		lofiAudio.play();
		isPlaying[2] = 1;
		document.getElementById('lofiButton').value = "Pause Lofi!";
	} else{
		lofiAudio.pause();
		isPlaying[2] = 0;
		document.getElementById('lofiButton').value = "Play Lofi!";
	}
}

function toggleTheme() {
    var theme = document.body.getAttribute("data-theme") == "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

window.onload = function(){
	currentPage = window.location.pathname;

    var savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
	
	if (currentPage.endsWith("index.html")){
		rainAudio = document.getElementById("rainMusic"); // document.getElementById allows you to access an element based on its id
		cafeAudio = document.getElementById("cafeMusic");
		lofiAudio = document.getElementById("lofiMusic");

		lofiButton = document.getElementById("lofiButton");
		cafeButton = document.getElementById("cafeButton");
		rainButton = document.getElementById("rainButton");

		lofiButton.addEventListener("click", function(){
			lofi();
		});

		cafeButton.addEventListener("click", function(){
			cafe();
		});

		rainButton.addEventListener("click", function(){
			rain();
		});
	} else if (currentPage.endsWith("recipes.html")){
		var recipesHost = document.createElement('div');
        recipesHost.id = 'recipesHostContainer'
        document.body.appendChild(recipesHost);

		var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
		alphabet.forEach(letter => {
			fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
				.then(response => response.json())
				.then(data => {
					if (data.meals) {
						data.meals.forEach(meal => {
                            displayRecipe(meal);
						});
					}
				});
		});

        var searchInput = document.getElementById('recipeSearchBar');
        searchInput.addEventListener('input', filterRecipes);
	} else if (currentPage.endsWith("Reviews.html")){
		reviewBtnListeners();
	} else if (currentPage.endsWith("games.html")){
		startJeopardyGame();
	}
}

while (lockStatus == 1) {
	input = prompt("Password?", ""); // Initiates a pop up asking for a password and stores input in "input" variable

	if (input == null || input.trim() == "") { // checks if there is no input or input has nothing in it not including spaces
		alert("Please enter a password."); // initiates a popup telling the user they need to enter a password
	} else if (input.toLowerCase() == password.toLowerCase()) { // checks if input matches password, converts to lowercase so password should not be case sensitive
		alert("Access granted.");
		break;
	} else {
		alert("Incorrect password. Try again.");
	}
}