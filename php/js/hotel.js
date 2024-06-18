document.addEventListener('DOMContentLoaded', () => {
    const hotelContainer = document.getElementById('hotel');

    for (let i = 5; i >= 1; i--) {
        const etage = document.createElement('div');
        etage.classList.add('etage');
        etage.setAttribute('data-etage', i);

        for (let j = 1; j <= 3; j++) {
            const fenetre = document.createElement('div');
            fenetre.classList.add('fenetre');
            etage.appendChild(fenetre);
        }

        etage.addEventListener('click', function() {
            const etageNum = this.getAttribute('data-etage');
            window.location.href = `etage.html?etage=${etageNum}`;
        });

        hotelContainer.appendChild(etage);
    }
});
