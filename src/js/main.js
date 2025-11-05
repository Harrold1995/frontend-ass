// Optional: enable hover-open for desktop nav dropdown
(function () {
  const mql = window.matchMedia('(min-width: 768px)');
  const dropdown = document.querySelector('.nav-item.dropdown');
  if (!dropdown) return;

  function bindHover() {
    if (!mql.matches) return;
    const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
    const menu = dropdown.querySelector('.dropdown-menu');

    dropdown.addEventListener('mouseenter', () => {
      toggle.classList.add('show');
      menu.classList.add('show');
      menu.setAttribute('data-bs-popper', 'static');
    });
    dropdown.addEventListener('mouseleave', () => {
      toggle.classList.remove('show');
      menu.classList.remove('show');
      menu.removeAttribute('data-bs-popper');
    });
  }
  bindHover();
})();
