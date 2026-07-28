// ===== Banner links: where each slide sends the visitor =====
const BANNER_LINKS = [
  'https://eitaa.com/najafabad_admin',      // تبلیغ کسب‌وکار -> هماهنگی تبلیغات
  'https://bioolink.ir/maheryab',           // همکاری رسانه‌ای -> صفحه ماهریاب
  'https://eitaa.com/Najafabad_admin'       // ارسال خبر -> ادمین ایتا
];

document.addEventListener('DOMContentLoaded', () => {
  // ===== Theme toggle (light / dark) =====
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });

  // Attach click-through links to each banner slide
  const slides = document.querySelectorAll('.banner-slide');
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const url = BANNER_LINKS[i] || BANNER_LINKS[0];
      window.open(url, '_blank', 'noopener');
    });
    slide.setAttribute('role', 'link');
    slide.setAttribute('tabindex', '0');
    slide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        slide.click();
      }
    });
  });

  // Init Swiper for the mid-page banner slider
  if (window.Swiper) {
    new Swiper('.banner-swiper', {
      loop: true,
      speed: 700,
      autoplay: { delay: 4200, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      a11y: { enabled: true }
    });
  }
});
