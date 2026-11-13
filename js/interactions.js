/**
 * FLOWSPACE — UI Interactions & Form Handling
 * Vanilla JavaScript Implementation
 */

export function initInteractions() {
  initStickyHeader();
  initMobileNavigation();
  initSmoothScroll();
  initScrollSpy();
  initInteractiveDashboard();
  initPricingButtons();
  initContactForm();
}

/**
 * 01. Sticky Header scroll state
 */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 02. Mobile Navigation Drawer & Keyboard Accessibility
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggleBtn || !mobileNav) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    mobileNav.style.display = 'block';
    // Allow display:block to register before adding active transition class
    requestAnimationFrame(() => {
      mobileNav.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
    });
  };

  const closeMenu = () => {
    isOpen = false;
    mobileNav.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');

    // Hide after transition completes
    setTimeout(() => {
      if (!isOpen) {
        mobileNav.style.display = 'none';
      }
    }, 280);
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking any link inside the mobile drawer
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (isOpen && !mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });
}

/**
 * 03. Anchor Smooth Scrolling (Integrated with fallback or Lenis)
 */
function initSmoothScroll() {
  // Select all links pointing to in-page anchors
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Calculate offset to account for floating header
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // If Lenis is active on window, it will intercept or we can use window.scrollTo
        if (window.__flowspace_lenis) {
          window.__flowspace_lenis.scrollTo(targetElement, { offset: -headerOffset });
        } else {
          window.scrollTo({
            top: targetId === '#hero' ? 0 : offsetPosition,
            behavior: 'smooth',
          });
        }

        // Accessibility: update focus to target
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * 04. ScrollSpy for Active Navigation Link Highlighting
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 05. Interactive Dashboard Mockup Details
 * Makes the hero dashboard feel alive: task checkbox toggling updates stats dynamically!
 */
function initInteractiveDashboard() {
  const taskItems = document.querySelectorAll('.dashboard-frame .task-item');
  const completedKpiVal = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
  const completedKpiProgress = document.querySelector('.kpi-card:nth-child(2) .kpi-progress-fill');

  if (!taskItems.length) return;

  let totalTasks = 22;
  let completedCount = 18;

  taskItems.forEach((item) => {
    const checkbox = item.querySelector('.task-checkbox');
    const title = item.querySelector('.task-title');
    const tag = item.querySelector('.tag-status');

    if (!checkbox) return;

    item.style.cursor = 'pointer';

    item.addEventListener('click', (e) => {
      // Toggle checked state
      const isChecked = checkbox.classList.toggle('checked');

      if (isChecked) {
        checkbox.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
        title.classList.add('strike');
        if (tag) {
          tag.className = 'tag-status tag-done';
          tag.textContent = 'Done';
        }
        item.classList.remove('active-task');
        completedCount = Math.min(totalTasks, completedCount + 1);
      } else {
        checkbox.innerHTML = '';
        title.classList.remove('strike');
        if (tag) {
          tag.className = 'tag-status tag-urgent';
          tag.textContent = 'In Flow';
        }
        completedCount = Math.max(0, completedCount - 1);
      }

      // Update KPI counter and progress fill bar
      if (completedKpiVal) {
        completedKpiVal.innerHTML = `${completedCount} <span class="kpi-sub">/ ${totalTasks}</span>`;
      }
      if (completedKpiProgress) {
        const percentage = Math.round((completedCount / totalTasks) * 100);
        completedKpiProgress.style.width = `${percentage}%`;
      }
    });
  });

  // Focus Mode toggle pill
  const focusPill = document.querySelector('.dash-focus-mode-chip');
  if (focusPill) {
    focusPill.style.cursor = 'pointer';
    focusPill.setAttribute('title', 'Click to toggle Focus Mode');
    focusPill.addEventListener('click', () => {
      const isLive = focusPill.classList.toggle('paused');
      if (isLive) {
        focusPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
          <span>Focus Mode <strong>Paused</strong></span>
        `;
        focusPill.style.background = 'rgba(255, 159, 10, 0.1)';
        focusPill.style.borderColor = 'rgba(255, 159, 10, 0.3)';
        focusPill.style.color = '#FF9F0A';
      } else {
        focusPill.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          <span>Focus Mode <strong>Active</strong></span>
        `;
        focusPill.style.background = 'var(--accent-subtle)';
        focusPill.style.borderColor = 'var(--accent-border)';
        focusPill.style.color = 'var(--accent)';
      }
    });
  }
}

/**
 * 06. Pricing Buttons Interaction
 * Clicking plan CTA routes user to contact form with contextual pre-fill
 */
function initPricingButtons() {
  const pricingButtons = document.querySelectorAll('.pricing-btn');
  const messageInput = document.getElementById('form-message');

  pricingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || 'Pro';
      if (messageInput && !messageInput.value.trim()) {
        messageInput.value = `Hi Flowspace team, I'm interested in getting started with the ${planName} plan for my workflow.`;
      }
    });
  });
}

