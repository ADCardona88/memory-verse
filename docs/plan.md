# Memory Verse App, Version One

## Goal
Help my kids memorize scripture one verse at a time, and keep them coming back every day.
My learning goal: run the plan, build, review, test, and commit loop myself, with AI agents doing the coding.

## How we build (every step)
1. Pick the next step below.
2. Ask the agent for a plan in plain English first. Push back if it's too big or adds anything not asked for.
3. Approve, and let the agent build it, including an automatic test when the step has logic.
4. Second pass: a fresh chat reviews the change against the project rules and this plan. I decide which findings are real.
5. The agent tests it (in a browser at iPad size when it's visual), and I try it myself.
6. Fix only what failed. If the same mistake happens twice, add a rule to AGENTS.md.
7. The agent commits and pushes. Pushing updates the live page on GitHub Pages.

## Who it's for
My 10-year-old daughter, on her iPad in Safari. One profile per device.

## Where it runs and data safety
- A public web page on GitHub Pages: https://adcardona88.github.io/memory-verse/
- Her name, streak, and history are saved only in the browser's local storage on her device. They are never sent anywhere.
- The only outside request is to Tyndale's free NLT API (https://api.nlt.to) for verse text, sending only the reference, like "John 3:16". No key is used.
- A verse's text is saved on the device after it loads once.
- Anyone on another device gets a blank app and can't see her progress.
- Risk: Safari may clear a website's saved data if the site isn't visited for a while, and clearing website data erases progress. Adding the app to the iPad Home Screen should reduce this. Step 11 checks it.
- Dates come from the device clock, read in one place in the code so tests can pretend it's a different day.

## What counts as "correct"
Her typed verse is correct when the words match the verse in the same order, ignoring:
- capital letters,
- punctuation (periods, commas, quotes, dashes),
- extra spaces or line breaks,
- curly versus straight quotes and apostrophes.
The verse reference, verse numbers, and footnotes from Tyndale are never part of what she types.

## How the two counters work
- Streak (days): goes up by one on the first new verse she memorizes each day. It resets if she misses a day.
- Verses memorized (count): goes up by one for each new verse.
- A second new verse on the same day raises the count and goes in history, but not the streak.
- Re-doing a verse she already memorized shows congratulations, and neither counter changes.
- One correct run counts as memorized.

## What we're not building in version one
Accounts or logins, syncing across devices, multiple profiles, pulling verses from YouTube sermons, word-by-word feedback, and going deeper on meaning.

## Build steps
Each step is one small thing she can see, with a sentence that says how we know it works.

0. **Starting page (done).** I'll know it works when the live link on her iPad shows "Memory Verse" and "Coming soon."

1. **Name and welcome.** The first time she opens the app, she types her name. After that it greets her.
   I'll know it works when I enter a name, reload the page, and see "Welcome back, [name]."

2. **Practice one built-in verse.** Use one short verse built into the app (no internet yet). She reads it, moves to a text box where the verse is hidden, and types it from memory. Congratulations appear on their own as soon as it's correct, using the rules in "What counts as correct."
   I'll know it works when I type the verse with different capitals and no punctuation and still get congratulations without pressing anything.

3. **No pasting.** I'll know it works when I try to paste into the box and nothing goes in.

4. **Encouragement when wrong.** A Submit button checks her answer. If it's wrong, she sees an encouraging verse, like Psalm 119:11 or Psalm 1, telling her to keep going.
   I'll know it works when I press Submit with a wrong answer and see the encouraging message.

5. **Peeking clears the box.** If she scrolls back up to the verse while typing, the app asks: "Looking at the verse will clear what you typed. Continue?"
   I'll know it works when I scroll up, confirm, and the box is empty with the verse showing.

6. **Pick any real verse.** A simple book, chapter, and verse picker loads the real NLT text from Tyndale. Only real verses can be picked.
   I'll know it works when I pick a verse and see its real NLT text, then practice it the same way as step 2.

7. **Friendly failures.** I'll know it works when a verse can't load, or the iPad is offline, and she sees a friendly message instead of a broken page.

8. **Counters.** Add the streak and verses-memorized counters, following "How the two counters work." Automatic tests pretend it's different days.
   I'll know it works when the tests show the first new verse today raises both counters, a second new verse raises only the count, and a repeat raises neither.

9. **Streak resets.** I'll know it works when a test pretends she skipped a day and the streak goes back to zero.

10. **History.** I'll know it works when I can open a list of every verse she has memorized.

11. **It remembers.** I'll know it works when I close Safari, reopen the app from the iPad Home Screen, and her name, streak, and history are all still there.

12. **Real use.** I'll know version one works when my daughter uses it on her own for a few days and her streak is counting.

## Open questions
- Does Tyndale require a copyright line shown with NLT verses? Check before step 6.
