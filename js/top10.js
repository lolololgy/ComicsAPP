const PUBLIC_KEY = 'a2ef29eeed4e1cb1386d22fb3677b2d5';
const PRIVATE_KEY = '99988a19241f1775a6a81e26d4b685ecb9320e5b';
const TS = Date.now().toString();
const HASH = CryptoJS.MD5(TS + PRIVATE_KEY + PUBLIC_KEY).toString();
const API_BASE = 'https://gateway.marvel.com/v1/public/comics';

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('top10-list');
  try {
    const res = await fetch(`${API_BASE}?ts=${TS}&apikey=${PUBLIC_KEY}&hash=${HASH}&orderBy=-onsaleDate&limit=10`);
    const data = await res.json();
    data.data.results.forEach(comic => {
      const li = document.createElement('li');
      li.className = 'mdc-image-list__item';
      li.innerHTML = `
        <img class="mdc-image-list__image" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
        <div class="mdc-image-list__supporting"><span>${comic.title}</span></div>
      `;
      li.onclick = () => {
        const url = `detail.html?title=${encodeURIComponent(comic.title)}&description=${encodeURIComponent(comic.description || 'Geen beschrijving beschikbaar.')}&thumbnail=${encodeURIComponent(`${comic.thumbnail.path}.${comic.thumbnail.extension}`)}&id=${comic.id}`;
        window.location.href = url;
      };
      list.appendChild(li);
    });
  } catch {
    list.innerHTML = '<li>Kon top 10 comics niet laden.</li>';
  }
});
