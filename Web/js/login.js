document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        console.log('Response from server:', result);

        if (response.ok) {
            console.log('Connexion réussie, redirection vers', result.redirect);
            document.cookie = `session_id=${result.session_id}; path=/`; // Enregistrement du cookie
            window.location.href = result.redirect; // Redirection après connexion
        } else {
            console.log('Erreur lors de la connexion:', result.message);
            alert(result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
});
