// ===== Star Canvas - 星空背景动画 =====
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStarArray();
  }

  function initStarArray() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        alphaChange: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.alpha += s.alphaChange;
      if (s.alpha <= 0.15 || s.alpha >= 1) { s.alphaChange *= -1; s.alpha = Math.max(0.15, Math.min(1, s.alpha)); }
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== Mobile Nav Toggle =====
function toggleNav() {
  document.getElementById('navMobile').classList.toggle('open');
}

// ===== WeChat QRCode Toggle =====
function toggleWechatQR() {
  document.getElementById('scQrcodePopup').classList.toggle('show');
}

// Close mobile nav on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMobile').classList.remove('open');
  });
});

// ===== Highlight Panel Switcher =====
let currentHL = 2;

function setHighlight(idx) {
  // Remove all active
  document.querySelectorAll('.hl-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.hl-panel').forEach(el => {
    el.classList.remove('active');
    el.classList.remove('active-default');
  });
  // Set active
  document.getElementById('hl-' + idx).classList.add('active');
  const panel = document.querySelector(`.hl-panel[data-idx="${idx}"]`);
  if (panel) panel.classList.add('active');
  currentHL = idx;
}

// Auto-cycle highlights
setInterval(() => {
  currentHL = (currentHL + 1) % 4;
  setHighlight(currentHL);
}, 4000);

// ===== Counter Animation =====
function animateCount(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

// Intersection Observer for stats
const statsBoxes = document.querySelectorAll('.stat-box-num[data-target]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.dataset.target);
      animateCount(entry.target, target);
    }
  });
}, { threshold: 0.5 });

statsBoxes.forEach(el => statsObserver.observe(el));

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.feature-card, .stat-box, .testi-card, .pricing-card, .step-item, .mini-feat, .hl-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

// ===== CTA Form Submit =====
function ctaSubmit() {
  const inputs = document.querySelectorAll('.cta-input');
  let allFilled = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      allFilled = false;
      input.style.borderColor = 'rgba(239,68,68,.6)';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });
  if (!allFilled) return;
  const btn = document.querySelector('.cta-submit');
  btn.textContent = '✓ 申请成功！稍后将有客服联系您';
  btn.style.background = '#22c55e';
  btn.style.color = '#fff';
  btn.disabled = true;
  inputs.forEach(input => { input.value = ''; });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.fontWeight = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--primary)';
      link.style.fontWeight = '700';
    }
  });
}, { passive: true });
