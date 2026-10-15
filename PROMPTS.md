## Prompt 0: Setting Ground Rules

I'm building a small "Book Tracker" web app for a vibe-coding assessment. I will build it in phases and test after each one.

STRICT WORKING RULES:
1. Do ONLY the phase I ask for in each message. Do not build ahead or add features I didn't ask for. After finishing a phase, stop and wait for my next message.
2. Tech: plain HTML, CSS and JavaScript only. No frameworks, no libraries, no build tools, no backend, no npm. It must work by just opening index.html.
3. Files (all lowercase): index.html, style.css, app.js. Do not create README.md or PROMPTS.md, I will write those myself.
4. Do not run git commands. I will commit myself.
5. Data model for each book: { id: string, title: string, author: string, status: "to-read" | "reading" | "finished", createdAt: number }. Store status as the slug, and show labels "To read", "Reading", "Finished" in the UI.
6. localStorage key: "bookTracker.books" (a JSON array).
7. Security: never insert user text with innerHTML. Use textContent / createElement so input like <b>hi</b> shows as literal text.
8. Update and delete books by id, never by array index.
9. Keep the code simple and readable, with short comments. Use one render() function that draws the list from the data. I'm a student and must be able to explain every line.
10. At the end of each phase, give me: (a) a short summary of what you changed, and (b) a short list of things I should test manually.

Acknowledge these rules in 3 lines. Don't write any code yet.

What happened: Agent acknowledged all 10 rules in 3 lines and waited.

---

## Phase 1: Plan (No Coding Yet)

Phase 1: Plan only. No code yet.
The app: a Book Tracker where someone keeps a list of books they want to read.
Must-have: add a book (title, author, status To read/Reading/Finished; title and author required), show the list newest first, search by title or author, change a book's status, keep data after refresh using localStorage.
Extras, to be built later only when I ask: delete a book, counts like "3 finished, 2 reading, 1 to read", and a phone-friendly layout.
Tell me: (1) the files you'll create and what each is for, (2) how the data will be saved and loaded, (3) the edge cases I should handle (empty input, long titles, corrupted storage, etc.). Wait for my next message.

What happened: Agent produced a 3-section plan covering files, load/save strategy, and edge cases table. No code written.

---

### Phase 1b: Plan Follow-Up Fixes

Good plan. Before Phase 2, please update the plan with these points (still no code):
1. Loading: after JSON.parse, check the result is an array. Keep only items that have a non-empty string title and author, a status that is exactly "to-read", "reading" or "finished", and a numeric createdAt. If the data is missing, invalid or the wrong shape, start with an empty list and never crash.
2. Saving: wrap localStorage.setItem in try/catch and show a small visible message if saving fails.
3. Rendering: never sort or modify the main books array. Filter and sort a copy, so searching never changes the stored data or its order.
4. Long titles: wrap them using overflow-wrap: anywhere. Do not truncate.
5. Status change: the update must find the book by id in the main books array (not by position in the filtered view), save, and re-render without clearing the current search text.
Reply with the short updated plan only. Wait for my next message.

What happened: Agent produced an updated plan with all 5 points incorporated. No code written.

---

## Phase 2: Add Book and Show the List

Phase 2: Create index.html, style.css and app.js, following the updated plan exactly.
- Form with Title (text), Author (text), Status (dropdown: To read, Reading, Finished) and an Add button.
- On Add, trim title and author. If the title is empty, show "Please enter a title" in a message directly under the title box. If the author is empty, show "Please enter an author" under the author box. Show both if both are empty. Don't add the book if either is missing. Clear the messages when input is valid.
- On success: create the book with a unique id and createdAt: Date.now(), add it to the books array, clear the form, reset the status dropdown to To read, and clear the search box if it exists. Then call render(). Do not insert at the front of the array manually: render() sorts a copy newest-first by createdAt.
- Each book shows: title, author, and a status label ("To read", "Reading" or "Finished") built with textContent.
- Show "No books yet. Add your first one above." when the list is empty.
- Use overflow-wrap: anywhere so very long titles wrap and never break the layout.
- Basic clean styling only. No saving yet: the data lives in the in-memory books array. Do not add search, status change, delete, counts, or localStorage in this phase.
- Do not edit PROMPTS.md.
Stop after this phase and give me a summary plus a list of things to test.

What happened: Agent created all three files. Form with inline validation, render() using createElement/textContent, newest-first sort on a copy of the array. No localStorage yet.

---

## Phase 3: Saving the Data

Phase 3: Edit only app.js. Do not edit PROMPTS.md or any other file.
- Save the books array to localStorage under "bookTracker.books" (JSON.stringify) every time it changes, i.e. after a successful Add.
- On page load, read and parse it. Wrap JSON.parse in try/catch. Verify the result is an array. Keep only items with a non-empty string id, a non-empty string title and author, a status that is exactly "to-read", "reading" or "finished", and a numeric createdAt. Drop any item that fails, and drop items with a duplicate id. If the data is missing, invalid or the wrong shape, start with an empty list and never crash.
- Wrap localStorage.setItem in try/catch. If saving fails, show a small visible message near the form: "Couldn't save your books. They may be lost on refresh."
- Call render() after loading so saved books show up when the page opens.
- Save every field of each book (id, title, author, status, createdAt).
- Do not add search, status change, delete, counts, or any other feature.
Stop after this phase and give me a summary plus a list of things to test.

What happened: Agent added loadBooks(), saveBooks(), setSaveError() to app.js. Also added a #save-error element to index.html and its style to style.css (not just app.js as instructed — see AI mistakes).

---

## Phase 4: Search

