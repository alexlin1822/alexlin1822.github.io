// Function to fetch the quiz content from the text file
async function fetchQuizContent() {
  let response = await fetch("questions.txt");
  let data = await response.text();

  let question_block = data.trim().split("**[]**");
  let parsedQuestions = [];

  for (let question_block_element of question_block) {
    let j = 0;
    let lines = question_block_element.trim().split("\n");

    let question = "";
    let answers = [];
    let correctAnswerIndex = [];

    for (let element of lines) {
      if (element.trim() === "") {
        continue;
      } else if (element.startsWith("### ")) {
        question = element.substring(4).trim();
      } else if (element.startsWith("- [")) {
        answers.push(element.substring(6).trim());
        if (element.startsWith("- [x] ")) {
          correctAnswerIndex.push(j);
        }
        j++;
      }
    }

    parsedQuestions.push({
      question,
      answers,
      correctAnswerIndex
    });
  }
  parsedQuestions.pop();

  return parsedQuestions;
}

/* Event listeners */
// Update font size on range input change
function questionInput_onChange(value) {
  let content = document.getElementById("quiz");
  content.style.fontSize = `${value}px`;
  fontSizeValue.textContent = value;
}

function nextButton_OnClick() {
  if (getCurrentIndex() + 1 < getQuizItemCount()) {
    renderQuiz(getNextQuizItem());
  }
}

function previousButton_OnClick() {
  if (getCurrentIndex() - 1 >= 0) {
    renderQuiz(getPreviousQuizItem());
  }
}

function showAnswerButton_OnClick() {
  answerLabel.style.display = "block";
}
function hideAnswerButton_OnClick() {
  answerLabel.style.display = "none";
}

function goToQuestionButton_OnClick() {
  let questionIndex = parseInt(questionInput.value, 10) - 1;
  if (getQuizItemCount() >= 0 && questionIndex < getQuizItemCount()) {
    renderQuiz(getQuizItem(questionIndex));
  } else {
    alert("Invalid question number");
  }
}

// Function to render the quiz
function renderQuiz(quizItem) {
  let { question, answers, correctAnswerIndex } = quizItem;

  let quizContainer = document.getElementById("quiz");
  let questionInput = document.getElementById("questionInput");

  let answerLabel = document.getElementById("answerLabel");

  let fontSizeRange = document.getElementById("fontSizeRange");
  let fontSizeValue = document.getElementById("fontSizeValue");

  quizContainer.style.fontSize = `${fontSizeRange.value}px`;
  fontSizeValue.textContent = fontSizeRange.value;

  quizContainer.innerHTML = `<br><label style="font-weight:bold">${
    getCurrentIndex() + 1
  } -  ${question}<label>`;

  answerLabel.innerHTML =
    "Answer:" + correctAnswerIndex.map((num) => " [" + (num + 1) + "] ");
  questionInput.value = currentIndex + 1;

  let answersList = document.createElement("ol");

  answers.forEach((answer, index) => {
    let answerItem = document.createElement("li");
    answerItem.textContent = answer;
    answerItem.style = "margin: 10px";

    answerItem.addEventListener("click", () => {
      let answerItems = answersList.getElementsByTagName("li");
      for (let element of answerItems) {
        element.classList.remove("correct", "incorrect");
      }
      answerItem.classList.add(
        correctAnswerIndex.indexOf(index) != -1 ? "correct" : "incorrect"
      );
    });
    answersList.appendChild(answerItem);
  });

  quizContainer.appendChild(answersList);
}

// Fetch the quiz content and render the first quiz item
fetchQuizContent().then((parsedQuestions) => {
  setQuizItems(parsedQuestions);
  renderQuiz(getQuizItem(0));
  let questionNumber = document.getElementById("questionNumber");

  questionNumber.textContent =
    "Question: [1 - " + getQuizItemCount() + "] Go to   ";
});
