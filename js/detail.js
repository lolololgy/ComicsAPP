document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const comic = {
    id: params.get('id'),
    title: params.get('title'),
    description: params.get('description'),
    thumbnail: params.get('thumbnail')
  };

  const container = document.getElementById('details-container');
  const favButton = document.getElementById('favorite-button');

  container.innerHTML = `
    <h3>${comic.title}</h3>
    <img src="${comic.thumbnail}" alt="${comic.title}" style="width:100%;">
    <p>${comic.description}</p>
  `;

  function updateButton() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = favorites.some(f => f.id === comic.id);
    favButton.textContent = isFav ? '❌ Verwijder uit favorieten' : '⭐ Toevoegen aan favorieten';
  }

  favButton.addEventListener('click', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === comic.id);
    if (index === -1) {
      favorites.push(comic);
      alert('Toegevoegd aan favorieten!');
    } else {
      favorites.splice(index, 1);
      alert('Verwijderd uit favorieten.');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateButton();
  });

  document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  updateButton(); // Initial state
});
