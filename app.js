var STORAGE_KEY = "memoryVerseName";
var MAX_NAME_LENGTH = 30;

var nameFormSection = document.getElementById("name-form");
var welcomeSection = document.getElementById("welcome");
var welcomeName = document.getElementById("welcome-name");
var welcomeForm = document.getElementById("welcome-form");
var nameInput = document.getElementById("name-input");

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

function showWelcome(name) {
  welcomeName.textContent = name;
  nameFormSection.hidden = true;
  welcomeSection.hidden = false;
}

function showNameForm() {
  welcomeSection.hidden = true;
  nameFormSection.hidden = false;
  nameInput.focus();
}

function start() {
  var name = getSavedName();
  if (name) {
    showWelcome(name);
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
  showWelcome(name);
});

start();
