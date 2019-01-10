$(document).ready(function() {
    var queryUrl = 'https://opentdb.com/api.php?amount=8&category=11&type=multiple';

    var triviaQuestions = [];
    var answerArray = [];

    var questionCounter = 0;
    var timeLeft = 30;

    // Using API to obtain 8 random questions with correct and incorrect answers
    $.ajax(queryUrl).then(function(response) {
        console.log(response.results);
        setQuestionAndAnsers(response.results);
    });

    function setQuestionAndAnsers(questionnaire) {
        // get array and retrieve data for each question. counter wil tell what question number we are on

        // initialize array of answers
        answerArray = questionnaire[questionCounter].incorrect_answers;
        answerArray.push(questionnaire[questionCounter].correct_answer);


        // decodes any string in order to show the correct text
        jQuery('#question').html(questionnaire[questionCounter].question).text();

        // creates copy of answer array
        var copyArray = [];
        for (var i = 0; i < answerArray.length; i++) {
            copyArray.push(answerArray[i]);
        }

        // sorts through answerArray and assign each answer randomly
        for (i = 0; i < answerArray.length; i++) {
            // select random number
            var index = Math.floor(Math.random() * copyArray.length);
            // get random answer
            var randomAnswer = copyArray[index];
            // remove answer from copied array to obtain only once the answer in order to set it in html
            copyArray.splice(index, 1);
            // set the randomly selected answer to a given button depending on the current i value
            switch (i) {
                case 0:
                    $('#anwserOne').text(randomAnswer);
                    break;
                case 1:
                    $('#anwserTwo').text(randomAnswer);
                    break;
                case 2:
                    $('#anwserThree').text(randomAnswer);
                    break;
                case 3:
                    $('#anwserFour').text(randomAnswer);
                    break;

                default:
                    break;
            }
        }
        $('#countDown').text('Remaining Time: ' + timeLeft);
        startCounter();
    }

    var startCounter = setInterval(function() {
        --timeLeft;
        $('#countDown').text('Remaining Time: ' + timeLeft);

        if (timeLeft <= 0) {
            console.log('reached 0');
            clearInterval(startCounter);
        }
    }, 1000);
});