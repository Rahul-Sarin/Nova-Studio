/**
 * Nova Studio - Main JavaScript
 * Handles particle animation, Lenis smooth scroll, GSAP animations, and interactions
 */

// ========================================
// Global State & Configuration
// ========================================

const NovaStudio = {
  lenis: null,
  particles: {
    canvas: null,
    ctx: null,
    array: [],
    mouse: { 
      x: null, 
      y: null, 
      lastX: null,
      lastY: null,
      velocityX: 0,
      velocityY: 0,
      radius: 150 
    }
  },
  rafId: null,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ========================================
// Particle System
// ========================================

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 10;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(0, 217, 255, 0.5)'; // Neon cyan
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse, canvas, time) {
    // Mouse interaction - WAVE DISTORTION EFFECT
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = mouse.radius;

    if (distance < maxDistance && distance > 0) {
      // Calculate mouse velocity (movement speed)
      const mouseSpeed = Math.sqrt(
        mouse.velocityX * mouse.velocityX + 
        mouse.velocityY * mouse.velocityY
      );
      
      // Only apply effect if mouse is moving
      if (mouseSpeed > 0.5) {
        // Create ripple wave based on distance and time
        const wave = Math.sin((distance / 20) - (time / 200));
        
        // Calculate force based on distance and wave
        const force = (maxDistance - distance) / maxDistance;
        const waveForce = wave * force * this.density * 0.8;
        
        // Direction away from mouse
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Apply wave displacement (perpendicular to direction)
        this.x -= forceDirectionX * waveForce;
        this.y -= forceDirectionY * waveForce;
        
        // Add slight perpendicular motion for more complex waves
        const perpX = -forceDirectionY * waveForce * 0.5;
        const perpY = forceDirectionX * waveForce * 0.5;
        this.x += perpX;
        this.y += perpY;
      }
    } else {
      // Return to base position when outside influence
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }

    // Add drift movement
    this.baseX += this.speedX;
    this.baseY += this.speedY;

    // Boundary check - wrap around
    if (this.baseX < 0) this.baseX = canvas.width;
    if (this.baseX > canvas.width) this.baseX = 0;
    if (this.baseY < 0) this.baseY = canvas.height;
    if (this.baseY > canvas.height) this.baseY = 0;
  }
}

function initParticles() {
  if (NovaStudio.reduceMotion) {
    console.log('Particles disabled: user prefers reduced motion');
    return;
  }

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) {
    console.warn('Particle canvas not found');
    return;
  }

  NovaStudio.particles.canvas = canvas;
  NovaStudio.particles.ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particles (doubled from original)
  const numberOfParticles = Math.min(
    Math.floor((canvas.width * canvas.height) / 2500),
    432
  );
  
  NovaStudio.particles.array = [];
  for (let i = 0; i < numberOfParticles; i++) {
    NovaStudio.particles.array.push(new Particle(canvas.width, canvas.height));
  }

  // Mouse tracking with velocity calculation
  window.addEventListener('mousemove', (e) => {
    const mouse = NovaStudio.particles.mouse;
    
    // Calculate velocity
    if (mouse.x !== null && mouse.y !== null) {
      mouse.velocityX = e.x - mouse.x;
      mouse.velocityY = e.y - mouse.y;
    }
    
    // Update position
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    NovaStudio.particles.mouse.x = null;
    NovaStudio.particles.mouse.y = null;
    NovaStudio.particles.mouse.velocityX = 0;
    NovaStudio.particles.mouse.velocityY = 0;
  });

  console.log(`Particle system initialized with ${numberOfParticles} particles`);
}

function connectParticles(ctx, particles) {
  const maxDistance = 100;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.3;
        ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  if (!NovaStudio.particles.canvas || !NovaStudio.particles.ctx || NovaStudio.reduceMotion) {
    return;
  }

  const ctx = NovaStudio.particles.ctx;
  const canvas = NovaStudio.particles.canvas;
  const particles = NovaStudio.particles.array;
  const mouse = NovaStudio.particles.mouse;
  const time = Date.now(); // Get current time for wave animation

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  particles.forEach(particle => {
    particle.update(mouse, canvas, time);
    particle.draw(ctx);
  });

  // Draw connections
  connectParticles(ctx, particles);
}

// ========================================
// Lenis Smooth Scroll Initialization
// ========================================

function initLenis() {
  if (NovaStudio.reduceMotion || typeof Lenis === 'undefined') {
    console.log('Lenis smooth scroll disabled');
    return;
  }

  NovaStudio.lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    anchors: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Sync with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    NovaStudio.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      NovaStudio.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    
    console.log('Lenis initialized and synced with GSAP ScrollTrigger');
  } else {
    console.warn('GSAP or ScrollTrigger not available');
  }

  // Expose for debugging
  window.__lenis = NovaStudio.lenis;
}

