var STORAGE_KEY = "memoryVerseName";
var VERSE_CACHE_PREFIX = "memoryVerseText:";
var MAX_NAME_LENGTH = 30;
var LOAD_TIMEOUT_MS = 10000;

var BUILT_IN_REFERENCE = "Psalm 119:11";
var BUILT_IN_VERSE =
  "I have hidden your word in my heart, that I might not sin against you.";

var currentReference = BUILT_IN_REFERENCE;
var currentVerseText = BUILT_IN_VERSE;

var nameScreen = document.getElementById("name-screen");
var nameFormSection = document.getElementById("name-form");
var welcomeForm = document.getElementById("welcome-form");
var nameInput = document.getElementById("name-input");
var practiceFlow = document.getElementById("practice-flow");
var welcomeName = document.getElementById("welcome-name");
var bookSelect = document.getElementById("book-select");
var chapterSelect = document.getElementById("chapter-select");
var verseSelect = document.getElementById("verse-select");
var loadVerseButton = document.getElementById("load-verse");
var loadMessage = document.getElementById("load-message");
var verseReference = document.getElementById("verse-reference");
var verseText = document.getElementById("verse-text");
var peekVerse = document.getElementById("peek-verse");
var practiceInput = document.getElementById("practice-input");
var submitPractice = document.getElementById("submit-practice");
var encouragement = document.getElementById("encouragement");
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

function verseCacheKey(reference) {
  return VERSE_CACHE_PREFIX + reference;
}

function getCachedVerseText(reference) {
  return localStorage.getItem(verseCacheKey(reference)) || "";
}

function saveCachedVerseText(reference, text) {
  localStorage.setItem(verseCacheKey(reference), text);
}

function formatReference(bookName, chapter, verse) {
  return bookName + " " + chapter + ":" + verse;
}

function fillNumberOptions(select, count) {
  select.innerHTML = "";
  for (var i = 1; i <= count; i++) {
    var option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    select.appendChild(option);
  }
}

function fillBookOptions() {
  bookSelect.innerHTML = "";
  for (var i = 0; i < BIBLE_BOOKS.length; i++) {
    var option = document.createElement("option");
    option.value = BIBLE_BOOKS[i].name;
    option.textContent = BIBLE_BOOKS[i].name;
    bookSelect.appendChild(option);
  }
}

function onBookChange() {
  var book = findBibleBook(bookSelect.value);
  var chapterCount = book ? book.chapters.length : 0;
  fillNumberOptions(chapterSelect, chapterCount);
  onChapterChange();
}

function onChapterChange() {
  var chapter = parseInt(chapterSelect.value, 10) || 1;
  var verseCount = versesInChapter(bookSelect.value, chapter);
  fillNumberOptions(verseSelect, verseCount);
}

function setPickerToReference(bookName, chapter, verse) {
  bookSelect.value = bookName;
  onBookChange();
  chapterSelect.value = String(chapter);
  onChapterChange();
  verseSelect.value = String(verse);
}

function showNameForm() {
  practiceFlow.hidden = true;
  nameScreen.hidden = false;
  nameFormSection.hidden = false;
  nameInput.focus();
}

function showVerse() {
  verseText.hidden = false;
  peekVerse.hidden = true;
}

function hideVerseForTyping() {
  verseText.hidden = true;
  peekVerse.hidden = false;
}

function updateVerseVisibility() {
  if (practiceInput.value.length > 0) {
    hideVerseForTyping();
  } else {
    showVerse();
  }
}

function hideLoadMessage() {
  loadMessage.hidden = true;
  loadMessage.textContent = "";
}

function showLoadMessage() {
  var name = getSavedName() || welcomeName.textContent || "friend";
  loadMessage.textContent =
    "Sorry, " +
    name +
    ". I couldn’t get that verse to show you.\n" +
    "Try again, and check that you’re still connected to the internet.\n" +
    "If it still doesn’t work, it’s something on my end. Try again later.";
  loadMessage.hidden = false;
}

function setCurrentVerse(reference, text) {
  currentReference = reference;
  currentVerseText = text;
  verseReference.textContent = reference;
  verseText.textContent = text;
  practiceInput.value = "";
  encouragement.hidden = true;
  congratulations.hidden = true;
  hideLoadMessage();
  showVerse();
}

function showPractice(name) {
  welcomeName.textContent = name;
  setCurrentVerse(currentReference, currentVerseText);

  nameScreen.hidden = true;
  practiceFlow.hidden = false;
  practiceFlow.scrollTop = 0;
}

function onPeekVerse() {
  var confirmed = confirm(
    "Looking at the verse will clear what you typed. Continue?"
  );

  if (!confirmed) {
    return;
  }

  practiceInput.value = "";
  encouragement.hidden = true;
  congratulations.hidden = true;
  showVerse();
}

function showCongratulations() {
  encouragement.hidden = true;
  // Dismiss the phone keyboard so congratulations is not covered.
  practiceInput.blur();
  congratulations.hidden = false;
  setTimeout(function () {
    congratulations.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 150);
}

function checkPracticeInput() {
  updateVerseVisibility();

  var correct = isVerseCorrect(practiceInput.value, currentVerseText);

  if (!correct) {
    congratulations.hidden = true;
    encouragement.hidden = true;
    return;
  }

  showCongratulations();
}

function onSubmitPractice() {
  var correct = isVerseCorrect(practiceInput.value, currentVerseText);

  if (correct) {
    showCongratulations();
    return;
  }

  // Wrong answer: show encouragement and leave what she typed in the box.
  congratulations.hidden = true;
  encouragement.hidden = false;
  setTimeout(function () {
    encouragement.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 150);
}

function onLoadVerse() {
  var bookName = bookSelect.value;
  var chapter = parseInt(chapterSelect.value, 10);
  var verse = parseInt(verseSelect.value, 10);
  var reference = formatReference(bookName, chapter, verse);

  hideLoadMessage();

  var cached = getCachedVerseText(reference);
  if (cached) {
    setCurrentVerse(reference, cached);
    return;
  }

  loadVerseButton.disabled = true;

  var controller = new AbortController();
  var timeoutId = setTimeout(function () {
    controller.abort();
  }, LOAD_TIMEOUT_MS);

  fetch(buildNltPassageUrl(bookName, chapter, verse), {
    signal: controller.signal,
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load verse");
      }
      return response.text();
    })
    .then(function (html) {
      var text = cleanNltPassageHtml(html);
      if (!text) {
        throw new Error("Empty verse");
      }
      saveCachedVerseText(reference, text);
      setCurrentVerse(reference, text);
    })
    .catch(function () {
      showLoadMessage();
    })
    .then(function () {
      clearTimeout(timeoutId);
      loadVerseButton.disabled = false;
    });
}

function start() {
  fillBookOptions();
  setPickerToReference("Psalm", 119, 11);

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

bookSelect.addEventListener("change", onBookChange);
chapterSelect.addEventListener("change", onChapterChange);
loadVerseButton.addEventListener("click", onLoadVerse);

practiceInput.addEventListener("input", checkPracticeInput);

peekVerse.addEventListener("click", onPeekVerse);

submitPractice.addEventListener("click", onSubmitPractice);

practiceInput.addEventListener("paste", function (event) {
  event.preventDefault();
});

practiceInput.addEventListener("drop", function (event) {
  event.preventDefault();
});

start();
