(() => {
    const S = window.SITE, $ = (s, r = document) => r.querySelector(s);

    // آیکون ذرت خطی (در Lucide موجود نیست)
    const cornIcon = `<svg viewBox="0 0 48 52" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M26 4c7 1 11 10 10 22s-6 18-12 18S12 36 13 24 19 3 26 4Z"/><path d="M19 12l14 6M17 20l17 7M16 28l16 7M19 36l11 5M25 5v38"/><path d="M24 48c-8 0-13-5-15-12 5 1 9 4 11 8M25 48c8 0 12-6 13-14-5 2-8 5-10 9"/></svg>`;

    // ویژگی‌ها
    $('#features').innerHTML = S.features.map(f => `
    <li class="feat">
      <span class="feat__icon">${f.icon === 'corn' ? cornIcon : `<i data-lucide="${f.icon}"></i>`}</span>
      <strong>${f.title}</strong><span>${f.text}</span>
    </li>`).join('');

    // محصولات
    const slider = $('#slider'), dots = $('#dots');
    slider.innerHTML = S.products.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.alt}" loading="lazy" width="864" height="428">
      <span class="card__label">${p.name}</span>
    </article>`).join('');
    dots.innerHTML = S.products.map(() => '<i></i>').join('');
    const cards = [...slider.children], dotEls = [...dots.children];
    const updateDots = () => {
        const c = slider.getBoundingClientRect(), mid = c.left + c.width / 2;
        let best = 0, bd = 1e9;
        cards.forEach((el, i) => { const r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
        dotEls.forEach((d, i) => d.classList.toggle('on', i === best));
    };
    slider.addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });
    slider.addEventListener('keydown', e => {
        const dir = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0; // RTL
        if (dir) slider.scrollBy({ left: dir * -cards[0].offsetWidth, behavior: 'smooth' });
    });
    updateDots();

    // تماس و آدرس
    $('#callBtn').href = S.contact.phoneHref;
    $('#phoneText').textContent = S.contact.phoneDisplay;
    $('#addrTitle').textContent = S.address.title;
    $('#addrText').textContent = S.address.text;
    $('#mapBtn').href = S.address.mapUrl;

    document.querySelectorAll('[data-map]').forEach(a => { a.href = S.address.mapUrl; a.target = '_blank'; a.rel = 'noopener'; });

    // منوی موبایل
    const burger = $('#burger'), nav = $('#nav'), header = $('.header');
    const setMenu = open => { burger.setAttribute('aria-expanded', open); header.classList.toggle('menu-open', open); };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    // لینک فعال
    const links = [...nav.querySelectorAll('a')];
    const io = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.dataset.spy === en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['home', 'about', 'menu', 'contact'].forEach(id => io.observe(document.getElementById(id)));

    lucide.createIcons();
})();
