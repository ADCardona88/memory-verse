var NAME_STORAGE_KEY = "memoryVerseName";
var PROGRESS_STORAGE_KEY = "memoryVerseProgress";
var MAX_NAME_LENGTH = 30;

function getCreateEmptyProgress() {
  if (typeof createEmptyProgress === "function") {
    return createEmptyProgress;
  }
  return require("./progress.js").createEmptyProgress;
}

function getStore(storage) {
  return storage || localStorage;
}

function getSavedName(storage) {
  var saved = getStore(storage).getItem(NAME_STORAGE_KEY);
  if (!saved) {
    return "";
  }
  return saved.trim().slice(0, MAX_NAME_LENGTH);
}

function saveName(name, storage) {
  getStore(storage).setItem(NAME_STORAGE_KEY, name);
}

function loadProgress(storage) {
  var raw = getStore(storage).getItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return getCreateEmptyProgress()();
  }

  try {
    var parsed = JSON.parse(raw);
    return {
      streak: parsed.streak || 0,
      versesMemorized: parsed.versesMemorized || 0,
      memorizedReferences: parsed.memorizedReferences || [],
      lastStreakDate: parsed.lastStreakDate || "",
    };
  } catch (error) {
    return getCreateEmptyProgress()();
  }
}

function saveProgress(nextProgress, storage) {
  getStore(storage).setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify(nextProgress)
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NAME_STORAGE_KEY: NAME_STORAGE_KEY,
    PROGRESS_STORAGE_KEY: PROGRESS_STORAGE_KEY,
    MAX_NAME_LENGTH: MAX_NAME_LENGTH,
    getSavedName: getSavedName,
    saveName: saveName,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
  };
}
