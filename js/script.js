// GALYM AI — JavaScript (тек негізгі функциялар)

// ── HEADER SCROLL ──
window.addEventListener('scroll', () => {
  document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── BURGER MENU ──
document.addEventListener('DOMContentLoaded', () => {
  const burger    = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });

  // Active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.09 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Background image (bg.png)
  const bg = document.querySelector('.site-bg');
  if (bg) {
    const img = new Image();
    img.src = 'bg.png';
    img.onload  = () => bg.style.backgroundImage = "url('bg.png')";
    img.onerror = () => bg.style.backgroundImage = "url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=90')";
  }

  // Gallery events
  const go = document.getElementById('galleryOverlay');
  if (go) {
    go.addEventListener('click', e => { if (e.target === go) closeGallery(); });
    document.getElementById('galleryCloseBtn')?.addEventListener('click', closeGallery);
    document.getElementById('galleryPrevBtn')?.addEventListener('click', () => moveGallery(-1));
    document.getElementById('galleryNextBtn')?.addEventListener('click', () => moveGallery(1));
  }

  // Video player close
  document.getElementById('videoPlayerClose')?.addEventListener('click', closeVideo);
  document.getElementById('videoPlayerOverlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('videoPlayerOverlay')) closeVideo();
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape')     { closeGallery(); closeVideo(); }
    if (e.key === 'ArrowLeft')  moveGallery(-1);
    if (e.key === 'ArrowRight') moveGallery(1);
  });
});

// ── КЕРІ БАЙЛАНЫС — Google Forms ──
function openFeedbackForm(e) {
  if (e) e.preventDefault();
  // ← МУНДАй Google Forms сілтемесін қойыңыз
  window.open('https://forms.google.com/example', '_blank');
}

// ── GALLERY ──
let _photos = [], _idx = 0;

function openGallery(photos, title, date, text) {
  _photos = photos || [];
  _idx = 0;
  document.getElementById('galleryDate').textContent  = date  || '';
  document.getElementById('galleryTitle').textContent = title || '';
  document.getElementById('galleryText').textContent  = text  || '';

  const thumbs = document.getElementById('galleryThumbs');
  if (thumbs) {
    thumbs.innerHTML = _photos.map((src, i) =>
      `<div class="gallery-thumb${i === 0 ? ' active' : ''}" onclick="setPhoto(${i})">
         <img src="${src}" alt="" loading="lazy">
       </div>`
    ).join('');
  }

  const vs = document.getElementById('galleryVideos');
  if (vs) { vs.innerHTML = ''; vs.style.display = 'none'; }

  const ps = document.getElementById('galleryPhotoSection');
  if (ps) ps.style.display = _photos.length ? 'block' : 'none';

  if (_photos.length) showPhoto(0);

  document.getElementById('galleryOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  document.getElementById('galleryOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function setPhoto(i) {
  _idx = (i + _photos.length) % _photos.length;
  showPhoto(_idx);
}

function moveGallery(dir) { setPhoto(_idx + dir); }

function showPhoto(i) {
  const img = document.getElementById('galleryMainImg');
  if (img) {
    img.style.opacity = '0';
    img.src = _photos[i];
    img.onload = () => { img.style.opacity = '1'; };
    img.style.transition = 'opacity 0.25s';
  }
  const cnt = document.getElementById('galleryCount');
  if (cnt) cnt.textContent = `${i + 1} / ${_photos.length}`;
  document.querySelectorAll('.gallery-thumb').forEach((t, j) => {
    t.classList.toggle('active', j === i);
  });
}

// ── VIDEO PLAYER ──
function openVideoPlayer(url) {
  const iframe = document.getElementById('videoIframe');
  if (!iframe) return;
  let embed = url
    .replace('watch?v=', 'embed/')
    .replace('youtu.be/', 'www.youtube.com/embed/');
  if (!embed.includes('youtube.com/embed/')) embed = url;
  iframe.src = embed + (embed.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
  document.getElementById('videoPlayerOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  document.getElementById('videoPlayerOverlay')?.classList.remove('open');
  const f = document.getElementById('videoIframe');
  if (f) f.src = '';
  document.body.style.overflow = '';
}

// ── ЖИ-ҚҰРАЛДАР (extras.html) ──
function renderAiTools() {
  const grid = document.getElementById('aiToolsGrid');
  if (!grid || typeof SITE_CONTENT === 'undefined' || !SITE_CONTENT.aiTools) return;

  const freeLabel = 'Тегін';
  const paidLabel = 'Ақылы';

  grid.innerHTML = SITE_CONTENT.aiTools.map((tool, i) => {
    const delay = (i % 4) > 0 ? ` reveal-delay-${i % 4}` : '';
    return `
    <div class="ai-tool-card reveal${delay}" data-free="${tool.free}" data-cats="${tool.category || 'text'}">
      <div class="ai-tool-header">
        <div class="ai-tool-icon" style="background:${tool.color}22;border:1.5px solid ${tool.color}44">
          <span style="font-size:1.6rem">${tool.emoji}</span>
        </div>
        <div>
          <div class="ai-tool-name">${tool.name}</div>
          <div class="ai-tool-company">${tool.company}</div>
        </div>
        <span class="ai-tool-badge" style="${tool.free
          ? 'background:rgba(16,163,127,0.10);color:#10A37F;border-color:rgba(16,163,127,0.22)'
          : 'background:rgba(107,77,230,0.10);color:#6B4DE6;border-color:rgba(107,77,230,0.22)'}">
          ${tool.free ? freeLabel : paidLabel}
        </span>
      </div>
      <p class="ai-tool-desc">${tool.desc || tool.descKz || tool.descRu || ''}</p>
      <div class="ai-tool-footer">
        <span class="ai-tool-tags">${tool.tag || tool.tagKz || tool.tagRu || ''}</span>
        <a href="${tool.url}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:.78rem;padding:7px 14px">
          Ашу ↗
        </a>
      </div>
    </div>`;
  }).join('');

  // reveal observer қайта іске қос
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.09 });
  grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// filter tabs
document.addEventListener('DOMContentLoaded', () => {
  renderAiTools();

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      document.querySelectorAll('.ai-tool-card').forEach(card => {
        if (f === 'all')  { card.style.display = ''; return; }
        if (f === 'free') { card.style.display = card.dataset.free === 'true' ? '' : 'none'; return; }
        card.style.display = card.dataset.cats === f ? '' : 'none';
      });
    });
  });
});
