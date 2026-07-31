const root = document.documentElement;
const themeSwitch = document.getElementById('themeSwitch');
const savedTheme = localStorage.getItem('ai-mag-theme');
if (savedTheme) { root.setAttribute('data-theme', savedTheme); }
themeSwitch.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'light');

themeSwitch.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ai-mag-theme', next);
    themeSwitch.setAttribute('aria-pressed', next === 'light');
});

const searchInput = document.getElementById('searchInput');
const cards = Array.from(document.querySelectorAll('.article-card:not(.placeholder)'));
const placeholderCard = document.querySelector('.article-card.placeholder');
const noResults = document.getElementById('noResults');
const resultCount = document.getElementById('resultCount');
const sidebarLinks = Array.from(document.querySelectorAll('.mag-sidebar a[data-title]'));

function normalize(str) { return str.toLowerCase().trim(); }

searchInput.addEventListener('input', () => {
    const q = normalize(searchInput.value);
    let visible = 0;

    cards.forEach(card => {
        const haystack = normalize((card.dataset.title || '') + ' ' + (card.dataset.tags || '') + ' ' + card.textContent);
        const match = q === '' || haystack.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    placeholderCard.style.display = q === '' ? '' : 'none';
    noResults.classList.toggle('show', visible === 0 && q !== '');
    resultCount.textContent = q === '' ? '100' : visible;

    sidebarLinks.forEach(link => {
        const match = q !== '' && normalize(link.dataset.title).includes(q);
        link.classList.toggle('is-match', match);
    });
});
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.querySelector('.mag-sidebar');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar(open) {
    sidebar.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    document.body.classList.toggle('no-scroll', open);
    hamburgerBtn.setAttribute('aria-expanded', open);
}
hamburgerBtn.addEventListener('click', () => toggleSidebar(!sidebar.classList.contains('open')));
overlay.addEventListener('click', () => toggleSidebar(false));
