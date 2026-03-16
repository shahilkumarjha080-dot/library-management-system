document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
});
// You can add dashboard-specific JS here.