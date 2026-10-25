(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Gold dust / star particles on canvas.
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0, height = 0, frame = 0;
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = reduceMotion ? 20 : Math.min(100, Math.floor(width / 12));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.7 + .35, a: Math.random() * .65 + .12,
      speed: Math.random() * .25 + .05, phase: Math.random() * Math.PI * 2
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.phase += .012;
      if (!reduceMotion) { p.y -= p.speed; if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; } }
      const alpha = p.a * (.65 + Math.sin(p.phase) * .35);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237, 202, 126, ${alpha})`; ctx.fill();
    });
    if (!reduceMotion) frame = requestAnimationFrame(drawParticles);
  }
  resizeCanvas(); drawParticles();
  window.addEventListener('resize', () => { cancelAnimationFrame(frame); resizeCanvas(); drawParticles(); });

  // Music button: add your own legally obtained music.mp3 beside index.html.
  const music = document.getElementById('birthdayMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = document.getElementById('musicLabel');
  let musicAvailable = false;
  music.addEventListener('canplay', () => { musicAvailable = true; });
  musicToggle.addEventListener('click', async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.setAttribute('aria-pressed', 'true');
        musicLabel.textContent = 'Выключить музыку';
      } catch {
        musicLabel.textContent = 'Добавь music.mp3';
        window.setTimeout(() => { musicLabel.textContent = 'Включить музыку'; }, 2400);
      }
    } else {
      music.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'Включить музыку';
    }
  });

  // Confetti celebration.
  function celebrate() {
    const colors = ['#f7e4ad', '#d9b56d', '#b7863d', '#fff5d7', '#f1cf7b'];
    const amount = reduceMotion ? 30 : 150;
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--duration', (2.4 + Math.random() * 3.2) + 's');
      piece.style.setProperty('--drift', (Math.random() * 260 - 130) + 'px');
      piece.style.setProperty('--rotation', Math.random() * 360 + 'deg');
      piece.style.animationDelay = (Math.random() * .7) + 's';
      if (Math.random() > .5) piece.style.borderRadius = '50%';
      document.body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }
  }
  document.getElementById('celebrateButton').addEventListener('click', celebrate);
  document.querySelector('.gold-button[href="#story"]').addEventListener('click', () => {
    if (!reduceMotion) window.setTimeout(celebrate, 350);
  });

  // Photo lightbox.
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeButton = document.getElementById('lightboxClose');
  let previousFocus = null;
  function openLightbox(src, alt) {
    previousFocus = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt || 'Фотография Оксаны';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }
  document.querySelectorAll('.gallery-item').forEach(button => {
    button.addEventListener('click', () => openLightbox(button.dataset.full, button.querySelector('img').alt));
  });
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
})();