function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Déconnexion réussie') {
            window.location.href = '/login';
        } else {
            alert('Erreur lors de la déconnexion.');
        }
    })
    .catch(error => console.error('Erreur:', error));
}