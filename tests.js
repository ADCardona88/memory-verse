var verseCheck = require("./verse-check.js");
var normalizeVerseText = verseCheck.normalizeVerseText;
var isVerseCorrect = verseCheck.isVerseCorrect;

var bibleData = require("./bible-data.js");
var BIBLE_BOOKS = bibleData.BIBLE_BOOKS;
var findBibleBook = bibleData.findBibleBook;
var versesInChapter = bibleData.versesInChapter;

var nlt = require("./nlt.js");
var cleanNltPassageHtml = nlt.cleanNltPassageHtml;
var buildNltPassageUrl = nlt.buildNltPassageUrl;

var progressModule = require("./progress.js");
var getTodayDate = progressModule.getTodayDate;
var createEmptyProgress = progressModule.createEmptyProgress;
var recordMemorized = progressModule.recordMemorized;

var VERSE =
  "I have hidden your word in my heart, that I might not sin against you.";

var JOHN_316_HTML =
  '<div id="bibletext" class=" NLT NLT BibleText section">' +
  "<section>" +
  '<h2 class="bk_ch_vs_header">John 3:16, NLT</h2>' +
  '<verse_export orig="john_3_16" bk="john" ch="3" vn="16">' +
  '<p class="body">' +
  '<span class="vn">16</span>' +
  '<span class="red">' +
  "\u201cFor this is how God loved the world: He gave" +
  '<a class="a-tn">*</a>' +
  '<span class="tn">' +
  '<span class="tn-ref">3:16</span> Or <em>For God loved the world so much that he gave.</em>' +
  "</span>" +
  " his one and only Son, so that everyone who believes in him" +
  " will not perish but have eternal life." +
  "</span>" +
  "</p>" +
  "</verse_export>" +
  "</section>" +
  "</div>";

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

assert("exact match", isVerseCorrect(VERSE, VERSE));

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

assert("bible has 66 books", BIBLE_BOOKS.length === 66);

assert(
  "Genesis has 50 chapters; Genesis 1 has 31 verses",
  findBibleBook("Genesis").chapters.length === 50 &&
    versesInChapter("Genesis", 1) === 31
);

assert(
  "Psalm has 150 chapters; Psalm 119 has 176 verses",
  findBibleBook("Psalm").chapters.length === 150 &&
    versesInChapter("Psalm", 119) === 176
);

assert("John 3 has 36 verses", versesInChapter("John", 3) === 36);

assert(
  "3 John has 1 chapter with 14 verses",
  findBibleBook("3 John").chapters.length === 1 &&
    versesInChapter("3 John", 1) === 14
);

assert(
  "Jude has 1 chapter with 25 verses",
  findBibleBook("Jude").chapters.length === 1 &&
    versesInChapter("Jude", 1) === 25
);

assert(
  "Revelation has 22 chapters; Revelation 22 has 21 verses",
  findBibleBook("Revelation").chapters.length === 22 &&
    versesInChapter("Revelation", 22) === 21
);

assert(
  "invalid chapter or verse count is zero",
  versesInChapter("John", 99) === 0 && versesInChapter("Nope", 1) === 0
);

assert(
  "picker cannot offer John 3:99",
  versesInChapter("John", 3) === 36 && versesInChapter("John", 3) < 99
);

var cleanedJohn = cleanNltPassageHtml(JOHN_316_HTML);

assert(
  "John 3:16 cleanup keeps main verse words",
  cleanedJohn.indexOf("For this is how God loved the world") !== -1 &&
    cleanedJohn.indexOf("his one and only Son") !== -1
);

assert(
  "John 3:16 cleanup removes footnote text",
  cleanedJohn.indexOf("so much that he gave") === -1 &&
    cleanedJohn.indexOf("3:16") === -1
);

assert(
  "John 3:16 cleanup removes footnote star",
  cleanedJohn.indexOf("*") === -1
);

assert(
  "John 3:16 cleanup removes verse number alone",
  !/^\s*16\b/.test(cleanedJohn) && cleanedJohn.indexOf("16“") === -1
);

assert(
  "anonymous passage URL has no key",
  buildNltPassageUrl("John", 3, 16) ===
    "https://api.nlt.to/api/passages?ref=John.3.16" &&
    buildNltPassageUrl("John", 3, 16).indexOf("key=") === -1
);

var dayA = "2024-01-15";
var dayB = "2024-01-16";
var firstNew = recordMemorized(createEmptyProgress(), "John 3:16", dayA);

assert(
  "first new verse today raises streak and count",
  firstNew.streak === 1 && firstNew.versesMemorized === 1
);

var secondNew = recordMemorized(firstNew, "Psalm 119:11", dayA);

assert(
  "second new verse same day raises count only",
  secondNew.streak === 1 && secondNew.versesMemorized === 2
);

var repeatVerse = recordMemorized(secondNew, "John 3:16", dayA);

assert(
  "repeat verse raises neither counter",
  repeatVerse.streak === 1 &&
    repeatVerse.versesMemorized === 2 &&
    repeatVerse.memorizedReferences.length === 2
);

var nextDayFirst = recordMemorized(firstNew, "Romans 8:28", dayB);

assert(
  "next day first new verse raises streak to 2",
  nextDayFirst.streak === 2 && nextDayFirst.versesMemorized === 2
);

// 9 PM local on Jan 15 — must stay that calendar day, not UTC's next day.
var ninePmLocal = new Date(2024, 0, 15, 21, 0, 0);
var eveningDate = getTodayDate(ninePmLocal);
var utcIsoDate = ninePmLocal.toISOString().slice(0, 10);

assert(
  "9 PM local still counts as that calendar day",
  eveningDate === "2024-01-15"
);

assert(
  "evening date uses local time not UTC",
  eveningDate === "2024-01-15" &&
    (utcIsoDate === "2024-01-15" || eveningDate !== utcIsoDate)
);

console.log("");
console.log(passed + " passed, " + failed + " failed");

if (failed > 0) {
  process.exit(1);
}
