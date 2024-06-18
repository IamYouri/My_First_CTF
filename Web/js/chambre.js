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

    // Charger l'histoire pour la chambre actuelle
    fetch('/stories.json')
        .then(response => response.json())
        .then(stories => {
            const story = stories[`etage_${etageNum}`][`chambre_${chambreNum}`];
            document.getElementById('story-text').textContent = story;
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

    // Afficher directement le champ de saisie de la chaîne dans les chambres de l'étage 2
    if (etageNum === '2') {
        if (chambreNum === '1') {
            document.getElementById('chambre1_etage2-container').style.display = 'block';
        }else if (chambreNum === '2') {
            document.getElementById('chambre2_etage2-container').style.display = 'block';   
        }else if (chambreNum === '3') {
            document.getElementById('chambre3_etage2-container').style.display = 'block';
        }
        document.getElementById('string-container').style.display = 'block';
    }

     // Afficher directement le champ de saisie de la chaîne dans les chambres de l'étage 2
     if (etageNum === '3') {
        if (chambreNum === '1') {
            document.getElementById('chambre1_etage3-container').style.display = 'block';
        }else if (chambreNum === '2') {
            document.getElementById('chambre2_etage3-container').style.display = 'block';   
        }else if (chambreNum === '3') {
            document.getElementById('chambre3_etage3-container').style.display = 'block';
        }
        document.getElementById('string-container').style.display = 'block';
    }

    if (etageNum === '4') {
        if (chambreNum === '1') {
            document.getElementById('chambre1_etage4-container').style.display = 'block';
        }else if (chambreNum === '2') {
            document.getElementById('chambre2_etage4-container').style.display = 'block';   
        }else if (chambreNum === '3') {
            document.getElementById('chambre3_etage4-container').style.display = 'block';
        }
        document.getElementById('string-container').style.display = 'block';
    }

    if (etageNum === '5') {
        if (chambreNum === '1') {
            document.getElementById('chambre1_etage5-container').style.display = 'block';
        }else if (chambreNum === '2') {
            document.getElementById('chambre2_etage5-container').style.display = 'block';   
        }else if (chambreNum === '3') {
            document.getElementById('chambre3_etage5-container').style.display = 'block';
        }
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
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = parseInt(urlParams.get('etage'));
    const chambreNum = parseInt(urlParams.get('chambre'));

    // Calculer l'ID CTF pour chaque chambre
    const ctf_id = (etageNum - 1) * 3 + chambreNum;

    fetch('/verify-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctf_id, solution: securityString })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('string-container').style.display = 'none';
            if (etageNum === 2) {
                if (chambreNum === 1) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=2&chambre=2')">Aller à la chambre 2, étage 2</button>
                    `;
                } else if (chambreNum === 2) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=2&chambre=3')">Aller à la chambre 3, étage 2</button>
                    `;
                } else if (chambreNum === 3) {
                    document.getElementById('next-level-message').style.display = 'block';
                    document.getElementById('next-level-message').innerHTML = `
                        <p>Félicitations ! Vous pouvez maintenant accéder à l'étage suivant.</p>
                        <button onclick="goToRoom('etage.html?etage=3')">Aller à l'étage 3</button>
                    `;
                    alert('Chaîne de caractère pour passer à l\'étage suivant: ' + securityString);
                }
            } 
            if (etageNum === 3) {
                if (chambreNum === 1) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=3&chambre=2')">Aller à la chambre 2, étage 3</button>
                    `;
                } else if (chambreNum === 2) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=3&chambre=3')">Aller à la chambre 3, étage 3</button>
                    `;
                } else if (chambreNum === 3) {
                    document.getElementById('next-level-message').style.display = 'block';
                    document.getElementById('next-level-message').innerHTML = `
                        <p>Félicitations ! Vous pouvez maintenant accéder à l'étage suivant.</p>
                        <button onclick="goToRoom('etage.html?etage=4')">Aller à l'étage 4</button>
                    `;
                    alert('Chaîne de caractère pour passer à l\'étage suivant: ' + securityString);
                }
            }
            if (etageNum === 4) {
                if (chambreNum === 1) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=4&chambre=3')">Aller à la chambre 3, étage 4</button>
                    `;
                } else if (chambreNum === 2) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=4&chambre=1')">Aller à la chambre 1, étage 4</button>
                    `;
                } else if (chambreNum === 3) {
                    document.getElementById('next-level-message').style.display = 'block';
                    document.getElementById('next-level-message').innerHTML = `
                        <p>Félicitations ! Vous pouvez maintenant accéder à l'étage suivant.</p>
                        <button onclick="goToRoom('etage.html?etage=5')">Aller à l'étage 5</button>
                    `;
                    alert('Chaîne de caractère pour passer à l\'étage suivant: ' + securityString);
                }
            }
            if (etageNum === 5) {
                if (chambreNum === 1) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=5&chambre=2')">Aller à la chambre 2, étage 5</button>
                    `;
                } else if (chambreNum === 2) {
                    document.getElementById('final-message').style.display = 'block';
                    document.getElementById('final-message').innerHTML = `
                        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
                        <button onclick="goToRoom('chambre.html?etage=5&chambre=3')">Aller à la chambre 3, étage 5</button>
                    `;
                } else if (chambreNum === 3) {
                    document.getElementById('next-level-message').style.display = 'block';
                    document.getElementById('next-level-message').innerHTML = `
                        <p>Félicitations ! Vous pouvez maintenant accéder à la salle du trésor</p>
                    `;
                }
            } 
            else {
                document.getElementById('next-level-message').style.display = 'block';
            }
        } else {
            alert('Chaîne incorrecte. Veuillez réessayer.');
        }
    });
}



function goToRoom(url) {
    window.location.href = url;
}
