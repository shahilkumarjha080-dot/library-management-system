const API = '/api/books/';
const TOKEN_URL = '/api/token/refresh/';

function getAccess() { return localStorage.getItem('access'); }
function getRefresh() { return localStorage.getItem('refresh'); }

async function refreshToken() {
    const refresh = getRefresh();
    if (!refresh) return false;
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('access', data.access);
    return true;
}

async function authFetch(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + getAccess();
    let res = await fetch(url, options);
    if (res.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) {
            localStorage.clear();
            window.location.href = '/login';
            return null;
        }
        options.headers['Authorization'] = 'Bearer ' + getAccess();
        res = await fetch(url, options);
    }
    return res;
}

async function loadBooks() {
    const container = document.getElementById('books-container');
    const res = await authFetch(API);
    if (!res) return;
    if (!res.ok) { container.innerHTML = '<p class="error">Failed to load books.</p>'; return; }
    const books = await res.json();
    if (!books.length) {
        container.innerHTML = '<p class="no-data">No books found. Add one above.</p>';
        return;
    }
    let html = `<table>
        <thead><tr>
            <th>Title</th><th>Author</th><th>ISBN</th>
            <th>Published</th><th>Available</th><th>Actions</th>
        </tr></thead><tbody>`;
    books.forEach(b => {
        html += `<tr>
            <td>${escHtml(b.title)}</td>
            <td>${escHtml(b.author)}</td>
            <td>${escHtml(b.isbn)}</td>
            <td>${b.published_date}</td>
            <td><span class="badge ${b.available ? 'avail' : 'unavail'}">${b.available ? 'Available' : 'Unavailable'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editBook(${b.id})">Edit</button>
                <button class="btn-delete" onclick="deleteBook(${b.id})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function resetForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Book';
    document.getElementById('save-btn').textContent = 'Add Book';
    document.getElementById('cancel-btn').style.display = 'none';
    document.getElementById('form-error').textContent = '';
    document.getElementById('form-success').textContent = '';
}

async function editBook(id) {
    const res = await authFetch(API + id + '/');
    if (!res || !res.ok) return;
    const b = await res.json();
    document.getElementById('book-id').value = b.id;
    document.getElementById('title').value = b.title;
    document.getElementById('author').value = b.author;
    document.getElementById('isbn').value = b.isbn;
    document.getElementById('published_date').value = b.published_date;
    document.getElementById('available').value = b.available ? 'true' : 'false';
    document.getElementById('form-title').textContent = 'Edit Book';
    document.getElementById('save-btn').textContent = 'Update Book';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteBook(id) {
    if (!confirm('Delete this book?')) return;
    const res = await authFetch(API + id + '/', { method: 'DELETE' });
    if (!res) return;
    if (res.ok || res.status === 204) {
        loadBooks();
    } else {
        alert('Failed to delete book.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (!getAccess()) { window.location.href = '/login'; return; }

    loadBooks();

    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.clear();
        window.location.href = '/login';
    });

    document.getElementById('cancel-btn').addEventListener('click', resetForm);

    document.getElementById('book-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const errorDiv = document.getElementById('form-error');
        const successDiv = document.getElementById('form-success');
        errorDiv.textContent = '';
        successDiv.textContent = '';

        const id = document.getElementById('book-id').value;
        const payload = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            published_date: document.getElementById('published_date').value,
            available: document.getElementById('available').value === 'true',
        };

        const isEdit = !!id;
        const url = isEdit ? API + id + '/' : API;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await authFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res) return;

        if (res.ok) {
            successDiv.textContent = isEdit ? 'Book updated!' : 'Book added!';
            resetForm();
            loadBooks();
        } else {
            const err = await res.json();
            const messages = Object.values(err).flat().join(' ');
            errorDiv.textContent = messages || 'An error occurred.';
        }
    });
});