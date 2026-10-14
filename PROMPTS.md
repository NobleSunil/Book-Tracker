Prompt 0: Setting Ground Rules

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

Phase 1: Plan (No Coding Yet)

Phase 1: Plan only. No code yet.
The app: a Book Tracker where someone keeps a list of books they want to read.
Must-have: add a book (title, author, status To read/Reading/Finished; title and author required), show the list newest first, search by title or author, change a book's status, keep data after refresh using localStorage.
Extras, to be built later only when I ask: delete a book, counts like "3 finished, 2 reading, 1 to read", and a phone-friendly layout.
Tell me: (1) the files you'll create and what each is for, (2) how the data will be saved and loaded, (3) the edge cases I should handle (empty input, long titles, corrupted storage, etc.). Wait for my next message.

Phase 1: Follow-Up

Good plan. Before Phase 2, please update the plan with these points (still no code):
1. Loading: after JSON.parse, check the result is an array. Keep only items that have a non-empty string title and author, a status that is exactly "to-read", "reading" or "finished", and a numeric createdAt. If the data is missing, invalid or the wrong shape, start with an empty list and never crash.
2. Saving: wrap localStorage.setItem in try/catch and show a small visible message if saving fails.
3. Rendering: never sort or modify the main books array. Filter and sort a copy, so searching never changes the stored data or its order.
4. Long titles: wrap them using overflow-wrap: anywhere. Do not truncate.
5. Status change: the update must find the book by id in the main books array (not by position in the filtered view), save, and re-render without clearing the current search text.
Reply with the short updated plan only. Wait for my next message.

Phase 2: Add book and show the list

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