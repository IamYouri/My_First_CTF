document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    const chambreNum = urlParams.get('chambre');

    document.getElementById('etage-num').textContent = etageNum;
    document.getElementById('chambre-num').textContent = chambreNum;
    document.getElementById('chambre-num-detail').textContent = chambreNum;
    document.getElementById('etage-num-detail').textContent = etageNum;

    let username;

    fetch('/get-username')
        .then(response => response.json())
        .then(data => {
            username = data.username;
            console.log('Username fetched:', username);
            checkRoomAccess(username, etageNum, chambreNum);
        })
        .catch(error => console.error('Error:', error));

    function checkRoomAccess(username, etageNum, chambreNum) {
        fetch(`/check-ctfs?userId=${username}&etageNum=${etageNum}&chambreNum=${chambreNum}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    alert(data.message);
                    window.location.href = 'hotel.html'; // Rediriger vers l'accueil de l'hôtel
                } else {
                    loadRoomContent(etageNum, chambreNum);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function loadRoomContent(etageNum, chambreNum) {
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
        
        if (etageNum === '1' && chambreNum === '1') {
            document.getElementById('security-container').style.display = 'block';
            document.getElementById('security-id-container').style.display = 'block';
        }
    
        if (etageNum === '1' && chambreNum === '2') {
            document.getElementById('chambre1_avant-container').style.display = 'block';
            document.getElementById('code-container').style.display = 'block';
        }
    
        if (etageNum === '1' && chambreNum === '3') {
            document.getElementById('chambre3-container').style.display = 'block';
            document.getElementById('string-container').style.display = 'block';
        }
    
        if (etageNum === '2') {
            if (chambreNum === '1') {
                document.getElementById('chambre1_etage2-container').style.display = 'block';
            } else if (chambreNum === '2') {
                document.getElementById('chambre2_etage2-container').style.display = 'block';   
            } else if (chambreNum === '3') {
                document.getElementById('chambre3_etage2-container').style.display = 'block';
            }
            document.getElementById('string-container').style.display = 'block';
        }
    
        if (etageNum === '3') {
            if (chambreNum === '1') {
                document.getElementById('chambre1_etage3-container').style.display = 'block';
            } else if (chambreNum === '2') {
                document.getElementById('chambre2_etage3-container').style.display = 'block';   
            } else if (chambreNum === '3') {
                document.getElementById('chambre3_etage3-container').style.display = 'block';
            }
            document.getElementById('string-container').style.display = 'block';
        }
    
        if (etageNum === '4') {
            if (chambreNum === '1') {
                document.getElementById('chambre2_etage4-container').style.display = 'block';
            } else if (chambreNum === '2') {
                document.getElementById('chambre1_etage4-container').style.display = 'block';   
            } else if (chambreNum === '3') {
                document.getElementById('chambre3_etage4-container').style.display = 'block';
            }
            document.getElementById('string-container').style.display = 'block';
        }
    
        if (etageNum === '5') {
            if (chambreNum === '1') {
                document.getElementById('chambre1_etage5-container').style.display = 'block';
            } else if (chambreNum === '2') {
                document.getElementById('chambre2_etage5-container').style.display = 'block';   
            } else if (chambreNum === '3') {
                document.getElementById('chambre3_etage5-container').style.display = 'block';
            }
            document.getElementById('string-container').style.display = 'block';
        }

        // Gérer les boutons de navigation
        const prevRoom = document.getElementById('prev-room');
        const nextRoom = document.getElementById('next-room');

        if (parseInt(chambreNum) > 1) {
            prevRoom.addEventListener('click', () => {
                checkAccess(etageNum, parseInt(chambreNum) - 1, username);
            });
        } else {
            prevRoom.disabled = true;
        }

        if (parseInt(chambreNum) < 3) {
            nextRoom.addEventListener('click', () => {
                checkAccess(etageNum, parseInt(chambreNum) + 1, username);
            });
        } else {
            nextRoom.disabled = true;
        }
    }
});

function checkAccess(etageNum, chambreNum, username) {
    fetch(`/check-ctfs?userId=${username}&etageNum=${etageNum}&chambreNum=${chambreNum}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `chambre.html?etage=${etageNum}&chambre=${chambreNum}`;
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

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
            document.getElementById('hall-container').style.display = 'block';
            document.getElementById('security-id-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('security-image').style.display = 'none';
            addResolvedCtf(1);
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
            document.getElementById('chambre1_apres-container').style.display = 'block';
            document.getElementById('code-container').style.display = 'none';
            document.getElementById('final-message').style.display = 'block';
            document.getElementById('chambre1_avant-container').style.display = 'none';
            addResolvedCtf(2);
        }
    });
}

