# Prompt Log: Book Tracker

**Tools:** Antigravity (agent that wrote the code), Claude (planning, writing prompts, code review)
**Method:** 9 phases. For each phase: send one prompt, read the diff, test by hand, commit, push.

| Phase | Goal | Result |
|---|---|---|
| 0 | Ground rules | Agent accepted 10 rules |
| 1 | Plan, no code | Plan with files, data flow, edge cases |
| 1b | Fix the plan | 5 gaps closed before any code |
| 2 | Add a book and list | Form, validation, newest-first list |
| 3 | Save data | localStorage load/save with validation |
| 4 | Search | Case-insensitive title/author filter |
| 5 | Change status | Dropdown and badge, updates by id |
| 6a / 6b / 6c | Delete, counts, mobile layout | Done |
| 7 | Read-only code review | No bugs found |
| 8 | Hardening | Status validation, autocomplete |



## Prompt 0: Ground rules
**Asked (abridged):** Plain HTML/CSS/JS only. Do one phase at a time and stop. Data model `{id, title, author, status, createdAt}`. localStorage key `bookTracker.books`. Never use innerHTML with user text. Update and delete by id, never by index. One `render()` function. Don't create README or PROMPTS. No git commands. End each phase with a summary and a test list.
**What happened:** The agent accepted the rules and waited.

## Prompt 1: Plan, no code
**Asked (abridged):** Describe the Book Tracker with its must-have features. List the files, how data is saved and loaded, and the edge cases. No code yet.
**What happened:** The agent gave a plan covering files, saving, and edge cases.

## Prompt 1b: Plan fixes
**Asked (abridged):** I reviewed the plan and found gaps. Validate the shape of stored data, not just the JSON. Wrap `setItem` in try/catch. Never sort or modify the main array in render(), only a copy. Wrap long titles instead of truncating. Update status by id without clearing the search.
**What happened:** The agent updated the plan with all five points.
**Why I did this:** The first plan only caught broken JSON. Valid JSON of the wrong shape, such as `{}`, would still have crashed `books.filter`.

## Prompt 2: Add a book and show the list
**Asked (abridged):** Create index.html, style.css and app.js. Form with title, author and status. Trim input and show "Please enter a title" or "Please enter an author" under the field. New books come from `createdAt: Date.now()`, and render() sorts a copy newest first. Clear the search box after a successful add. Empty state message. No saving yet.
**What happened:** All three files were created. Validation, textContent rendering and the newest-first sort worked.

## Prompt 3: Save the data
**Asked (abridged):** Save the books array to localStorage after every change. On load, use try/catch, check it is an array, keep only valid items, and drop duplicate ids. Show a message if saving fails.
**What happened:** The agent added `loadBooks()`, `saveBooks()` and `setSaveError()`. It also edited index.html and style.css, which my prompt said not to touch. See mistake 3.

## Prompt 4: Search
**Asked (abridged):** A search box that filters by title or author as I type, ignoring case and outer spaces. Filtering must never change the saved data. Show "No books found" when nothing matches.
**What happened:** The search worked and filtered a copy of the array.

## Prompt 5: Change status
**Asked (abridged):** A status dropdown on each card. Find the book by id in the main array, update it, save, and re-render without touching the search box.
**What happened:** The dropdown and coloured badge were added. The new status value was not validated yet. See mistake 2.

## Prompt 6a: Delete
**Asked (abridged):** A Delete button with `confirm()`. Remove by id, save, re-render, and keep the search.
**What happened:** Done as asked.

## Prompt 6b: Counts
**Asked (abridged):** Show counts like "3 finished, 2 reading, 1 to read", calculated from all books on every render.
**What happened:** Done as asked. The counts ignore the search filter.

## Prompt 6c: Mobile layout
**Asked (abridged):** Single column under 600px, tap targets of at least 44px, no sideways scroll at 375px.
**What happened:** The agent added a media query and `min-height: 44px` on controls.

## Prompt 7: Read-only code review
**Asked (abridged):** Review the code for innerHTML with user data, updates by index, missing trim, filtering that changes saved data, and localStorage errors. Don't change any files.
**What happened:** The agent reported no real bugs. It missed the status validation gap below, which a second audit found.

## Prompt 8: Hardening
**Asked (abridged):** Add autocomplete="off" to the title and author inputs. Check the status value against the allowed list on Add and on status change. Use `Number.isFinite` for `createdAt`. Change nothing else.
**What happened:** The fixes were applied and later confirmed with a code search.

## Prompt 9: Console test script (run by hand)
**What I did:** Pasted a test script into the browser console on the live site. It checks validation, search, status change while searching, delete, and HTML injection safety.
**Result:** <"all passed">


## AI mistakes I noticed

**1. The agent ignored my rule about PROMPTS.md and git.**
- *What went wrong:* I told it not to edit PROMPTS.md and not to run git. After several phases its output still said "Edited PROMPTS.md", and it ran git commands in its own session, including a push to `master` while my work was on `main`. That left my branches out of sync.
- *How I noticed:* The command lines in the agent's output, then `git status`, `git diff` and `git log --all`.
- *Fix:* I reverted its edits to PROMPTS.md, added the rule to the top of every later prompt, and wrote this log by hand. I fixed the branches by pushing everything to `main` and making it the default.

**2. Status values were not validated on Add or on status change.**
- *What went wrong:* The form and the card dropdown wrote the select value straight to the data. A tampered value would be saved, then silently dropped by `loadBooks()` on the next refresh, so the book would vanish.
- *How I noticed:* My Phase 7 review, which asked about other checks, passed this. A later 17-item audit flagged it, and I confirmed it by searching the code for `VALID_STATUSES`.
- *Fix:* Phase 8 added the allowed-values check in both places.

**3. A contradiction in my own prompt (not the AI's fault).**
- *What went wrong:* I said "edit only app.js" in Phase 3, but the save-error message needs an element in the HTML and a style.
- *What the agent did:* It said so openly and made the smallest change.
- *Lesson:* I accepted the change. I should have allowed the extra files in the prompt.