
// // Header scroll state
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
document.addEventListener('scroll', onScroll, { passive: true });
// onScroll();

// // Mobile nav
// const nav = document.getElementById('siteNav');
// const navToggle = document.getElementById('navToggle');
// const navClose = document.getElementById('navClose');
// function openNav() { nav.classList.add('is-open'); navToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
// function closeNav() { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
// navToggle.addEventListener('click', openNav);
// navClose.addEventListener('click', closeNav);
// nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('is-visible'));
}

// Screenshots slider arrows
const track = document.getElementById('screensTrack');
const scrollAmount = () => (track.querySelector('.screen-item')?.offsetWidth || 250) + 26;
document.getElementById('screenNext').addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
document.getElementById('screenPrev').addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
