document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    document.getElementById('etage-num').textContent = etageNum;

    const accessKeyContainer = document.getElementById('access-key-container');
    const etageContainer = document.getElementById('chambres');

    if (etageNum !== '1') {
        accessKeyContainer.style.display = 'block';
    } else {
        generateChambres(etageNum);
        etageContainer.style.display = 'flex';
    }
});

function submitAccessKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    const accessKey = document.getElementById('access-key').value;

    fetch('/verify-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctf_id: (parseInt(etageNum) - 1) * 3, solution: accessKey })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('access-key-container').style.display = 'none';
            generateChambres(etageNum);
            document.getElementById('chambres').style.display = 'flex';
        } else {
            alert('Clé incorrecte. Veuillez réessayer.');
        }
    });
}

function generateChambres(etageNum) {
    const etageContainer = document.getElementById('chambres');
    etageContainer.innerHTML = '';  // Clear existing content

    for (let i = 1; i <= 3; i++) {
        const chambre = document.createElement('div');
        chambre.classList.add('chambre');
        chambre.setAttribute('data-chambre', i);
        //chambre.textContent = `Chambre ${i}`;

        chambre.addEventListener('click', function() {
            const chambreNum = this.getAttribute('data-chambre');
            window.location.href = `chambre.html?etage=${etageNum}&chambre=${chambreNum}`;
        });

        etageContainer.appendChild(chambre);
    }
}