/**
 * 07. Contact / Demo Request Form Validation & Feedback
 */
function initContactForm() {
  const form = document.getElementById('demo-form');
  const successCard = document.getElementById('form-success-card');
  const resetBtn = document.getElementById('btn-reset-form');

  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');

  const groupName = document.getElementById('group-name');
  const groupEmail = document.getElementById('group-email');
  const groupMessage = document.getElementById('group-message');

  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errMessage = document.getElementById('err-message');

  const successUserName = document.getElementById('success-user-name');
  const successUserEmail = document.getElementById('success-user-email');

  // RFC Email Regex Pattern
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  // Validation functions
  const validateName = () => {
    const val = nameInput.value.trim();
    if (!val) {
      showError(groupName, nameInput, errName, 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      showError(groupName, nameInput, errName, 'Name must be at least 2 characters long.');
      return false;
    }
    clearError(groupName, nameInput, errName);
    return true;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!val) {
      showError(groupEmail, emailInput, errEmail, 'Please enter your work email.');
      return false;
    }
    if (!emailPattern.test(val)) {
      showError(groupEmail, emailInput, errEmail, 'Please enter a valid email address (e.g. name@company.com).');
      return false;
    }
    clearError(groupEmail, emailInput, errEmail);
    return true;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (!val) {
      showError(groupMessage, messageInput, errMessage, 'Please tell us about your workflow goals.');
      return false;
    }
    if (val.length < 10) {
      showError(groupMessage, messageInput, errMessage, 'Please write at least 10 characters.');
      return false;
    }
    clearError(groupMessage, messageInput, errMessage);
    return true;
  };

  const showError = (group, input, errEl, message) => {
    group.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    errEl.textContent = message;
  };

  const clearError = (group, input, errEl) => {
    group.classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
    errEl.textContent = '';
  };

  // Real-time validation listeners
  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', () => {
    if (groupName.classList.contains('has-error')) validateName();
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (groupEmail.classList.contains('has-error')) validateEmail();
  });

  messageInput.addEventListener('blur', validateMessage);
  messageInput.addEventListener('input', () => {
    if (groupMessage.classList.contains('has-error')) validateMessage();
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      // Focus first failing field
      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isMessageValid) messageInput.focus();
      return;
    }

    // Capture validated submission data
    const submittedName = nameInput.value.trim();
    const submittedEmail = emailInput.value.trim();

    // Populate feedback card
    if (successUserName) successUserName.textContent = submittedName;
    if (successUserEmail) successUserEmail.textContent = submittedEmail;

    // Transition smoothly between form and confirmation card
    form.style.display = 'none';
    successCard.hidden = false;
    successCard.style.display = 'block';

    // Focus success card for screen reader accessibility
    successCard.setAttribute('tabindex', '-1');
    successCard.focus();
  });

  // Handle "Submit Another Request" Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearError(groupName, nameInput, errName);
      clearError(groupEmail, emailInput, errEmail);
      clearError(groupMessage, messageInput, errMessage);

      successCard.hidden = true;
      successCard.style.display = 'none';
      form.style.display = 'flex';

      nameInput.focus();
    });
  }
}

// Auto-run if loaded directly
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractions);
  } else {
    initInteractions();
  }

  window.addEventListener('load', () => {
    document.title = 'SIZE:' + window.innerWidth + 'x' + window.innerHeight + ' DOC:' + document.documentElement.scrollWidth + 'x' + document.documentElement.scrollHeight;
  });
}