// ========================================
// GSAP Animations
// ========================================

function initScrollRevealAnimations() {
  if (NovaStudio.reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: just show elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { 
        y: 20, 
        opacity: 0, 
        filter: 'blur(8px)' 
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  console.log('Scroll reveal animations initialized');
}

function initMagneticButtons() {
  if (NovaStudio.reduceMotion || typeof gsap === 'undefined') {
    return;
  }

  // Only on non-touch devices
  if ('ontouchstart' in window) {
    return;
  }

  document.querySelectorAll('.js-magnetic, .btn-primary, .btn-secondary').forEach((el) => {
    const strength = 18;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      
      gsap.to(el, {
        x: (relX / rect.width) * strength,
        y: (relY / rect.height) * strength,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, { 
        x: 0, 
        y: 0, 
        duration: 0.5, 
        ease: 'elastic.out(1, 0.35)' 
      });
    };

    el.addEventListener('mouseenter', () => {
      el.style.zIndex = '10';
    });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', () => {
      onLeave();
      el.style.zIndex = '';
    });
  });

  console.log('Magnetic buttons initialized');
}

// ========================================
// Counter Animations
// ========================================

function initCounterAnimations() {
  if (NovaStudio.reduceMotion) {
    return;
  }

  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const suffix = element.dataset.suffix || '';
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// ========================================
// Navigation Scroll Effect
// ========================================

function initNavScrollEffect() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 50) {
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      nav.style.backdropFilter = 'blur(12px)';
    } else {
      nav.style.boxShadow = 'none';
      nav.style.backdropFilter = 'blur(8px)';
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ========================================
// Expertise Bar Animations
// ========================================

function initExpertiseBars() {
  if (NovaStudio.reduceMotion) {
    document.querySelectorAll('.progress').forEach(bar => {
      bar.style.width = bar.dataset.progress;
    });
    return;
  }

  const bars = document.querySelectorAll('.expertise-item');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const progressBar = entry.target.querySelector('.progress');
        const targetWidth = progressBar.dataset.progress;
        
        if (typeof gsap !== 'undefined') {
          gsap.to(progressBar, {
            width: targetWidth,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.2
          });
        } else {
          progressBar.style.width = targetWidth;
        }
      }
    });
  }, observerOptions);

  bars.forEach(bar => barsObserver.observe(bar));
}

// ========================================
// Smooth Anchor Scrolling
// ========================================

function initAnchorScrolling() {
  // Handle hash on page load
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const navHeight = 120; // Account for floating nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        if (NovaStudio.lenis) {
          NovaStudio.lenis.scrollTo(targetPosition, { duration: 1, easing: (t) => t });
        } else {
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    }, 100);
  }
}

// ========================================
// Main Animation Loop
// ========================================

function mainLoop(time) {
  animateParticles();
  NovaStudio.rafId = requestAnimationFrame(mainLoop);
}

// ========================================
// Initialization
// ========================================

function init() {
  console.log('Nova Studio initializing...', {
    reduceMotion: NovaStudio.reduceMotion,
    hasGSAP: typeof gsap !== 'undefined',
    hasLenis: typeof Lenis !== 'undefined'
  });

  // Initialize systems
  initParticles();
  initLenis();
  initScrollRevealAnimations();
  initMagneticButtons();
  initCounterAnimations();
  initNavScrollEffect();
  initExpertiseBars();
  initAnchorScrolling();

  // Start animation loop
  if (!NovaStudio.reduceMotion) {
    mainLoop();
  }

  // Add loaded class
  document.documentElement.classList.add('loaded');

  console.log('Nova Studio initialized successfully');
}

// ========================================
// Start when DOM is ready
// ========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ========================================
// Cleanup on page unload
// ========================================

window.addEventListener('beforeunload', () => {
  if (NovaStudio.rafId) {
    cancelAnimationFrame(NovaStudio.rafId);
  }
  if (NovaStudio.lenis) {
    NovaStudio.lenis.destroy();
  }
});

// ========================================
// Mobile Menu Toggle
// ========================================

function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');
  
  if (!navToggle || !navLinks) return;
  
  // Toggle menu on button click
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close menu when clicking on a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !navToggle.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });
  
  function openMenu() {
    navLinks.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
  }
  
  function closeMenu() {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore body scroll
  }
  
  console.log('Mobile menu initialized');
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}
