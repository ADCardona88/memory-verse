# Test step

Test step N in a browser at iPad size. Check the "I'll know it works when" sentence from our plan, plus every check listed in your plan for this step. Report each check and whether it passed.

## How

1. Take **N** from the arguments after `/test-step` (e.g. `/test-step 1`). If missing, ask.
2. From [`docs/plan.md`](../../docs/plan.md), use that step’s **I'll know it works when** sentence as a check.
3. From the agent plan for this step, use every listed check (success criteria, “also check”, browser-check items). Do not invent checks from later steps.
4. Open the app in a browser at **768×1024** (iPad portrait). Run each check with real interactions.
5. Report only — do not fix failures unless asked.

## Report

| # | Check | Result |
|---|--------|--------|
| 1 | I'll know it works when … | pass / fail |
| 2 | … | pass / fail |

**Summary:** X/Y passed. For each fail, one short line on what you saw.