Phase 4: Add a search box above the list. As I type, show only books whose title OR author contains the text, ignoring capital letters and ignoring spaces at the start and end of the search text. Filtering must only affect what is displayed, never the saved array or localStorage. If nothing matches, show "No books found". Clearing the box shows all books again. Stop after this phase.

What happened: Agent added a search input to index.html, styled it in style.css, and updated render() to read the search term, filter a copy of the sorted array, and show "No books found." when nothing matched. The main books array is never touched.

---

## Phase 5: Change Status

Do not read or edit PROMPTS.md. Do not run git commands.

Phase 5: Edit app.js and style.css only, unless a change in index.html is truly unavoidable (tell me if so).
- Show each book's status as a dropdown (To read, Reading, Finished) on its card, with the current status selected. Keep the colored status badge if it already exists, and make sure it updates too.
- When I change the dropdown, find the book in the main books array by its id (never by its position in the filtered list), update its status, call saveBooks(), then call render().
- render() already reads the search box, so the current search text and filtered view must stay exactly as they are after a status change. Do not clear or modify the search box.
- If the id is not found, do nothing and don't crash.
- Do not add delete, counts, or any other feature.
Stop after this phase and give me a summary plus a list of things to test.

What happened: Agent added a status dropdown and colored badge to each book card inside render(). Change handler finds the book by id, validates nothing yet (fixed later), updates status, calls saveBooks() and render(). No index.html changes needed.

---

## Phase 6a: Delete

Do not read or edit PROMPTS.md. Do not run git commands.
Phase 6a: Edit app.js and style.css only.
Add a Delete button on each book card. When clicked, ask for confirmation with confirm("Delete this book?"). If confirmed, remove that book from the main books array by its id (not by position), call saveBooks(), then call render(). Keep the current search text and filtered view untouched. If the id is not found, do nothing. Build the button with createElement and textContent. Do not add any other feature.
Stop and give me a summary plus things to test.

What happened: Agent added a Delete button to each card in render(). Click handler uses confirm(), then findIndex() by id, splice(), saveBooks(), render(). No index.html changes needed.

---

## Phase 6b: Counts

Do not read or edit PROMPTS.md. Do not run git commands.
Phase 6b: Show counts above the list, like "3 finished, 2 reading, 1 to read". Calculate them from the main books array inside render() each time. Don't store them. They must count ALL books, not only the ones visible after a search. Show nothing (or "No books yet") when there are no books. You may add one element to index.html for this. Do not add any other feature.
Stop and give me a summary plus things to test.

What happened: Agent added a <p id="book-counts"> to index.html and logic at the top of render() that tallies finished/reading/to-read from the full books array. Only non-zero counts are shown. The counts element is cleared when books is empty.

---

## Phase 6c: Mobile Layout

Do not read or edit PROMPTS.md. Do not run git commands.
Phase 6c: Make the layout work on a phone. Make sure index.html has <meta name="viewport" content="width=device-width, initial-scale=1">. In style.css use a single-column layout under 600px, make inputs, dropdowns and buttons at least 44px tall, and make sure nothing scrolls sideways at 375px width. Don't change any JavaScript behavior.
Stop and give me a summary plus things to test.

What happened: Agent confirmed viewport meta was already present. Added overflow-x: hidden to the body rule and a @media (max-width: 600px) block that sets min-height: 44px on all interactive elements, makes Add and Delete buttons full-width, and stacks the badge above the status dropdown on narrow screens.

---

## Phase 7: Read-Only Code Review

Phase 7: Do a code review of my app, but do NOT change any files yet. Check for: any use of innerHTML with user data, any place that updates books by array index, any missing trim() on input or search, any place where filtering changes the saved data, any unhandled errors in localStorage reads, and any console errors. List what you find, with file and line numbers, and wait for me.

What happened: Agent reviewed all three files and produced a 15-row table. All six checklist items passed. Three informational notes were flagged (localStorage.getItem can throw in Safari private mode — already caught; render() called after script loads at end of body — safe by design; setSaveError called only from saveBooks — no timing issue). No bugs found, no files changed.

---

## Phase 8: Harden Validation and Autofill

(Earlier in the conversation, after a mid-build code review, the following targeted fixes were applied.)

What happened: Agent applied four fixes in one pass:
1. autocomplete="off" added to title-input and author-input in index.html.
2. On Add: status select value read into rawStatus; validated against VALID_STATUSES; falls back to "to-read" if invalid.
3. On status change: VALID_STATUSES.includes(newStatus) guard added before any mutation.
4. loadBooks(): typeof item.createdAt !== 'number' replaced with !Number.isFinite(item.createdAt) to also reject NaN and Infinity.

---

## Phase 9: Console Test Script (run by hand)

What happened: Browser DevTools console tests were run manually to verify HTML injection safety, localStorage corruption fallback, and correct id-based lookup. All passed.

---

## AI Mistakes I Noticed

1. **Editing files I was told not to touch (Phase 3).**
   Rule 4 and the Phase 3 prompt said "Edit only app.js." The agent also edited index.html (adding #save-error) and style.css (adding its style) to support the save-error message. This was noticed from the git diff and the commit touching three files instead of one. It was not reverted; the additions were correct and needed, but the agent should have flagged the index.html/style.css edits explicitly instead of silently making them.

2. **Running git commands when told not to (Phase 2–5).**
   Rule 4 said "Do not run git commands. I will commit myself." The agent ran git init and git remote add origin early on when asked to "connect" the repo. This was in response to a direct user request, so it was arguably justified, but the agent should have flagged the rule conflict before running the commands.

3. **Status value not validated on Add or on card change (Phases 2–5).**
   The initial implementation used the select value directly without checking it was in VALID_STATUSES. This was caught during a mid-build code review and fixed in Phase 8. It was noticed because the code review table showed the status slug was accepted unchecked on both paths.