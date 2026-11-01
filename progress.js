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

// Day before a YYYY-MM-DD local calendar date.
function getPreviousDate(dateString) {
  var parts = dateString.split("-");
  var year = Number(parts[0]);
  var month = Number(parts[1]) - 1;
  var day = Number(parts[2]);
  var date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  return getTodayDate(date);
}

function createEmptyProgress() {
  return {
    streak: 0,
    versesMemorized: 0,
    memorizedReferences: [],
    lastStreakDate: "",
  };
}

function copyProgress(progress) {
  return {
    streak: progress.streak,
    versesMemorized: progress.versesMemorized,
    memorizedReferences: progress.memorizedReferences.slice(),
    lastStreakDate: progress.lastStreakDate,
  };
}

// If last streak day was not today and not yesterday, streak is broken.
function applyMissedDayReset(progress, today) {
  var yesterday = getPreviousDate(today);
  if (
    progress.lastStreakDate === today ||
    progress.lastStreakDate === yesterday
  ) {
    return progress;
  }

  var next = copyProgress(progress);
  next.streak = 0;
  return next;
}

function recordMemorized(progress, reference, today) {
  var next = copyProgress(progress);

  if (next.memorizedReferences.indexOf(reference) !== -1) {
    return next;
  }

  next.memorizedReferences.push(reference);
  next.versesMemorized += 1;

  if (next.lastStreakDate !== today) {
    var yesterday = getPreviousDate(today);
    if (next.lastStreakDate === yesterday) {
      next.streak += 1;
    } else {
      next.streak = 1;
    }
    next.lastStreakDate = today;
  }

  return next;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getTodayDate: getTodayDate,
    getPreviousDate: getPreviousDate,
    createEmptyProgress: createEmptyProgress,
    applyMissedDayReset: applyMissedDayReset,
    recordMemorized: recordMemorized,
  };
}
