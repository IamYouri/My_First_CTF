document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    document.getElementById('etage-num').textContent = etageNum;

    const etageContainer = document.getElementById('chambres');

    for (let i = 1; i <= 3; i++) {
        const chambre = document.createElement('div');
        chambre.classList.add('chambre');
        chambre.setAttribute('data-chambre', i);

        chambre.addEventListener('click', function() {
            const chambreNum = this.getAttribute('data-chambre');
            window.location.href = `chambre.html?etage=${etageNum}&chambre=${chambreNum}`;
        });

        etageContainer.appendChild(chambre);
    }
});
