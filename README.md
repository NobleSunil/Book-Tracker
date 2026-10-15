# Book Tracker

A simple web app to track books you want to read, are reading, or have finished. Built with plain HTML, CSS and JavaScript — no frameworks, no backend.

**Live site:** https://noblesunil.github.io/Book-Tracker/

## Features

- Add a book (title and author required; status: To read / Reading / Finished)
- List shown newest first
- Search by title or author (case-insensitive, live as you type)
- Change a book's status from its card
- Data saved in the browser (localStorage) — survives a page refresh
- Delete a book with a confirmation prompt
- Status counts (e.g. "3 finished, 2 reading, 1 to read") always reflect all books
- Phone-friendly layout with 44 px touch targets and no sideways scrolling

## Tech

Plain HTML, CSS and JavaScript only. No frameworks, no libraries, no build step. Works by opening `index.html` directly.

## How to run

Open `index.html` in any modern browser. No install needed.

## AI tools used

- **Antigravity** — built the app phase by phase (code generation, refactoring, bug fixes)
- **Claude** — planning, code review and validation checks

## How I built it

Step by step in phases, testing and committing after each one. Full prompt history is in `PROMPTS.md`.