function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}

// Local calendar day on the device (iPad), never UTC.
function getTodayDate(now) {
  var date = now || new Date();
  return (
    date.getFullYear() +
    "-" +
    pad2(date.getMonth() + 1) +
    "-" +
    pad2(date.getDate())
  );
}

function createEmptyProgress() {
  return {
    streak: 0,
    versesMemorized: 0,
    memorizedReferences: [],
    lastStreakDate: "",
  };
}

function recordMemorized(progress, reference, today) {
  var next = {
    streak: progress.streak,
    versesMemorized: progress.versesMemorized,
    memorizedReferences: progress.memorizedReferences.slice(),
    lastStreakDate: progress.lastStreakDate,
  };

  if (next.memorizedReferences.indexOf(reference) !== -1) {
    return next;
  }

  next.memorizedReferences.push(reference);
  next.versesMemorized += 1;

  if (next.lastStreakDate !== today) {
    next.streak += 1;
    next.lastStreakDate = today;
  }

  return next;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getTodayDate: getTodayDate,
    createEmptyProgress: createEmptyProgress,
    recordMemorized: recordMemorized,
  };
}
