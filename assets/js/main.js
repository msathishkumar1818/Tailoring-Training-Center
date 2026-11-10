/**
 * Tailoring Training Center - Global JavaScript
 * Handles: Branded Loader, Fixed Header, Dark Mode (#000000), RTL/LTR Persistence,
 * Click-only Home Dropdown, Mobile Menu & Accordion, Login Modal, Scroll-to-Top, Active Nav.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State: Dark Mode & RTL Persistence
  initTheme();
  initDirection();

  // 2. Branded Page Loader
  initLoader();

  // 3. Fixed Header Scroll Elevation
  initHeaderScroll();

  // 4. Click-Only Desktop Navigation Dropdown
  initDesktopDropdown();

  // 5. Mobile Drawer & Mobile Accordion
  initMobileMenu();

  // 6. Login / Register Modal
  initAuthModal();

  // 7. Scroll to Top
  initScrollToTop();

  // 8. Active Link Highlighting
  highlightActiveNav();

  // 9. Craft Gallery Pagination
  initCraftPagination();
});

/* --- 1. Theme (Dark Mode: #000000) --- */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Bind all dark mode toggle buttons (desktop & mobile)
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeAria(isDark);
    });
  });

  updateThemeAria(document.documentElement.classList.contains('dark'));
}

function updateThemeAria(isDark) {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
}

/* --- 2. Direction (RTL / LTR) --- */
function initDirection() {
  const savedDir = localStorage.getItem('site_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  dirToggles.forEach(btn => {
    btn.textContent = savedDir === 'rtl' ? 'LTR' : 'RTL';
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('site_dir', newDir);
      dirToggles.forEach(b => {
        b.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
      });
    });
  });
}

/* --- 3. Page Loader --- */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 450);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Safety fallback: Dismiss loader after 2.5s maximum to prevent hanging
    setTimeout(hideLoader, 2500);
  }
}

/* --- 4. Fixed Header Scroll Observer --- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- 5. Desktop Dropdown (STRICT CLICK ONLY - NEVER HOVER) --- */
function initDesktopDropdown() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = item.classList.contains('dropdown-open');
      
      // Close all dropdowns first
      dropdownItems.forEach(other => other.classList.remove('dropdown-open'));
      
      if (!isOpen) {
        item.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(item => {
        item.classList.remove('dropdown-open');
        const trigger = item.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => {
        item.classList.remove('dropdown-open');
        const trigger = item.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* --- 6. Mobile Menu & Accordion --- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle-btn');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const accordionTrigger = document.querySelector('.mobile-accordion-trigger');
  const accordion = document.querySelector('.mobile-accordion');

  const openDrawer = () => {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Ensure mobile accordion stays closed by default
    if (accordion) {
      accordion.classList.remove('open');
      if (accordionTrigger) accordionTrigger.setAttribute('aria-expanded', 'false');
    }
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });
  }

  // Ensure accordion starts closed
  if (accordion) {
    accordion.classList.remove('open');
    if (accordionTrigger) accordionTrigger.setAttribute('aria-expanded', 'false');
  }

  // Mobile Accordion Toggle (Click Only)
  if (accordionTrigger && accordion) {
    accordionTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      accordion.classList.toggle('open');
      const isExpanded = accordion.classList.contains('open');
      accordionTrigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  }

  // Close mobile drawer when ANY navigation link is clicked
  const navLinks = document.querySelectorAll('.mobile-drawer a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Auto-close drawer on desktop viewport resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1032) {
      closeDrawer();
    }
  }, { passive: true });
}

/* --- 7. Login / Register Modal --- */
function initAuthModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  const openButtons = document.querySelectorAll('.btn-login, [data-open-modal="auth"]');
  const closeButton = document.querySelector('.modal-close-btn');
  const tabButtons = document.querySelectorAll('.auth-tab-btn');
  const forms = {
    login: document.getElementById('login-form'),
    register: document.getElementById('register-form')
  };

  const openModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstInput = modalOverlay.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Tab switching between Login and Register
  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      tabButtons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetForm = tab.getAttribute('data-tab');
      if (forms.login && forms.register) {
        if (targetForm === 'register') {
          forms.login.classList.add('hidden');
          forms.register.classList.remove('hidden');
        } else {
          forms.login.classList.remove('hidden');
          forms.register.classList.add('hidden');
        }
      }
    });
  });
}

/* --- 8. Scroll to Top --- */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- 9. Active Nav Highlighting --- */
function highlightActiveNav() {
  let currentPath = window.location.pathname.split('/').pop();
  if (!currentPath || currentPath === '') currentPath = 'index.html';

  const allNavLinks = document.querySelectorAll('.desktop-nav .nav-link, .desktop-nav .dropdown-link, .mobile-drawer .mobile-nav-link, .mobile-drawer .mobile-sub-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
      
      // If it's a dropdown link, also mark parent trigger
      const dropdownParent = link.closest('.has-dropdown');
      if (dropdownParent) {
        const trigger = dropdownParent.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.classList.add('active');
      }

      // If it's a mobile accordion sub-link, also mark mobile accordion trigger
      const accordionParent = link.closest('.mobile-accordion');
      if (accordionParent) {
        const mobileTrigger = accordionParent.querySelector('.mobile-accordion-trigger');
        if (mobileTrigger) mobileTrigger.classList.add('active');
      }
    }
  });

  // Explicit Home active support for both Home 1 & Home 2
  if (currentPath === 'index.html' || currentPath === 'home-2.html') {
    const desktopHomeTrigger = document.querySelector('.nav-dropdown-trigger');
    if (desktopHomeTrigger) desktopHomeTrigger.classList.add('active');
    const mobileHomeTrigger = document.querySelector('.mobile-accordion-trigger');
    if (mobileHomeTrigger) mobileHomeTrigger.classList.add('active');
  }
}

/* --- 10. Craft Gallery Pagination --- */
function initCraftPagination() {
  const pagination = document.querySelector('.bts-pagination');
  if (!pagination) return;

  const pageNums = pagination.querySelectorAll('.bts-page-num');
  const prevBtn = pagination.querySelector('.bts-page-prev');
  const nextBtn = pagination.querySelector('.bts-page-next');
  const cards = document.querySelectorAll('.bts-photo-card[data-page]');
  const btsSection = document.querySelector('.bts-craft-section');
  let currentPage = 1;
  const totalPages = pageNums.length;

  function updatePage(newPage, shouldScroll) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;

    // Toggle cards visibility (4 items per page)
    cards.forEach(card => {
      const page = card.getAttribute('data-page');
      if (page === String(currentPage)) {
        card.classList.remove('bts-card-hidden');
        card.classList.add('bts-card-visible');
      } else {
        card.classList.remove('bts-card-visible');
        card.classList.add('bts-card-hidden');
      }
    });

    // Update pagination button active state
    pageNums.forEach((btn, index) => {
      if (index + 1 === currentPage) {
        btn.classList.add('bts-page-active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('bts-page-active');
        btn.removeAttribute('aria-current');
      }
    });

    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages);

    // Scroll to section head smoothly on page click if needed
    if (shouldScroll && btsSection) {
      btsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  pageNums.forEach((btn, index) => {
    btn.addEventListener('click', () => updatePage(index + 1, true));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updatePage(currentPage - 1, true));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updatePage(currentPage + 1, true));
  }

  // Initialize first page
  updatePage(1, false);
}