function addResolvedCtf(ctf_id) {
    fetch('/get-username')
        .then(response => response.json())
        .then(data => {
            const username = data.username;
            fetch('/add-resolved-ctf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usr_id: username, ctf_id })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data successfully added to the database:', data);
            })
            .catch(error => console.error('Error adding data to the database:', error));
        })
        .catch(error => console.error('Error fetching username:', error));
}

function submitSecurityString() {
    const securityString = document.getElementById('security-string').value;

    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = parseInt(urlParams.get('etage'));
    const chambreNum = parseInt(urlParams.get('chambre'));

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
            addResolvedCtf(ctf_id);
            handleRoomTransition(etageNum, chambreNum, securityString);
        } else {
            alert('Chaîne incorrecte. Veuillez réessayer.');
        }
    });
}

function handleRoomTransition(etageNum, chambreNum, securityString) {
    if (etageNum === 2) {
        if (chambreNum === 1) {
            showNextRoomMessage(2, 2);
        } else if (chambreNum === 2) {
            showNextRoomMessage(2, 3);
        } else if (chambreNum === 3) {
            showNextLevelMessage(3, securityString);
        }
    } else if (etageNum === 3) {
        if (chambreNum === 1) {
            showNextRoomMessage(3, 2);
        } else if (chambreNum === 2) {
            showNextRoomMessage(3, 3);
        } else if (chambreNum === 3) {
            showNextLevelMessage(4, securityString);
        }
    } else if (etageNum === 4) {
        if (chambreNum === 1) {
            showNextRoomMessage(4, 2);
        } else if (chambreNum === 2) {
            showNextRoomMessage(4, 3);
        } else if (chambreNum === 3) {
            showNextLevelMessage(5, securityString);
        }
    }else if (etageNum === 5) {
        if (chambreNum === 1) {
            showNextRoomMessage(5, 2);
        } else if (chambreNum === 2) {
            showNextRoomMessage(5, 3);
        } else if (chambreNum === 3) {
            document.getElementById('next-level-message').style.display = 'block';
            document.getElementById('next-level-message').innerHTML = `
                <p>Félicitations ! Vous pouvez maintenant accéder à la salle du trésor</p>
                
            `;
        }
    }else{
        showNextLevelMessage(2, securityString);
    }
}

function showNextRoomMessage(etage, chambre) {
    document.getElementById('final-message').style.display = 'block';
    document.getElementById('final-message').innerHTML = `
        <p>Maintenant vous pouvez accéder à la chambre suivante.</p>
        <button onclick="goToRoom('chambre.html?etage=${etage}&chambre=${chambre}')">Aller à la chambre ${chambre}, étage ${etage}</button>
    `;
}

function showNextLevelMessage(etage, securityString) {
    document.getElementById('next-level-message').style.display = 'block';
    document.getElementById('next-level-message').innerHTML = `
        <p>Félicitations ! Vous pouvez maintenant accéder à l'étage suivant.</p>
        <button onclick="goToRoom('etage.html?etage=${etage}')">Aller à l'étage ${etage}</button>
    `;
    alert('Chaîne de caractère pour passer à l\'étage suivant: ' + securityString);
}



function goToRoom(url) {
    window.location.href = url;
}

function startGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    const chambreNum = urlParams.get('chambre');

    fetch(`/start-game?floor=${etageNum}&room=${chambreNum}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert(`User: ${data.usr_pseudo}, CTF ID: ${data.ctf_id}`);
                // Further logic can be added here
            } else {
                alert('Error starting the game.');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error starting the game.');
        });
}
