var STORAGE_KEY = "memoryVerseName";
var MAX_NAME_LENGTH = 30;

var BUILT_IN_REFERENCE = "Psalm 119:11";
var BUILT_IN_VERSE =
  "I have hidden your word in my heart, that I might not sin against you.";

var nameScreen = document.getElementById("name-screen");
var nameFormSection = document.getElementById("name-form");
var welcomeForm = document.getElementById("welcome-form");
var nameInput = document.getElementById("name-input");
var practiceFlow = document.getElementById("practice-flow");
var welcomeName = document.getElementById("welcome-name");
var verseReference = document.getElementById("verse-reference");
var verseText = document.getElementById("verse-text");
var practiceInput = document.getElementById("practice-input");
var congratulations = document.getElementById("congratulations");

function getSavedName() {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return "";
  }
  return saved.trim().slice(0, MAX_NAME_LENGTH);
}

function saveName(name) {
  localStorage.setItem(STORAGE_KEY, name);
}

function showNameForm() {
  practiceFlow.hidden = true;
  nameScreen.hidden = false;
  nameFormSection.hidden = false;
  nameInput.focus();
}

function showPractice(name) {
  welcomeName.textContent = name;
  verseReference.textContent = BUILT_IN_REFERENCE;
  verseText.textContent = BUILT_IN_VERSE;
  practiceInput.value = "";
  congratulations.hidden = true;

  nameScreen.hidden = true;
  practiceFlow.hidden = false;
  practiceFlow.scrollTop = 0;
}

function checkPracticeInput() {
  var correct = isVerseCorrect(practiceInput.value, BUILT_IN_VERSE);

  if (!correct) {
    congratulations.hidden = true;
    return;
  }

  // Dismiss the phone keyboard so congratulations is not covered.
  practiceInput.blur();
  congratulations.hidden = false;
  setTimeout(function () {
    congratulations.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 150);
}

function start() {
  var name = getSavedName();
  if (name) {
    showPractice(name);
  } else {
    showNameForm();
  }
}

welcomeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = nameInput.value.trim().slice(0, MAX_NAME_LENGTH);
  if (!name) {
    nameInput.focus();
    return;
  }

  saveName(name);
  showPractice(name);
});

practiceInput.addEventListener("input", checkPracticeInput);

start();
