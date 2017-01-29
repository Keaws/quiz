//use http if you are running this locally
const questionAPI = 'http://jservice.io/api/random';
let currentQuestion;
let parsedAnswer;

let score = 0;
let totalQuestionsCount = 0;
const correctAnswersEl = document.querySelector('.correct-answers');
const totalQuestionsEl = document.querySelector('.total-questions');

const lettersContainer = document.querySelector('.letters');
const answerContainer = document.querySelector('.answer-block');
const answerStatusEl = document.querySelector('.answer-status');
const button = document.querySelector('.btn');

const categoryEl = document.querySelector('.q-category');
const questionEl = document.querySelector('.q-question');

let correctAnswersCount = 0;

function getQuestion() {
  fetch(questionAPI)
    .then(response => response.json())
    .catch(e => console.log(e))
    .then(data => {
      //sometimes the question field is empty
      if (!data[0].question) {
        getQuestion();
        return;
      }
      currentQuestion = data[0];
      parseAnswer();
      updateView();
      logAnswer();
    });
}

function parseAnswer() {
  currentQuestion.answer = currentQuestion.answer
    .replace(/<i>/g, '')
    .replace(/<\/i>/g, '')
    .replace(/\\/g, '')
    .replace(/"/g, '')
    .replace(/\(.*\)/g, '')
    .replace(/  /g, ' ')
    .replace(/\/.*/g, '')
    .trim();
}

function updateView() {
  questionEl.textContent = currentQuestion.question;
  categoryEl.textContent = `(category: ${currentQuestion.category.title})`;

  correctAnswersCount = 0;
  totalQuestionsCount++;

  clearStatus();
  makeButtonSkip();
  showScores();
  clearLetters();
  showLetters();
}

function showScores() {
  correctAnswersEl.innerText = `Correct Answers: ${score}`;
  totalQuestionsEl.innerText = `Total Questions: ${totalQuestionsCount}`;
}

function clearStatus() {
    answerContainer.classList.remove('green-border');
    answerContainer.classList.remove('red-border');

    answerStatusEl.classList.remove('red-text');
    answerStatusEl.classList.remove('green-text');
    answerStatusEl.innerHTML = '';
}

function logAnswer() {
  console.log(currentQuestion.answer);
}

function showLetters () {
  const shuffledAnswer = getShuffledAnswer()

  for (let char of shuffledAnswer) {
    const button = document.createElement('a');
    button.classList.add('waves-effect', 'waves-grey', 'btn-flat', 'letter');
    const letter = document.createTextNode(char);
    button.appendChild(letter);
    button.addEventListener('click', moveLetterToAnswer, { once: true });
    lettersContainer.appendChild(button);
  }
}

function getShuffledAnswer() {
  return currentQuestion.answer.split('').sort(() => 0.5 - Math.random()).join('');
}

function moveLetterToAnswer(e) {
  const targetLetter = e.target;

  answerContainer.appendChild(targetLetter);
  targetLetter.addEventListener('click', moveLetterFromAnswer, { once: true });

  checkAnswer();
}

function checkAnswer() {
  if (lettersContainer.hasChildNodes()) {
    return;
  }

  let userAnswer = '';

  for (let child of answerContainer.children) {
    child.innerText ? userAnswer += child.innerText : userAnswer += ' ';
  }

  if (isAnswerCorrect(userAnswer)) {
    answerContainer.classList.add('green-border');

    answerStatusEl.innerHTML = '<i class="small material-icons">thumb_up</i> Correct!';
    answerStatusEl.classList.remove('red-text');
    answerStatusEl.classList.add('green-text');

    makeButtonNext();

    correctAnswersCount++;

    if (correctAnswersCount === 1) {
      score++;
      showScores();
    }
  } else {
    answerContainer.classList.add('red-border');

    answerStatusEl.innerHTML = '<i class="small material-icons">error_outline</i> Wrong!';
    answerStatusEl.classList.remove('green-text');
    answerStatusEl.classList.add('red-text');
  }
}

function isAnswerCorrect(userAnswer) {
  return userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
}

function makeButtonNext() {
  button.innerText = 'NEXT';
  button.classList.remove('blue');
  button.classList.add('green');
}

function makeButtonSkip() {
    button.innerText = 'SKIP';
    button.classList.remove('green');
    button.classList.add('blue');
}

function moveLetterFromAnswer(e) {
  const targetLetter = e.target;

  lettersContainer.appendChild(targetLetter);
  targetLetter.addEventListener('click', moveLetterToAnswer, { once: true });

  clearStatus();
  makeButtonSkip();
}

function clearLetters() {
  while (lettersContainer.firstChild) {
    lettersContainer.removeChild(lettersContainer.firstChild);
  }

  while (answerContainer.firstChild) {
    answerContainer.removeChild(answerContainer.firstChild);
  }
}

getQuestion();
