document.addEventListener('DOMContentLoaded', function() {
    const access = localStorage.getItem('access');
    if (!access) {
        window.location.href = '/login';
        return;
    }
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
    });
    // Placeholder: Fetch and render CRUD data here using access token
    document.getElementById('crud-section').innerHTML = '<p>CRUD UI goes here.</p>';
});