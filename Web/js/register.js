document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    // Validation côté client
    if (!/^(?=.*\d).{8,}$/.test(password)) {
        alert('Le mot de passe doit contenir au moins 8 caractères dont au moins un chiffre.');
        return;
    }

    if (password !== confirm_password) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, firstname, lastname, email, password, confirm_password })
    });

    const result = await response.text();
    alert(result);

    if (!response.ok) {
        console.error('Erreur lors de l\'inscription:', result);
    } else {
        window.location.href = 'hotel.html';
    }
});