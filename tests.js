var verseCheck = require("./verse-check.js");
var normalizeVerseText = verseCheck.normalizeVerseText;
var isVerseCorrect = verseCheck.isVerseCorrect;

var VERSE =
  "I have hidden your word in my heart, that I might not sin against you.";

var passed = 0;
var failed = 0;

function assert(name, condition) {
  if (condition) {
    passed += 1;
    console.log("pass: " + name);
  } else {
    failed += 1;
    console.log("fail: " + name);
  }
}

assert(
  "exact match",
  isVerseCorrect(VERSE, VERSE)
);

assert(
  "different capitals",
  isVerseCorrect(
    "I HAVE HIDDEN YOUR WORD IN MY HEART, THAT I MIGHT NOT SIN AGAINST YOU.",
    VERSE
  )
);

assert(
  "missing punctuation",
  isVerseCorrect(
    "I have hidden your word in my heart that I might not sin against you",
    VERSE
  )
);

assert(
  "extra spaces and line breaks",
  isVerseCorrect(
    "I  have   hidden your word\nin my heart,  that I might not sin against you.",
    VERSE
  )
);

assert(
  "curly apostrophe matches straight",
  isVerseCorrect("don\u2019t worry", "don't worry")
);

assert(
  "apostrophe removed so don't matches dont",
  isVerseCorrect("don't", "dont") &&
    isVerseCorrect("don\u2019t", "dont") &&
    normalizeVerseText("don't") === "dont"
);

assert(
  "wrong word fails",
  !isVerseCorrect(
    "I have hidden your word in my soul, that I might not sin against you.",
    VERSE
  )
);

assert(
  "wrong order fails",
  !isVerseCorrect(
    "I have hidden in my heart your word, that I might not sin against you.",
    VERSE
  )
);

assert(
  "normalize collapses punctuation to spaces",
  normalizeVerseText("Hello, world!") === "hello world"
);

console.log("");
console.log(passed + " passed, " + failed + " failed");

if (failed > 0) {
  process.exit(1);
}
