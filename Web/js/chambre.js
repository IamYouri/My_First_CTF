document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    const chambreNum = urlParams.get('chambre');

    document.getElementById('etage-num').textContent = etageNum;
    document.getElementById('chambre-num').textContent = chambreNum;
    document.getElementById('chambre-num-detail').textContent = chambreNum;
    document.getElementById('etage-num-detail').textContent = etageNum;

    // Charger toutes les solutions CTF
    fetch('/ctf-solutions')
        .then(response => response.json())
        .then(solutions => {
            window.ctfSolutions = solutions;
        });

    // Afficher l'agent de sécurité et le champ de saisie uniquement dans la chambre 2 de l'étage 1
    if (etageNum === '1' && chambreNum === '2') {
        document.getElementById('security-container').style.display = 'block';
        document.getElementById('security-id-container').style.display = 'block';
    }

    // Afficher directement le hall et le champ de saisie du code dans la chambre 1 de l'étage 1
    if (etageNum === '1' && chambreNum === '1') {
        document.getElementById('hall-container').style.display = 'block';
        document.getElementById('code-container').style.display = 'block';
    }

    // Afficher directement la chambre 3 et le champ de saisie de la chaîne dans la chambre 3 de l'étage 1
    if (etageNum === '1' && chambreNum === '3') {
        document.getElementById('chambre3-container').style.display = 'block';
        document.getElementById('string-container').style.display = 'block';
    }

    // Gérer les boutons de navigation
    const prevRoom = document.getElementById('prev-room');
    const nextRoom = document.getElementById('next-room');

    if (parseInt(chambreNum) > 1) {
        prevRoom.addEventListener('click', () => {
            window.location.href = `chambre.html?etage=${etageNum}&chambre=${parseInt(chambreNum) - 1}`;
        });
    } else {
        prevRoom.disabled = true;
    }

    if (parseInt(chambreNum) < 3) {
        nextRoom.addEventListener('click', () => {
            window.location.href = `chambre.html?etage=${etageNum}&chambre=${parseInt(chambreNum) + 1}`;
        });
    } else {
        nextRoom.disabled = true;
    }
});

function submitSecurityId() {
    const securityId = document.getElementById('security-id').value;
    const ctfSolution = window.ctfSolutions.find(ctf => ctf.ctf_id === 1);

    fetch('/verify-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctf_id: 1, solution: securityId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('security-id-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        } else {
            alert('Identifiant incorrect. Veuillez réessayer.');
        }
    });
}

function submitSecurityCode() {
    const securityCode = document.getElementById('security-code').value;
    const ctfSolution = window.ctfSolutions.find(ctf => ctf.ctf_id === 2);

    fetch('/verify-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctf_id: 2, solution: securityCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('code-container').style.display = 'none';
            document.getElementById('final-message').style.display = 'block';
        } else {
            alert('Code incorrect. Veuillez réessayer.');
        }
    });
}

function submitSecurityString() {
    const securityString = document.getElementById('security-string').value;
    const ctfSolution = window.ctfSolutions.find(ctf => ctf.ctf_id === 3);

    fetch('/verify-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctf_id: 3, solution: securityString })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('string-container').style.display = 'none';
            document.getElementById('next-level-message').style.display = 'block';
            alert('Chaîne de caractère pour passer au deuxième étage: ' + securityString);
        } else {
            alert('Chaîne incorrecte. Veuillez réessayer.');
        }
    });
}

function goToRoom(url) {
    window.location.href = url;
}
