/**
 * FLOWSPACE — GSAP & Lenis Smooth Scroll System
 * Apple-inspired subtle, purposeful motion choreographies
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initAnimations() {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Lenis Smooth Scrolling
  initLenis();

  if (prefersReducedMotion) {
    console.info('Flowspace: prefers-reduced-motion active. Skipping motion choreography.');
    document.documentElement.classList.add('reduced-motion');
    return;
  }

  // Setup GSAP Timelines
  initHeroAnimations();
  initFeaturesAnimations();
  initHowItWorksAnimations();
  initShowcaseParallax();
  initPricingAnimations();
  initContactAnimations();
}

/**
 * 01. Lenis Smooth Scroll Engine & GSAP Ticker Synchronization
 */
function initLenis() {
  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 1.0,
      infinite: false,
    });

    // Expose globally so anchor navigation in interactions.js can route through Lenis
    window.__flowspace_lenis = lenisInstance;

    // Sync Lenis scroll events with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP's central requestAnimationFrame ticker
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    // Turn off lagSmoothing to keep scroll position locked during heavy frames
    gsap.ticker.lagSmoothing(0);
  } catch (err) {
    console.warn('Flowspace: Lenis initialization fallback:', err);
  }
}

/**
 * 02. Hero Section Entrance Choreography
 */
function initHeroAnimations() {
  const heroBadge = document.querySelector('.hero-badge');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroActions = document.querySelector('.hero-actions');
  const heroDashboard = document.querySelector('.dashboard-frame');

  if (!heroTitle) return;

  const heroTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.15,
  });

  if (heroBadge) {
    heroTl.from(heroBadge, {
      opacity: 0,
      y: -14,
      duration: 0.7,
    });
  }

  heroTl.from(
    heroTitle,
    {
      opacity: 0,
      y: 28,
      duration: 0.85,
    },
    '-=0.45'
  );

  if (heroDesc) {
    heroTl.from(
      heroDesc,
      {
        opacity: 0,
        y: 20,
        duration: 0.75,
      },
      '-=0.6'
    );
  }

  if (heroActions) {
    heroTl.from(
      heroActions,
      {
        opacity: 0,
        y: 16,
        duration: 0.7,
      },
      '-=0.55'
    );
  }

  if (heroDashboard) {
    heroTl.from(
      heroDashboard,
      {
        opacity: 0,
        y: 44,
        scale: 0.97,
        duration: 1.1,
        ease: 'power3.out',
      },
      '-=0.6'
    );

    // Stagger in the internal KPI widgets and dashboard elements
    const kpiCards = heroDashboard.querySelectorAll('.kpi-card');
    if (kpiCards.length) {
      heroTl.from(
        kpiCards,
        {
          opacity: 0,
          y: 15,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }
  }
}

/**
 * 03. Bento Grid Features Reveals
 */
function initFeaturesAnimations() {
  const section = document.querySelector('.section-features');
  if (!section) return;

  const header = section.querySelector('.section-header');
  const bentoCards = section.querySelectorAll('.bento-card');
  const gaugeMeter = section.querySelector('.gauge-meter');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  if (bentoCards.length) {
    gsap.from(bentoCards, {
      scrollTrigger: {
        trigger: section.querySelector('.bento-grid'),
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 35,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }

  // Animate circular gauge meter when Feature 02 comes into view
  if (gaugeMeter) {
    gsap.from(gaugeMeter, {
      scrollTrigger: {
        trigger: gaugeMeter,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      strokeDashoffset: 251.2,
      duration: 1.4,
      ease: 'power2.out',
      delay: 0.2,
    });
  }
}

/**
 * 04. How It Works Numbered Steps Reveals
 */
function initHowItWorksAnimations() {
  const section = document.querySelector('.section-how');
  if (!section) return;

  const header = section.querySelector('.section-header');
  const steps = section.querySelectorAll('.step-card');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  if (steps.length) {
    gsap.from(steps, {
      scrollTrigger: {
        trigger: section.querySelector('.steps-grid'),
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 32,
      duration: 0.85,
      stagger: 0.16,
      ease: 'power3.out',
    });
  }
}

/**
 * 05. Product Showcase Parallax & Floating Elements
 */
function initShowcaseParallax() {
  const section = document.querySelector('.section-showcase');
  if (!section) return;

  const header = section.querySelector('.section-header');
  const cockpit = section.querySelector('.showcase-cockpit');
  const badges = section.querySelectorAll('.floating-badge');
  const badgeNW = section.querySelector('.badge-nw');
  const badgeNE = section.querySelector('.badge-ne');
  const badgeSW = section.querySelector('.badge-sw');
  const badgeSE = section.querySelector('.badge-se');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  if (cockpit) {
    gsap.from(cockpit, {
      scrollTrigger: {
        trigger: cockpit,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 36,
      scale: 0.98,
      duration: 0.95,
      ease: 'power3.out',
    });
  }

  if (badges.length) {
    // Initial entrance fade-in
    gsap.from(badges, {
      scrollTrigger: {
        trigger: section.querySelector('.showcase-stage'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      scale: 0.92,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power2.out',
    });

    // Subtle scroll-driven parallax using scrub
    if (badgeNW && badgeSE) {
      gsap.to([badgeNW, badgeSE], {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: -30,
        ease: 'none',
      });
    }

    if (badgeNE && badgeSW) {
      gsap.to([badgeNE, badgeSW], {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: 25,
        ease: 'none',
      });
    }
  }
}

/**
 * 06. Pricing Cards Entrance
 */
function initPricingAnimations() {
  const section = document.querySelector('.section-pricing');
  if (!section) return;

  const header = section.querySelector('.section-header');
  const pricingCards = section.querySelectorAll('.pricing-card');

  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power2.out',
    });
  }

  if (pricingCards.length) {
    gsap.from(pricingCards, {
      scrollTrigger: {
        trigger: section.querySelector('.pricing-grid'),
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 32,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }
}

/**
 * 07. Contact Section Entrance
 */
function initContactAnimations() {
  const section = document.querySelector('.section-contact');
  if (!section) return;

  const contactInfo = section.querySelector('.contact-info');
  const formCard = section.querySelector('.contact-form-card');

  if (contactInfo && formCard) {
    const triggerEl = section.querySelector('.contact-wrapper');
    gsap.from(contactInfo, {
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -24,
      duration: 0.85,
      ease: 'power3.out',
    });

    gsap.from(formCard, {
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: 24,
      duration: 0.85,
      ease: 'power3.out',
    });
  }
}

// Auto-run if loaded directly in browser environment
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
}
