(() => {
  'use strict';

  let allBooks = [];

  const searchInput = document.getElementById('search-input');
  const filterGenre = document.getElementById('filter-genre');
  const sortBy = document.getElementById('sort-by');
  const booksContainer = document.getElementById('books-container');
  const genreNav = document.getElementById('genre-nav');
  const noResults = document.getElementById('no-results');
  const bookCount = document.getElementById('book-count');
  const modal = document.getElementById('book-modal');
  const modalBackdrop = modal.querySelector('.modal__backdrop');
  const modalClose = modal.querySelector('.modal__close');

  async function loadBooks() {
    try {
      const response = await fetch('data/books.json');
      if (!response.ok) throw new Error('Error al cargar los libros');
      allBooks = await response.json();
      populateGenres();
      renderBooks();
    } catch (error) {
      booksContainer.innerHTML = `<p class="no-results">Error al cargar la biblioteca. Intenta recargar la página.</p>`;
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

  function getFilteredBooks() {
    const query = searchInput.value.toLowerCase().trim();
    const genreFilter = filterGenre.value;

    return allBooks.filter(book => {
      const matchesSearch = !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      const matchesGenre = genreFilter === 'todos' || book.genre === genreFilter;

      return matchesSearch && matchesGenre;
    });
  }

  function sortBooks(books) {
    const sort = sortBy.value;
    const sorted = [...books];

    switch (sort) {
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
        break;
      case 'author':
        sorted.sort((a, b) => a.author.localeCompare(b.author, 'es'));
        break;
      case 'genre':
        sorted.sort((a, b) => a.genre.localeCompare(b.genre, 'es') || a.title.localeCompare(b.title, 'es'));
        break;
      case 'year':
        sorted.sort((a, b) => b.year - a.year);
        break;
    }

    return sorted;
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
    const coverHTML = book.cover
      ? `<img class="book-card__cover" src="${escapeAttr(book.cover)}" alt="Portada de ${escapeAttr(book.title)}" loading="lazy" onerror="this.outerHTML='<div class=\\'book-card__cover--placeholder\\'>${escapeHTML(book.title)}</div>'">`
      : `<div class="book-card__cover--placeholder">${escapeHTML(book.title)}</div>`;

    return `
      <article class="book-card" tabindex="0" data-book-id="${book.id}" role="button" aria-label="Ver detalle de ${escapeAttr(book.title)}">
        ${coverHTML}
        <div class="book-card__info">
          <h3 class="book-card__title">${escapeHTML(book.title)}</h3>
          <p class="book-card__author">${escapeHTML(book.author)}</p>
          <p class="book-card__status book-card__status--${statusClass}">${escapeHTML(book.status)}</p>
        </div>
      </article>
    `;
  }

  function renderBooks() {
    const filtered = getFilteredBooks();
    const sorted = sortBooks(filtered);

    if (sorted.length === 0) {
      booksContainer.innerHTML = '';
      genreNav.hidden = true;
      noResults.hidden = false;
      bookCount.textContent = '0 libros';
      return;
    }

    noResults.hidden = true;
    const total = sorted.length;
    bookCount.textContent = `${total} ${total === 1 ? 'libro' : 'libros'}`;

    // Si se ordena por género, agrupar en secciones
    if (sortBy.value === 'genre') {
      renderByGenre(sorted);
    } else {
      genreNav.hidden = true;
      booksContainer.innerHTML = `
        <div class="books-grid">
          ${sorted.map(createBookCard).join('')}
        </div>
      `;
    }
  }

  function renderByGenre(books) {
    const groups = {};
    books.forEach(book => {
      if (!groups[book.genre]) groups[book.genre] = [];
      groups[book.genre].push(book);
    });

    const genres = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'es'));

    // Navegación rápida por género
    genreNav.hidden = false;
    genreNav.innerHTML = genres.map(genre =>
      `<a href="#genre-${slugify(genre)}" class="genre-nav__link">${escapeHTML(genre)} (${groups[genre].length})</a>`
    ).join('');

    // Secciones por género
    booksContainer.innerHTML = genres.map(genre => `
      <section class="genre-section" id="genre-${slugify(genre)}">
        <h2 class="genre-section__title">${escapeHTML(genre)}</h2>
        <div class="books-grid">
          ${groups[genre].map(createBookCard).join('')}
        </div>
      </section>
    `).join('');
  }

  function openModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    const coverImg = document.getElementById('modal-cover');
    if (book.cover) {
      coverImg.src = book.cover;
      coverImg.alt = `Portada de ${book.title}`;
      coverImg.onerror = function () {
        this.src = '';
        this.alt = 'Sin portada';
        this.style.display = 'none';
      };
      coverImg.style.display = '';
    } else {
      coverImg.src = '';
      coverImg.style.display = 'none';
    }

    document.getElementById('modal-title').textContent = book.title;
    document.getElementById('modal-author').textContent = book.author;
    document.getElementById('modal-description').textContent = book.description || 'Sin descripción disponible.';
    document.getElementById('modal-edition').textContent = book.edition;
    document.getElementById('modal-genre').textContent = book.genre;
    document.getElementById('modal-pages').textContent = book.pages ? `${book.pages}` : '—';
    document.getElementById('modal-isbn').textContent = book.isbn || '—';
    document.getElementById('modal-status').textContent = book.status;

    const notesRow = document.getElementById('modal-notes-row');
    const notesDD = document.getElementById('modal-notes');
    if (book.notes) {
      notesRow.hidden = false;
      notesDD.textContent = book.notes;
    } else {
      notesRow.hidden = true;
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Event listeners
  searchInput.addEventListener('input', debounce(renderBooks, 200));
  filterGenre.addEventListener('change', renderBooks);
  sortBy.addEventListener('change', renderBooks);

  // Click en cards
  booksContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.book-card');
    if (card) openModal(Number(card.dataset.bookId));
  });

  booksContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.book-card');
      if (card) {
        e.preventDefault();
        openModal(Number(card.dataset.bookId));
      }
    }
  });

  // Modal cerrar
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Iniciar
  loadBooks();
})();
