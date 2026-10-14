// In-memory list of books (no localStorage yet)
let books = [];

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

// Draws the book list from the current books array.
// Sorts a copy newest-first — never mutates the main array.
function render() {
  const list = document.getElementById('book-list');
  list.innerHTML = ''; // clear previous cards

  // Sort a shallow copy newest-first; leave books[] untouched
  const sorted = books.slice().sort((a, b) => b.createdAt - a.createdAt);

  // Show empty state when there are no books
  if (sorted.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-message';
    empty.textContent = 'No books yet. Add your first one above.';
    list.appendChild(empty);
    return;
  }

  // Build one card per book using createElement / textContent (never innerHTML)
  sorted.forEach(function (book) {
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

    // Status badge
    const statusEl = document.createElement('span');
    statusEl.className = 'book-status status-' + book.status;
    statusEl.textContent = STATUS_LABELS[book.status];

    li.appendChild(titleEl);
    li.appendChild(authorEl);
    li.appendChild(statusEl);
    list.appendChild(li);
  });
}

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

  // Add to the in-memory array
  books.push(newBook);

  // Reset the form fields
  titleInput.value  = '';
  authorInput.value = '';
  document.getElementById('status-select').value = 'to-read';

  // Re-draw the list
  render();
});

// Draw the (empty) list on first page load
render();
