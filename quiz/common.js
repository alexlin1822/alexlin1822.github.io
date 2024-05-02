let quizItems = [];
let currentIndex = 0;

function getQuizItemCount() {
  return quizItems.length;
}

function getCurrentIndex() {
  return currentIndex;
}

function setQuizItems(items) {
  quizItems = items;
}

function getQuizItem(index) {
  currentIndex = index;
  return quizItems[currentIndex];
}

function getNextQuizItem() {
  return getQuizItem(++currentIndex);
}

function getPreviousQuizItem() {
  return getQuizItem(--currentIndex);
}
