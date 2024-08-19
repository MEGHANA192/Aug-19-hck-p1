let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeElapsed = 0;
let selectedAnswer = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.txt')
        .then(response => response.text())
        .then(data => {
            questions = parseQuestions(data);
            questions = getRandomQuestions(questions, 10);
            document.getElementById('start-btn').style.display = 'block';
        });

    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
});

function startQuiz() {
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showQuestion();
}

function parseQuestions(text) {
    return text.trim().split('\n').map(line => {
        const [question, correctAnswer, ...choices] = line.split(';');
        // Ensure only 4 unique options are selected
        const uniqueChoices = [...new Set([correctAnswer, ...choices])].slice(0, 4);
        return {
            question,
            choices: uniqueChoices,
            correctAnswer
        };
    });
}

function getRandomQuestions(questions, num) {
    return questions.sort(() => 0.5 - Math.random()).slice(0, num);
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    question.choices.forEach(choice => {
        const optionButton = document.createElement('button');
        optionButton.innerText = choice;
        optionButton.onclick = () => selectOption(optionButton, choice);
        optionsContainer.appendChild(optionButton);
    });

    document.getElementById('next-btn').style.display = 'none';

    startTimer();
}

function selectOption(button, choice) {
    selectedAnswer = choice;
    document.querySelectorAll('#options button').forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === questions[currentQuestionIndex].correctAnswer) {
            btn.style.backgroundColor = 'green';
        } else {
            btn.style.backgroundColor = 'red';
        }
    });

    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        score++;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('next-btn').style.display = 'block';
    clearInterval(timer);
}

function nextQuestion() {
    currentQuestionIndex++;
    selectedAnswer = null;
    showQuestion();
}

function startTimer() {
    timeElapsed = 0;
    document.getElementById('timer').innerText = 'Time: 0s';
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').innerText = `Time: ${timeElapsed}s`;
    }, 1000);
}

function endQuiz() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('final-score').innerText = `Congratulations! Your score is ${score} out of ${questions.length}`;
    document.getElementById('final-score').style.display = 'block';
}
