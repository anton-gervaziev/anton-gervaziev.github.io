// Shared JS — scroll spy + mobile menu + theme toggle
(function () {
  // Apply saved theme immediately (backup for <head> inline script)
  var saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.dataset.theme = 'light';

  function initScrollSpy() {
    var isDetail = !!document.querySelector('.proj-nav');
    var sectionSelector = isDetail
      ? '.proj-hero[id], .pd-section[id]'
      : 'section[id], .hero[id]';
    var navSelector = isDetail
      ? '.proj-nav a[href^="#"]'
      : '.sb-nav a[href^="#"]';

    function update() {
      var sections = document.querySelectorAll(sectionSelector);
      var current = '';
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= 150) current = s.getAttribute('id');
      });
      document.querySelectorAll(navSelector).forEach(function (a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    }

    window.addEventListener('scroll', update);
    update();
  }

  function initMobileMenu() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var menuBtn = document.querySelector('.mh-menu');
    var closeBtn = document.querySelector('.sb-close');

    function open() {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    }

    function close() {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }

    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.addEventListener('click', function () {
        var isOpen = sidebar.classList.contains('open');
        isOpen ? close() : open();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) close();
    });
  }

  function initThemeToggle() {
    var toggles = document.querySelectorAll('.theme-toggle');
    var announce = document.getElementById('theme-announce');

    function isLight() {
      return document.documentElement.dataset.theme === 'light';
    }

    function updateLabels() {
      var label = isLight() ? 'Dark' : 'Light';
      var ariaLabel = isLight() ? 'Switch to dark mode' : 'Switch to light mode';
      toggles.forEach(function (btn) {
        btn.textContent = label;
        btn.setAttribute('aria-label', ariaLabel);
      });
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.documentElement.classList.add('theme-switching');

        if (isLight()) {
          delete document.documentElement.dataset.theme;
          localStorage.removeItem('theme');
          if (announce) announce.textContent = 'Switched to dark mode';
        } else {
          document.documentElement.dataset.theme = 'light';
          localStorage.setItem('theme', 'light');
          if (announce) announce.textContent = 'Switched to light mode';
        }

        updateLabels();

        setTimeout(function () {
          document.documentElement.classList.remove('theme-switching');
        }, 350);
      });
    });

    updateLabels();

    // First visit per session: glow the theme toggle twice after a short delay
    (function () {
      if (sessionStorage.getItem('theme-intro')) return;
      sessionStorage.setItem('theme-intro', '1');

      var target = window.innerWidth > 960
        ? document.querySelector('.sb-theme')
        : document.querySelector('.mh-theme');
      if (!target) return;

      setTimeout(function () {
        target.classList.add('glow');
        target.addEventListener('animationend', function h() {
          target.classList.remove('glow');
          target.removeEventListener('animationend', h);
        });
      }, 800);
    })();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollSpy();
    initMobileMenu();
    initThemeToggle();
  });
})();
