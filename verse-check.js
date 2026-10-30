function normalizeVerseText(text) {
  var result = String(text).toLowerCase();

  // Remove apostrophes so "don't" matches "dont"; other punctuation becomes spaces.
  result = result.replace(/['\u2018\u2019\u201A\u201B]/g, "");
  result = result.replace(/[^a-z0-9\s]/g, " ");
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

function isVerseCorrect(typed, expected) {
  return normalizeVerseText(typed) === normalizeVerseText(expected);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalizeVerseText: normalizeVerseText,
    isVerseCorrect: isVerseCorrect,
  };
}
