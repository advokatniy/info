// Placeholder for future interactive features
// Sets current year in the footer
(function setCurrentYear() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    var now = new Date();
    yearEl.textContent = now.getFullYear();
  }
})();

// Example: Smooth scroll for internal links (progressive enhancement)
(function enableSmoothScroll() {
  if ('scrollBehavior' in document.documentElement.style) return; // native supported
  var links = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo(0, top);
    });
  }
})();

// Testimonials slider: prev/next + autoplay
(function testimonialsSlider() {
  var root = document.querySelector('.testimonials');
  if (!root) return;
  var track = root.querySelector('.testimonials-track');
  var cards = root.querySelectorAll('.testimonial-card');
  if (!track || cards.length === 0) return;

  var index = 0;
  var autoplayIntervalMs = 5000;
  var timerId = null;

  function goTo(i) {
    index = (i + cards.length) % cards.length;
    var width = track.clientWidth;
    track.scrollTo({ left: width * index, behavior: 'smooth' });
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    timerId = setInterval(next, autoplayIntervalMs);
  }
  function stopAutoplay() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  var btnPrev = root.querySelector('.t-prev');
  var btnNext = root.querySelector('.t-next');
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); });
  if (btnNext) btnNext.addEventListener('click', function () { next(); });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  window.addEventListener('resize', function () { goTo(index); });

  // init
  goTo(0);
  startAutoplay();
})();

// Theme toggle with persistence
(function themeToggle() {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('primary-nav');
  if (!btn) return;

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  function toggle() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    }
  }

  btn.addEventListener('click', toggle);

  // burger menu
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.matches('a')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

// Active link highlight on scroll
(function activeLinkOnScroll() {
  var links = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!links.length) return;
  var map = {};
  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) map[id] = links[i];
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var id = entry.target.id;
      var link = map[id];
      if (!link) return;
      if (entry.isIntersecting) {
        for (var key in map) { map[key].classList.remove('active'); }
        link.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.25 });

  Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
})();

// Form submit: show thank-you message
(function formSubmitMessage() {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var success = document.createElement('div');
  success.className = 'form-success';
  success.setAttribute('role', 'status');
  success.setAttribute('aria-live', 'polite');
  success.style.display = 'none';
  success.textContent = 'спасибо! ваше сообщение не отправлено.';
  form.appendChild(success);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.style.display = 'block';
    form.reset();
    setTimeout(function () { success.style.display = 'none'; }, 4000);
  });
})();
