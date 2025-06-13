const PUBLIC_KEY = 'a2ef29eeed4e1cb1386d22fb3677b2d5';
const PRIVATE_KEY = '99988a19241f1775a6a81e26d4b685ecb9320e5b';
const API_BASE = 'https://gateway.marvel.com/v1/public/comics';
const TS = Date.now().toString();
const HASH = CryptoJS.MD5(TS + PRIVATE_KEY + PUBLIC_KEY).toString();

document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('drawer');
  const menuButton = document.getElementById('menu-button');
  const shareButton = document.getElementById('share-button');
  const tabs = document.querySelectorAll('.tab');
  const searchInput = document.getElementById('search');
  const comicsList = document.getElementById('comics-list');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  document.querySelector('header h1').addEventListener('click', () => showPage('comics'));

  menuButton.addEventListener('click', () => {
    drawer.classList.toggle('open');
    overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && e.target !== menuButton) {
      drawer.classList.remove('open');
      overlay.style.display = 'none';
    }
  });

  overlay.addEventListener('click', () => {
    drawer.classList.remove('open');
    overlay.style.display = 'none';
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showPage(tab.dataset.page);
    });
  });

  function showPage(page) {
    document.querySelectorAll('main > section').forEach(section => {
      section.style.display = section.id === page ? 'block' : 'none';
    });
    page === 'comics' ? loadComics() : loadFavorites?.();
  }

  let page = 0;
  let loading = false;

  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) && !loading) {
      loading = true;
      loadComics(searchInput.value, true);
    }
  });

  async function loadComics(query = '', append = false) {
    if (!append) comicsList.innerHTML = '<li>Loading...</li>';
    const offset = page * 20;
    let url = `${API_BASE}?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}&limit=20&offset=${offset}`;
    if (query) url += `&titleStartsWith=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      showComics(data.data.results, append);
      page++;
      loading = false;
    } catch {
      comicsList.innerHTML = '<li>Failed to load comics.</li>';
    }
  }

  function showComics(comics, append = false) {
    if (!append) comicsList.innerHTML = '';
    comics.forEach(comic => {
      const li = document.createElement('li');
      li.className = 'mdc-image-list__item';
      li.onclick = () => {
        const url = `detail.html?title=${encodeURIComponent(comic.title)}&description=${encodeURIComponent(comic.description || 'Geen beschrijving beschikbaar.')}&thumbnail=${encodeURIComponent(`${comic.thumbnail.path}.${comic.thumbnail.extension}`)}&id=${comic.id}`;
        window.location.href = url;
      };
      li.innerHTML = `
        <img class="mdc-image-list__image" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
        <div class="mdc-image-list__supporting"><span>${comic.title}</span></div>
      `;
      comicsList.appendChild(li);
    });
  }

  searchInput.addEventListener('input', () => loadComics(searchInput.value));

  shareButton?.addEventListener('click', async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Marvel PWA',
        text: 'Bekijk deze coole Marvel app!',
        url: window.location.href
      });
    } else {
      alert('Delen wordt niet ondersteund op dit apparaat.');
    }
  });

  showPage('comics');
});
