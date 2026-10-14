// In-memory list of books — populated from localStorage on load
let books = [];

// localStorage key used for all reads and writes
const STORAGE_KEY = 'bookTracker.books';

// Valid status slugs
const VALID_STATUSES = ['to-read', 'reading', 'finished'];

// Maps the stored status slug to a human-readable label
const STATUS_LABELS = {
  'to-read':  'To read',
  'reading':  'Reading',
  'finished': 'Finished',
};

// Generates a unique id using the current timestamp + a random suffix
function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

// ── localStorage helpers ──────────────────────────────────────────────────────

// Saves the books array to localStorage.
// Shows a visible warning near the form if saving fails.
function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    // Clear any previous save-error message on success
    setSaveError('');
  } catch (err) {
    setSaveError("Couldn't save your books. They may be lost on refresh.");
  }
}

// Reads and validates books from localStorage.
// Falls back to an empty array if anything is missing, wrong shape, or corrupt.
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return; // nothing stored yet — keep books = []

    const parsed = JSON.parse(raw); // may throw if JSON is corrupt
    if (!Array.isArray(parsed)) return; // wrong shape — start fresh

    const seenIds = new Set(); // used to drop duplicate ids

    books = parsed.filter(function (item) {
      // Each field must be the right type and value
      if (typeof item.id        !== 'string'  || item.id.trim()     === '') return false;
      if (typeof item.title     !== 'string'  || item.title.trim()  === '') return false;
      if (typeof item.author    !== 'string'  || item.author.trim() === '') return false;
      if (!VALID_STATUSES.includes(item.status))                            return false;
      if (typeof item.createdAt !== 'number')                               return false;

      // Drop if we've already seen this id
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);

      return true; // item is valid — keep it
    });

  } catch (err) {
    // JSON.parse threw or some other error — start with an empty list
    books = [];
  }
}

// Shows or clears the save-error message near the form.
function setSaveError(message) {
  const el = document.getElementById('save-error');
  el.textContent = message;
}

// ── Render ────────────────────────────────────────────────────────────────────

// Draws the book list from the current books array.
// Sorts a copy newest-first, then filters by the search term.
// Never mutates the main array or localStorage.
function render() {
  const list = document.getElementById('book-list');
  list.innerHTML = ''; // clear previous cards

  // Sort a shallow copy newest-first; leave books[] untouched
  const sorted = books.slice().sort((a, b) => b.createdAt - a.createdAt);

  // Show "no books" message when the list is truly empty
  if (sorted.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-message';
    empty.textContent = 'No books yet. Add your first one above.';
    list.appendChild(empty);
    return;
  }

  // Read and trim the search term; lowercase for case-insensitive matching
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  // Filter the sorted copy — books[] is never touched
  const visible = query
    ? sorted.filter(function (book) {
        return book.title.toLowerCase().includes(query) ||
               book.author.toLowerCase().includes(query);
      })
    : sorted; // no query → show all

  // Show "no matches" message when search finds nothing
  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-message';
    empty.textContent = 'No books found.';
    list.appendChild(empty);
    return;
  }

  // Build one card per visible book using createElement / textContent (never innerHTML)
  visible.forEach(function (book) {
    const li = document.createElement('li');
    li.className = 'book-card';

    // Title
    const titleEl = document.createElement('p');
    titleEl.className = 'book-title';
    titleEl.textContent = book.title;

    // Author
    const authorEl = document.createElement('p');
    authorEl.className = 'book-author';
    authorEl.textContent = book.author;

    // Bottom row: colored badge + status dropdown side by side
    const rowEl = document.createElement('div');
    rowEl.className = 'card-status-row';

    // Colored badge (reflects the current status)
    const badgeEl = document.createElement('span');
    badgeEl.className = 'book-status status-' + book.status;
    badgeEl.textContent = STATUS_LABELS[book.status];

    // Status dropdown — stores this book's id so the handler can find it
    const selectEl = document.createElement('select');
    selectEl.className = 'card-status-select';
    selectEl.dataset.id = book.id; // used to look up the book by id

    // Build one <option> per valid status
    VALID_STATUSES.forEach(function (slug) {
      const opt = document.createElement('option');
      opt.value = slug;
      opt.textContent = STATUS_LABELS[slug];
      if (slug === book.status) opt.selected = true; // pre-select current status
      selectEl.appendChild(opt);
    });

    // When the user picks a new status, update by id — never by array position
    selectEl.addEventListener('change', function () {
      const newStatus = selectEl.value;
      const bookId    = selectEl.dataset.id;

      // Find the book in the main array by id
      const target = books.find(function (b) { return b.id === bookId; });
      if (!target) return; // id not found — do nothing, don't crash

      target.status = newStatus; // update in-memory
      saveBooks();               // persist
      render();                  // re-draw (search text is preserved)
    });

    rowEl.appendChild(badgeEl);
    rowEl.appendChild(selectEl);

    li.appendChild(titleEl);
    li.appendChild(authorEl);
    li.appendChild(rowEl);
    list.appendChild(li);
  });
}

// ── Form: Add Book ────────────────────────────────────────────────────────────

// Handles the Add Book form submission
document.getElementById('book-form').addEventListener('submit', function (event) {
  event.preventDefault(); // stop the page from reloading

  const titleInput  = document.getElementById('title-input');
  const authorInput = document.getElementById('author-input');
  const titleError  = document.getElementById('title-error');
  const authorError = document.getElementById('author-error');

  // Trim whitespace before checking
  const title  = titleInput.value.trim();
  const author = authorInput.value.trim();

  // Clear any previous error messages
  titleError.textContent  = '';
  authorError.textContent = '';

  // Validate — show errors and stop if either field is empty
  let valid = true;
  if (!title) {
    titleError.textContent = 'Please enter a title.';
    valid = false;
  }
  if (!author) {
    authorError.textContent = 'Please enter an author.';
    valid = false;
  }
  if (!valid) return;

  // Build the new book object
  const newBook = {
    id:        generateId(),
    title:     title,
    author:    author,
    status:    document.getElementById('status-select').value,
    createdAt: Date.now(),
  };

  // Add to the in-memory array, then persist
  books.push(newBook);
  saveBooks();

  // Reset the form fields and clear the search box
  titleInput.value  = '';
  authorInput.value = '';
  document.getElementById('status-select').value = 'to-read';
  document.getElementById('search-input').value  = '';

  // Re-draw the list
  render();
});

// ── Startup ───────────────────────────────────────────────────────────────────

// Re-render whenever the user types in the search box
document.getElementById('search-input').addEventListener('input', function () {
  render();
});

// Load saved books from localStorage, then draw the list
loadBooks();
render();
