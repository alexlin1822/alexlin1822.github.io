// Function to fetch the quiz content from the text file
async function fetchQuizContent() {
  const response = await fetch("questions.txt");
  const data = await response.text();

  const question_block = data.trim().split("**[]**");
  const parsedQuestions = [];

  for (const question_block_element of question_block) {
    let j = 0;
    const lines = question_block_element.trim().split("\n");

    let question = "";
    let answers = [];
    let correctAnswerIndex = [];

    for (const element of lines) {
      if (element.trim() === "") {
        continue;
      } else if (element.startsWith("### ")) {
        question = element.substring(4).trim();
      } else if (element.startsWith("- [")) {
        // answers.push(j + 1 + ".  " + element.substring(6).trim());
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

  return parsedQuestions;
}

// Function to render the quiz
function renderQuiz(quizItems, currentIndex) {
  const quizContainer = document.getElementById("quiz");
  const nextButton = document.getElementById("nextButton");
  const previousButton = document.getElementById("previousButton");
  const showAnswerButton = document.getElementById("showAnswerButton");
  const hideAnswerButton = document.getElementById("hideAnswerButton");
  const goToQuestionButton = document.getElementById("goToQuestionButton");
  const questionInput = document.getElementById("questionInput");

  const { question, answers, correctAnswerIndex } = quizItems[currentIndex];
  const answerLabel = document.getElementById("answerLabel");

  quizContainer.innerHTML = `<h5>${currentIndex + 1} -  ${question}</h5>`;

  answerLabel.innerHTML =
    "Answer:" + correctAnswerIndex.map((num) => " [" + (num + 1) + "] ");
  questionInput.value = currentIndex + 1;

  const answersList = document.createElement("ol");

  answers.forEach((answer, index) => {
    const answerItem = document.createElement("li");
    console.log("Answer: ", answer);
    answerItem.textContent = answer;

    answerItem.addEventListener("click", () => {
      const answerItems = answersList.getElementsByTagName("li");
      for (const element of answerItems) {
        element.classList.remove("correct", "incorrect");
      }
      answerItem.classList.add(
        correctAnswerIndex.indexOf(index) != -1 ? "correct" : "incorrect"
      );
      // nextButton.disabled = false;
    });
    answersList.appendChild(answerItem);
  });

  quizContainer.appendChild(answersList);

  nextButton.addEventListener("click", () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < quizItems.length) {
      renderQuiz(quizItems, nextIndex);
    } else {
      quizContainer.innerHTML = "<h2>Quiz completed!</h2>";
      // nextButton.disabled = true;
    }
  });

  previousButton.addEventListener("click", () => {
    const preIndex = currentIndex - 1;
    if (preIndex < quizItems.length) {
      renderQuiz(quizItems, preIndex);
    } else {
      quizContainer.innerHTML = "<h2>Quiz completed!</h2>";
    }
  });

  // nextButton.disabled = true;

  showAnswerButton.addEventListener("click", () => {
    answerLabel.style.display = "block";
  });

  hideAnswerButton.addEventListener("click", () => {
    answerLabel.style.display = "none";
  });

  goToQuestionButton.addEventListener("click", () => {
    const questionIndex = parseInt(questionInput.value, 10) - 1;
    if (questionIndex >= 0 && questionIndex < quizItems.length) {
      renderQuiz(quizItems, questionIndex);
    } else {
      alert("Invalid question number");
    }
  });
}

// Fetch the quiz content and render the first quiz item
fetchQuizContent()
  .then((quizItems) => {
    renderQuiz(quizItems, 0);
  })
  .catch((error) => console.error("Failed to fetch quiz content:", error));
