$(document).ready(function() {
    var queryUrl = 'https://opentdb.com/api.php?amount=8&category=11&type=multiple';

    var startCounter;
    var triviaQuestions = [];
    var answerArray = [];
    var correctResponse = '';

    var questionCounter = 0;
    var timeLeft = 30;

    var extraText = $('#extraInfo');
    var correctAnswerText = $('#correctAnswerText');

    var totalCorrect = 0;
    var totalIncorrect = 0;
    var totalUnsolved = 0;

    // Using API to obtain 8 random questions with correct and incorrect answers
    var retrieveTrivia = function() {
        $('#startOver').hide();

        $.ajax(queryUrl).then(function(response) {
            console.log(response.results);
            triviaQuestions = response.results;
            setQuestionAndAnsers(response.results);
        });
    };

    retrieveTrivia();

    $('#startOver').click(function() {
        resetValues();
        retrieveTrivia();
    });

    function setQuestionAndAnsers(questionnaire) {
        extraText.text('');
        correctAnswerText.text('');

        // get array and retrieve data for each question. counter wil tell what question number we are on
        correctResponse = questionnaire[questionCounter].correct_answer;

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
                    jQuery('#anwserOne').html(randomAnswer).text();
                    break;
                case 1:
                    jQuery('#anwserTwo').html(randomAnswer).text();
                    break;
                case 2:
                    jQuery('#anwserThree').html(randomAnswer).text();
                    break;
                case 3:
                    jQuery('#anwserFour').html(randomAnswer).text();
                    break;

                default:
                    break;
            }
        }
        $('#countDown').text('Remaining Time: ' + timeLeft);
        startCounter = setInterval(function() {
            --timeLeft;
            $('#countDown').text('Remaining Time: ' + timeLeft);

            if (timeLeft <= 0) {
                showAnswer('');
                clearInterval(startCounter);
            }
        }, 1000);
    }

    $('#anwserOne').click(function() {
        showAnswer($('#anwserOne').html());
    });

    $('#anwserTwo').click(function() {
        showAnswer($('#anwserTwo').html());
    });

    $('#anwserThree').click(function() {
        showAnswer($('#anwserThree').html());
    });

    $('#anwserFour').click(function() {
        showAnswer($('#anwserFour').html());
    });

    function showAnswer(userResponse) {
        // if timer ran out
        if (timeLeft === 0 && userResponse === '') {
            extraText.text('uhhhh, what happened? you ran out of time.');
            jQuery(correctAnswerText).html('The correct answer was ' + correctResponse).text();
            totalUnsolved++;
        }

        // if answer is correct it wil show Correct. if not it will show the correct answer
        if (userResponse === correctResponse) {
            extraText.text('CORRECT!');
            extraText.css('color', 'green');
            correctAnswerText.text('');
            totalCorrect++;
        } else {
            extraText.text('NOPE!');
            extraText.css('color', 'red');
            jQuery(correctAnswerText).html('The correct answer was ' + correctResponse).text();
            totalIncorrect++;
        }

        questionCounter++;

        if (questionCounter < triviaQuestions.length) {
            clearInterval(startCounter);

            setTimeout(function() {
                timeLeft = 30;
                $('#countDown').text('Remaining Time: ' + timeLeft);
                setQuestionAndAnsers(triviaQuestions);
            }, 3000);
        } else {
            clearInterval(startCounter);

            setTimeout(function() {
                lastPage();
            }, 3000);
        }
    }

    function lastPage() {
        $('#question').hide();
        $('#anwserOne').hide();
        $('#anwserTwo').hide();
        $('#anwserThree').hide();
        $('#anwserFour').hide();

        extraText.text('');
        correctAnswerText.text('');

        $('#anwsCorrect').text('Correct Answers: ' + totalCorrect);
        $('#anwsCorrect').css('color', 'green');
        $('#inCorrect').text('Incorrect Answers: ' + totalIncorrect);
        $('#inCorrect').css('color', 'red');
        $('#unSolved').text('Unsolved Answers: ' + totalUnsolved);

        $('#startOver').show();
    }

    function resetValues() {
        $('#question').show();
        $('#anwserOne').show();
        $('#anwserTwo').show();
        $('#anwserThree').show();
        $('#anwserFour').show();

        $('#anwsCorrect').text('');
        $('#inCorrect').text('');
        $('#unSolved').text('');

        questionCounter = 0;
        totalCorrect = 0;
        totalIncorrect = 0;
        totalUnsolved = 0;

        $('#startOver').hide();
    }
});