document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const etageNum = urlParams.get('etage');
    const chambreNum = urlParams.get('chambre');

    document.getElementById('etage-num').textContent = etageNum;
    document.getElementById('chambre-num').textContent = chambreNum;
    document.getElementById('chambre-num-detail').textContent = chambreNum;
    document.getElementById('etage-num-detail').textContent = etageNum;
});
