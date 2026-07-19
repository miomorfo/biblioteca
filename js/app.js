(() => {
  'use strict';

  let allBooks = [];

  const searchInput = document.getElementById('search-input');
  const filterStatus = document.getElementById('filter-status');
  const filterGenre = document.getElementById('filter-genre');
  const booksGrid = document.getElementById('books-grid');
  const noResults = document.getElementById('no-results');
  const bookCount = document.getElementById('book-count');

  async function loadBooks() {
    try {
      const response = await fetch('data/books.json');
      if (!response.ok) throw new Error('Error al cargar los libros');
      allBooks = await response.json();
      populateGenres();
      renderBooks(allBooks);
    } catch (error) {
      booksGrid.innerHTML = `<p class="no-results">Error al cargar la biblioteca. Intenta recargar la página.</p>`;
      console.error(error);
    }
  }

  function populateGenres() {
    const genres = [...new Set(allBooks.map(book => book.genre))].sort();
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      filterGenre.appendChild(option);
    });
  }

  function getStatusClass(status) {
    const normalized = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized === 'disponible') return 'disponible';
    if (normalized === 'prestado') return 'prestado';
    if (normalized === 'reservado') return 'reservado';
    return 'disponible';
  }

  function createBookCard(book) {
    const statusClass = getStatusClass(book.status);
    const notesHTML = book.notes
      ? `<p class="book-card__notes">${escapeHTML(book.notes)}</p>`
      : '';

    return `
      <article class="book-card">
        <h2 class="book-card__title">${escapeHTML(book.title)}</h2>
        <p class="book-card__author">${escapeHTML(book.author)}</p>
        <div class="book-card__details">
          <span class="book-card__detail">
            <span class="book-card__detail-label">Edición:</span>
            ${escapeHTML(book.edition)}
          </span>
          <span class="book-card__detail">
            <span class="book-card__detail-label">Género:</span>
            ${escapeHTML(book.genre)}
          </span>
        </div>
        <span class="book-card__status book-card__status--${statusClass}">
          <span class="book-card__status-dot" aria-hidden="true"></span>
          ${escapeHTML(book.status)}
        </span>
        ${notesHTML}
      </article>
    `;
  }

  function renderBooks(books) {
    if (books.length === 0) {
      booksGrid.innerHTML = '';
      noResults.hidden = false;
      bookCount.textContent = '0 libros';
      return;
    }

    noResults.hidden = true;
    booksGrid.innerHTML = books.map(createBookCard).join('');
    const total = books.length;
    bookCount.textContent = `${total} ${total === 1 ? 'libro' : 'libros'}`;
  }

  function filterBooks() {
    const query = searchInput.value.toLowerCase().trim();
    const statusFilter = filterStatus.value;
    const genreFilter = filterGenre.value;

    const filtered = allBooks.filter(book => {
      const matchesSearch = !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'todos' || book.status === statusFilter;
      const matchesGenre = genreFilter === 'todos' || book.genre === genreFilter;

      return matchesSearch && matchesStatus && matchesGenre;
    });

    renderBooks(filtered);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event listeners
  searchInput.addEventListener('input', debounce(filterBooks, 200));
  filterStatus.addEventListener('change', filterBooks);
  filterGenre.addEventListener('change', filterBooks);

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Iniciar
  loadBooks();
})();
