document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        list.innerHTML = '<p>Geen favorieten gevonden.</p>';
    } else {
        favorites.forEach(comic => {
            const li = document.createElement('li');
            li.className = 'mdc-image-list__item';
            li.innerHTML = `
                <img class="mdc-image-list__image" src="${comic.thumbnail}" alt="${comic.title}">
                <div class="mdc-image-list__supporting"><span>${comic.title}</span></div>
            `;
            li.onclick = () => {
                const url = `detail.html?title=${encodeURIComponent(comic.title)}&description=${encodeURIComponent(comic.description)}&thumbnail=${encodeURIComponent(comic.thumbnail)}&id=${comic.id}`;
                window.location.href = url;
            };
            list.appendChild(li);
        });
    }
});
