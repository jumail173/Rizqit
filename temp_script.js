
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.p-item').forEach(item => {
      const video = item.querySelector('video');
      if (video) {
        let isPlaying = false;
        item.addEventListener('mouseenter', () => {
          isPlaying = true;
          video.play().catch(e => {});
        });
        item.addEventListener('mouseleave', () => {
          isPlaying = false;
          video.pause();
        });
        item.addEventListener('click', () => {
          if (isPlaying) { video.pause(); isPlaying = false; }
          else { video.play().catch(e => {}); isPlaying = true; }
        });
        item.addEventListener('touchstart', (e) => {
          if (video.paused) { video.play().catch(e => {}); isPlaying = true; }
          else { video.pause(); isPlaying = false; }
        }, { passive: true });
      }
    });
  });


  // -------- BRANDING AUTO-PLAY FRAME ANIMATION --------
  (function() {
    const canvas = document.getElementById('brandingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const FOLDER = 'branding-anim';
    const PREFIX = 'ezgif-frame-';
    const FRAMES = 30;
    const FPS = 6;

    const getInterval = () => {
      const animMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim-duration-multiplier')) || 1;
      return (1000 / FPS) * animMultiplier;
    };
    
    const framePath = i => {
      return `${FOLDER}/${PREFIX}${String(i).padStart(3,'0')}.jpg`;
    };

    let frames = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let lastTime = 0;
    let animationFrameId = null;

    function preloadFrames() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      frames = [];
      loadedCount = 0;
      for (let i = 1; i <= FRAMES; i++) {
        const img = new Image();
        img.src = framePath(i);
        img.onload = () => {
          loadedCount++;
          if (loadedCount === 1) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            drawFrame(0);
          }
          if (loadedCount === FRAMES) {
            triggerLoop();
          }
        };
        frames.push(img);
      }
    }
    preloadFrames();

    function drawFrame(index) {
      if (index < 0 || index >= frames.length) return;
      const img = frames[index];
      if (!img || !img.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentFrame = index;
    }

    function triggerLoop() {
      if (!animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    function animate(timestamp) {
      const interval = getInterval();
      const delta = timestamp - lastTime;

      if (delta >= interval) {
        lastTime = timestamp - (delta % interval);
        currentFrame = (currentFrame + 1) % FRAMES;
        drawFrame(currentFrame);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    window._admBrandingAnim = { pause: () => { if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } }, resume: triggerLoop };
  })();


  // header shadow on scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.getElementById('servicesDropdown').addEventListener('click', function(e){
    if (window.innerWidth <= 900) { e.preventDefault(); this.classList.toggle('open'); }
  });

  // scroll reveal
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('in'));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // -------- AUTO-PLAY FRAME ANIMATION --------
  (function() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Default settings
    const DEFAULT_FOLDER = 'mac-jpg';
    const DEFAULT_PREFIX = 'ezgif-frame-';
    const DEFAULT_FRAMES = 110;
    const DEFAULT_FPS = 12;

    const getFolder = () => window._admAnimFolder || DEFAULT_FOLDER;
    const getPrefix = () => window._admAnimPrefix || DEFAULT_PREFIX;
    const getFrameCount = () => window._admAnimFrames || DEFAULT_FRAMES;
    const getFPS = () => window._admAnimFPS || DEFAULT_FPS;

    const getInterval = () => {
      const animMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim-duration-multiplier')) || 1;
      return (1000 / getFPS()) * animMultiplier;
    };
    
    const framePath = i => {
      return `${getFolder()}/${getPrefix()}${String(i).padStart(3,'0')}.jpg`;
    };

    let frames = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let lastTime = 0;
    let animationFrameId = null;

    // Preload all frames
    function preloadFrames() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      frames = [];
      loadedCount = 0;
      const count = getFrameCount();
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = framePath(i);
        img.onload = () => {
          loadedCount++;
          if (loadedCount === 1) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            drawFrame(0);
          }
          if (loadedCount === count) {
            triggerLoop();
          }
        };
        frames.push(img);
      }
    }
    preloadFrames();
    window._admReloadCanvas = preloadFrames;

    function drawFrame(index) {
      if (index < 0 || index >= frames.length) return;
      const img = frames[index];
      if (!img || !img.complete) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentFrame = index;
    }

    function triggerLoop() {
      if (!animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    function animate(timestamp) {
      const interval = getInterval();
      const delta = timestamp - lastTime;
      const count = getFrameCount();

      if (delta >= interval) {
        lastTime = timestamp - (delta % interval);
        currentFrame = (currentFrame + 1) % count;
        drawFrame(currentFrame);
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    window._admHeroAnim = { pause: () => { if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } }, resume: triggerLoop };

    // Draw the first frame safely on load
    if (document.readyState === 'complete') {
      drawFrame(0);
    } else {
      window.addEventListener('load', () => drawFrame(0));
    }
  })();


  /* ---- WhatsApp Popup Toggle — auto-show/hide cycle (10s hidden, 3s visible) ---- */
  (function() {
    const floatBtn  = document.getElementById('waFloatBtn');
    const popup     = document.getElementById('waPopup');
    const closeBtn  = document.getElementById('waPopupClose');
    const badge     = document.getElementById('waBadge');
    const timeEl    = document.getElementById('waBubbleTime');
    if (!floatBtn || !popup) return;

    // Set current time in bubble
    function refreshTime() {
      if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      }
    }
    refreshTime();

    let openTimeout = null;
    let closeTimeout = null;

    function clearTimeouts() {
      clearTimeout(openTimeout);
      clearTimeout(closeTimeout);
    }

    function scheduleOpen() {
      clearTimeouts();
      openTimeout = setTimeout(openPopup, 10000);
    }

    function scheduleClose() {
      clearTimeouts();
      closeTimeout = setTimeout(closePopup, 3000);
    }

    function openPopup() {
      refreshTime();
      popup.classList.add('wa-open');
      floatBtn.setAttribute('aria-expanded', 'true');
      if (badge) badge.style.display = 'none';
      scheduleClose();
    }

    // Close and schedule to reopen
    function closePopup() {
      popup.classList.remove('wa-open');
      floatBtn.setAttribute('aria-expanded', 'false');
      if (badge) {
        badge.style.display = 'flex';
        badge.style.animation = 'none';
        void badge.offsetWidth;
        badge.style.animation = 'badge-pop .4s cubic-bezier(.34,1.56,.64,1)';
      }
      scheduleOpen();
    }

    // Toggle on button click
    floatBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (popup.classList.contains('wa-open')) {
        closePopup();
      } else {
        openPopup();
      }
    });

    // Close button inside popup
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closePopup();
      });
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (
        popup.classList.contains('wa-open') &&
        !popup.contains(e.target) &&
        !floatBtn.contains(e.target)
      ) {
        closePopup();
      }
    });

    // First auto-open after 10 seconds
    scheduleOpen();

  })();


(function(){
  const STORAGE_KEY = 'rizqit_site_content_data';
  const PASSWORD_KEY = 'rizqit_admin_password';
  const SHORTCUT_KEY = 'rizqit_admin_shortcut';

  let isLoggedIn = false;
  let editMode = false;
  let currentMediaTarget = null;
  let currentLinkTarget = null;
  let activePanel = null;

  const $ = id => document.getElementById(id);

  /* ---- DEFAULTS ---- */
  const defaultColors = {
    '--bg':'#FAF7F0','--bg-alt':'#F1ECE0',
    '--emerald':'#0E6B4F','--emerald-deep':'#0A4E3A',
    '--amber':'#E0A63A','--coral':'#DD5B3E',
    '--ink':'#161A18','--card':'#FFFFFF'
  };

  /* =========== ASSIGN data-adm-id =========== */
  function initAdminIDs() {
    let tIdx = 0, iIdx = 0, lIdx = 0, vIdx = 0;
    const textSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span.p-tag',
      '.hero-kicker', '.eyebrow', '.hero-stat b', '.hero-stat span',
      '.feature-card h3', '.feature-card p', '.d-card h4', '.d-card p',
      '.phase-head h3', '.phase-head p', '.integ-card h4', '.section-head h2',
      '.section-head p', '.addon-card h3', '.addon-card > p', '.cta-band h2',
      '.cta-band p', '.t-line', '.faq-q', '.faq-a p', '.footer-bottom span',
      'footer p', 'footer h5', 'footer .flogo'
    ];
    document.querySelectorAll(textSelectors.join(',')).forEach(el => {
      if (el.closest('#adm-bar') || el.closest('#adm-overlay') || el.closest('#adm-panel-wrap') || el.closest('.adm-modal') || el.closest('.adm-edit-banner')) return;
      if (!el.hasAttribute('data-adm-id')) el.setAttribute('data-adm-id', `txt-${tIdx++}`);
    });
    document.querySelectorAll('img').forEach(el => {
      if (el.closest('#adm-bar') || el.closest('#adm-panel-wrap') || el.closest('.adm-modal')) return;
      if (!el.hasAttribute('data-adm-id')) el.setAttribute('data-adm-id', `img-${iIdx++}`);
    });
    document.querySelectorAll('a').forEach(el => {
      if (el.closest('#adm-bar') || el.closest('#adm-overlay') || el.closest('#adm-panel-wrap') || el.closest('.adm-modal')) return;
      if (!el.hasAttribute('data-adm-id')) el.setAttribute('data-adm-id', `lnk-${lIdx++}`);
    });
    document.querySelectorAll('video').forEach(el => {
      if (el.closest('#adm-bar') || el.closest('#adm-panel-wrap')) return;
      if (!el.hasAttribute('data-adm-id')) el.setAttribute('data-adm-id', `vid-${vIdx++}`);
    });
  }

  /* =========== SHORTCUT LISTENER =========== */
  function getShortcutConfig() {
    return localStorage.getItem(SHORTCUT_KEY) || 'Ctrl+Shift+A';
  }

  function updateShortcutHint() {
    const sc = getShortcutConfig();
    const formatted = sc.replace(/\+/g, ' + ');
    if($('adm-shortcut-hint')) $('adm-shortcut-hint').textContent = formatted;
  }

  document.addEventListener('keydown', e => {
    const config = getShortcutConfig();
    const ctrlReq = config.includes('Ctrl');
    const shiftReq = config.includes('Shift');
    const altReq = config.includes('Alt');
    const keyReq = config.split('+').pop().toUpperCase();

    const ctrlMatch = ctrlReq ? e.ctrlKey : !e.ctrlKey;
    const shiftMatch = shiftReq ? e.shiftKey : !e.shiftKey;
    const altMatch = altReq ? e.altKey : !e.altKey;
    const keyMatch = e.key.toUpperCase() === keyReq;

    // Legacy shortcut fallback (Ctrl+Shift+Z)
    const isLegacy = e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'Z';

    if ((ctrlMatch && shiftMatch && altMatch && keyMatch) || isLegacy) {
      e.preventDefault();
      if (!isLoggedIn) openLogin();
      else toggleAdminBar();
    }
  });

  /* =========== LOGIN PROCESS =========== */
  function getAdminPassword() {
    return localStorage.getItem(PASSWORD_KEY) || 'admin123';
  }

  function openLogin() {
    updateShortcutHint();
    $('adm-overlay').classList.add('adm-show');
    $('adm-pwd-input').value = '';
    setTimeout(() => $('adm-pwd-input').focus(), 100);
  }
  
  function closeLogin() {
    $('adm-overlay').classList.remove('adm-show');
  }

  $('adm-close-login').onclick = closeLogin;
  $('adm-pwd-input').addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });
  $('adm-login-btn').onclick = attemptLogin;

  function attemptLogin() {
    const val = $('adm-pwd-input').value;
    if (val === getAdminPassword()) {
      isLoggedIn = true;
      closeLogin();
      activateAdmin();
      $('adm-login-err').textContent = '';
    } else {
      $('adm-login-err').textContent = '✕ Access Denied. Invalid password.';
      $('adm-pwd-input').select();
    }
  }

  function activateAdmin() {
    $('adm-bar').classList.add('adm-bar-show');
    document.body.classList.add('adm-active');
    loadContentFields();
    buildMediaList();
    initColors();
    buildSectionList();
    buildFaqList();
    initTypography();
    loadLedger();
  }

  function toggleAdminBar() {
    const bar = $('adm-bar');
    if (bar.classList.contains('adm-bar-show')) {
      bar.classList.remove('adm-bar-show');
      document.body.classList.remove('adm-active');
      closeAllPanels();
      if (editMode) toggleEditMode();
      // Resume canvas animations
      if (window._admBrandingAnim) window._admBrandingAnim.resume();
      if (window._admHeroAnim) window._admHeroAnim.resume();
    } else {
      bar.classList.add('adm-bar-show');
      document.body.classList.add('adm-active');
      // Pause canvas animations
      if (window._admBrandingAnim) window._admBrandingAnim.pause();
      if (window._admHeroAnim) window._admHeroAnim.pause();
    }
  }

  $('adm-logout').onclick = () => {
    isLoggedIn = false;
    $('adm-bar').classList.remove('adm-bar-show');
    document.body.classList.remove('adm-active');
    if (editMode) toggleEditMode();
    closeAllPanels();
    if (window._admBrandingAnim) window._admBrandingAnim.resume();
    if (window._admHeroAnim) window._admHeroAnim.resume();
    showToast('Logged out successfully');
  };

  $('adm-close-bar').onclick = () => {
    $('adm-bar').classList.remove('adm-bar-show');
    document.body.classList.remove('adm-active');
    if (editMode) toggleEditMode();
    closeAllPanels();
    if (window._admBrandingAnim) window._admBrandingAnim.resume();
    if (window._admHeroAnim) window._admHeroAnim.resume();
  };

  /* =========== TABS AND PANELS =========== */
  document.querySelectorAll('[data-panel]').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.panel;
      if (activePanel === name) { closeAllPanels(); return; }
      openPanel(name);
      document.querySelectorAll('[data-panel]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  function openPanel(name) {
    activePanel = name;
    $('adm-panel-wrap').classList.add('adm-panel-open');
    document.querySelectorAll('.adm-panel').forEach(p=>p.classList.remove('active'));
    const target = $('adm-panel-'+name);
    if(target) target.classList.add('active');

    // Trigger tab loaders
    if (name === 'content') loadContentFields();
    if (name === 'media') buildMediaList();
    if (name === 'colors') initColors();
    if (name === 'visibility') buildSectionList();
    if (name === 'faq') buildFaqList();
    if (name === 'typography') initTypography();
    if (name === 'ledger') loadLedger();
    if (name === 'settings') {
      $('adm-set-pwd').value = '';
      $('adm-set-shortcut').value = getShortcutConfig();
    }
  }

  function closeAllPanels() {
    activePanel = null;
    $('adm-panel-wrap').classList.remove('adm-panel-open');
    document.querySelectorAll('.adm-panel').forEach(p=>p.classList.remove('active'));
    document.querySelectorAll('[data-panel]').forEach(b=>b.classList.remove('active'));
  }

  /* =========== DYNAMIC FONTS LOADER =========== */
  function loadGoogleFont(fontName) {
    if (!fontName) return;
    const normalized = fontName.replace(/['"]/g, '').trim();
    if (normalized.toLowerCase().includes('sans-serif') || normalized.toLowerCase().includes('serif') || normalized.toLowerCase().includes('monospace')) return;
    const id = `gfont-${normalized.toLowerCase().replace(/\s+/g, '-')}`;
    if ($(id)) return;
    
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(normalized)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }

  /* =========== DIRECT EDITING MODE =========== */
  $('adm-edit-toggle').onclick = toggleEditMode;

  function toggleEditMode() {
    editMode = !editMode;
    const btn = $('adm-edit-toggle');
    document.body.classList.toggle('adm-edit-mode', editMode);
    btn.classList.toggle('off', !editMode);
    
    if (editMode) {
      applyEditableAttributes();
    } else {
      removeEditableAttributes();
    }
  }

  function applyEditableAttributes() {
    document.querySelectorAll('[data-adm-id]').forEach(el => {
      const id = el.getAttribute('data-adm-id');
      if (id.startsWith('txt-')) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('data-editable', '1');
        el.setAttribute('spellcheck', 'false');
        el.onblur = () => {
          saveSiteContent();
        };
      } else if (id.startsWith('img-') || id.startsWith('vid-')) {
        el.onclick = e => {
          if (!editMode) return;
          e.preventDefault(); e.stopPropagation();
          openMediaModal(el);
        };
      } else if (id.startsWith('lnk-')) {
        el.onclick = e => {
          if (!editMode) return;
          e.preventDefault(); e.stopPropagation();
          openLinkModal(el);
        };
      } else if (id.startsWith('tags-')) {
        el.onclick = e => {
          if (!editMode) return;
          e.preventDefault(); e.stopPropagation();
          const current = Array.from(el.querySelectorAll('.p-tag-pill')).map(s => s.textContent.trim()).join(', ');
          const input = prompt('Edit tags (comma separated):', current);
          if (input !== null) {
            const arr = input.split(',').map(t => t.trim()).filter(t => t);
            el.innerHTML = arr.map(t => '<span class="p-tag-pill">' + t + '</span>').join('');
            saveSiteContent();
          }
        };
      }
    });
  }

  function removeEditableAttributes() {
    document.querySelectorAll('[data-adm-id]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-editable');
      el.removeAttribute('spellcheck');
      if (!el.getAttribute('data-adm-id').startsWith('lnk-')) {
        el.onclick = null;
      }
    });
  }

  /* =========== CONTENT FORM MANAGER =========== */
  function loadContentFields() {
    const getText = sel => { const el = document.querySelector(sel); return el ? el.textContent.trim() : ''; };
    $('adm-hero-title').value = document.querySelector('h1.hero-title') ? document.querySelector('h1.hero-title').textContent.trim() : '';
    $('adm-hero-kicker').value = getText('.hero-kicker');
    
    const stats = document.querySelectorAll('.hero-stat');
    if(stats[0]) { $('adm-stat1-val').value = stats[0].querySelector('b').textContent; $('adm-stat1-lbl').value = stats[0].querySelector('span').textContent; }
    if(stats[1]) { $('adm-stat2-val').value = stats[1].querySelector('b').textContent; $('adm-stat2-lbl').value = stats[1].querySelector('span').textContent; }
    if(stats[2]) { $('adm-stat3-val').value = stats[2].querySelector('b').textContent; $('adm-stat3-lbl').value = stats[2].querySelector('span').textContent; }

    $('adm-cta-heading').value = getText('.cta-band h2');
    $('adm-cta-para').value = getText('.cta-band p');

    const navPh = document.querySelector('.nav-phone');
    $('adm-nav-phone').value = navPh ? navPh.textContent.replace('✓','').trim() : '';

    document.querySelectorAll('footer p').forEach(p => {
      const txt = p.textContent;
      if (txt.includes('@')) $('adm-footer-email').value = txt.trim();
      else if (txt.includes('+91')) $('adm-footer-phone').value = txt.trim();
      else if (txt.includes('Chennai')) $('adm-footer-addr').value = txt.trim();
    });
  }

  /* =========== LIVE CONTENT APPLY =========== */
  function applyContentLive() {
    const h1 = document.querySelector('h1.hero-title');
    if (h1) h1.innerHTML = $('adm-hero-title').value;

    const kicker = document.querySelector('.hero-kicker');
    if (kicker) kicker.textContent = $('adm-hero-kicker').value;

    const stats = document.querySelectorAll('.hero-stat');
    if(stats[0]) { stats[0].querySelector('b').textContent = $('adm-stat1-val').value; stats[0].querySelector('span').textContent = $('adm-stat1-lbl').value; }
    if(stats[1]) { stats[1].querySelector('b').textContent = $('adm-stat2-val').value; stats[1].querySelector('span').textContent = $('adm-stat2-lbl').value; }
    if(stats[2]) { stats[2].querySelector('b').textContent = $('adm-stat3-val').value; stats[2].querySelector('span').textContent = $('adm-stat3-lbl').value; }

    const ctaH = document.querySelector('.cta-band h2');
    if (ctaH) ctaH.textContent = $('adm-cta-heading').value;
    const ctaP = document.querySelector('.cta-band p');
    if (ctaP) ctaP.textContent = $('adm-cta-para').value;

    const navPh = document.querySelector('.nav-phone');
    if (navPh) {
      const ring = navPh.querySelector('.ring');
      navPh.textContent = ' ' + $('adm-nav-phone').value;
      if (ring) navPh.prepend(ring);
    }

    document.querySelectorAll('footer p').forEach(p => {
      const txt = p.textContent;
      if (txt.includes('@') || p.id === 'f-email') p.textContent = $('adm-footer-email').value;
      else if (txt.includes('+91') || p.id === 'f-phone') p.textContent = $('adm-footer-phone').value;
      else if (txt.includes('Chennai') || p.id === 'f-addr') p.textContent = $('adm-footer-addr').value;
    });

    saveSiteContent();
    updateWhatsAppLinks();
  }

  /* Wire live listeners to every content field */
  function bindLiveContentListeners() {
    const liveFields = [
      'adm-hero-title','adm-hero-kicker',
      'adm-stat1-val','adm-stat1-lbl',
      'adm-stat2-val','adm-stat2-lbl',
      'adm-stat3-val','adm-stat3-lbl',
      'adm-cta-heading','adm-cta-para',
      'adm-nav-phone',
      'adm-footer-email','adm-footer-phone','adm-footer-addr'
    ];
    liveFields.forEach(id => {
      const el = $(id);
      if (el) {
        el.addEventListener('input', applyContentLive);
      }
    });
  }
  bindLiveContentListeners();

  $('adm-content-apply').onclick = () => {
    applyContentLive();
    showToast('Content saved!');
  };



  /* =========== UI/UX IMAGE PANEL HELPERS =========== */
  window.admPickFile = function(imgId, prevId, urlInputId) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        const pageImg = document.getElementById(imgId);
        const prevImg = document.getElementById(prevId);
        const urlInput = document.getElementById(urlInputId);
        if (pageImg) {
          pageImg.src = src;
          pageImg.style.display = '';
          const placeholder = pageImg.nextElementSibling;
          if (placeholder) placeholder.style.display = 'none';
        }
        if (prevImg) prevImg.src = src;
        if (urlInput) urlInput.value = '';
        saveSiteContent();
        showToast('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  window.admApplyUrl = function(imgId, prevId, urlInputId, quiet) {
    const urlInput = document.getElementById(urlInputId);
    const src = urlInput ? urlInput.value.trim() : '';
    if (!src && !quiet) { showToast('Please enter a URL first.'); return; }
    const pageImg = document.getElementById(imgId);
    const prevImg = document.getElementById(prevId);
    if (pageImg) {
      pageImg.src = src;
      pageImg.style.display = '';
      const placeholder = pageImg.nextElementSibling;
      if (placeholder) placeholder.style.display = 'none';
    }
    if (prevImg) prevImg.src = src;
    saveSiteContent();
    if(!quiet) showToast('Image URL applied!');
  };

  /* Wire live listeners for UI/UX Image inputs */
  ['wireframe','prototype','uikit','responsive','system'].forEach(id => {
    const el = $('uiux-url-' + id);
    if (el) {
      el.addEventListener('input', () => window.admApplyUrl('deliv-img-' + id, 'adm-prev-' + id, 'uiux-url-' + id, true));
    }
  });

  /* =========== MEDIA LIST =========== */
  function buildMediaList() {

    const list = $('adm-media-list');
    list.innerHTML = '';
    
    // Images
    document.querySelectorAll('[data-adm-id^="img-"]').forEach(img => {
      const wrap = document.createElement('div');
      wrap.className = 'adm-img-item';
      wrap.innerHTML = `
        <img class="adm-img-thumb" src="${img.src}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23222%22/></svg>'">
        <div class="adm-img-info">
          <span style="font-weight:600;color:#c9d5cc;">Image Node (${img.getAttribute('data-adm-id')})</span>
          <span>Alt: ${img.alt || '(none)'}</span>
        </div>
        <button class="adm-mini-btn edit">Change</button>
      `;
      wrap.querySelector('.edit').onclick = () => openMediaModal(img);
      list.appendChild(wrap);
    });

    // Videos
    document.querySelectorAll('[data-adm-id^="vid-"]').forEach(vid => {
      const wrap = document.createElement('div');
      wrap.className = 'adm-img-item';
      wrap.innerHTML = `
        <div class="adm-img-thumb" style="background:#1a2e22;display:flex;align-items:center;justify-content:center;color:#0E6B4F;font-weight:bold;font-size:0.7rem;">VID</div>
        <div class="adm-img-info">
          <span style="font-weight:600;color:#c9d5cc;">Video Node (${vid.getAttribute('data-adm-id')})</span>
          <span>Source: ${vid.src ? vid.src.substring(0, 30) + '...' : '(none)'}</span>
        </div>
        <button class="adm-mini-btn edit">Change</button>
      `;
      wrap.querySelector('.edit').onclick = () => openMediaModal(vid);
      list.appendChild(wrap);
    });
  }

  /* =========== MEDIA MODAL & UPLOAD =========== */
  function openMediaModal(el) {
    currentMediaTarget = el;
    $('adm-img-new-src').value = el.getAttribute('src') || '';
    if (el.tagName.toLowerCase() === 'img') {
      $('adm-img-alt-field').style.display = 'block';
      $('adm-img-new-alt').value = el.alt || '';
    } else {
      $('adm-img-alt-field').style.display = 'none';
    }
    $('adm-img-modal').classList.add('show');
  }

  $('adm-media-file-btn').onclick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = currentMediaTarget.tagName.toLowerCase() === 'video' ? 'video/*' : 'image/*';
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        $('adm-img-new-src').value = ev.target.result;
        showToast('File loaded. Click Apply to save.');
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  /* Live edit inside Media Modal */
  $('adm-img-new-src').addEventListener('input', () => {
    if(!currentMediaTarget) return;
    currentMediaTarget.src = $('adm-img-new-src').value.trim();
    saveSiteContent();
  });
  $('adm-img-new-alt').addEventListener('input', () => {
    if(!currentMediaTarget || currentMediaTarget.tagName.toLowerCase() !== 'img') return;
    currentMediaTarget.alt = $('adm-img-new-alt').value.trim();
    saveSiteContent();
  });

  $('adm-img-apply').onclick = () => {
    if(!currentMediaTarget) return;
    
    // Apply changes from modal to the target element
    currentMediaTarget.src = $('adm-img-new-src').value.trim();
    if (currentMediaTarget.tagName.toLowerCase() === 'img') {
      currentMediaTarget.alt = $('adm-img-new-alt').value.trim();
    } else if (currentMediaTarget.tagName.toLowerCase() === 'video') {
      currentMediaTarget.load(); // Refresh video playback
    }
    
    saveSiteContent();
    
    $('adm-img-modal').classList.remove('show');
    currentMediaTarget = null;
    if (activePanel === 'media') buildMediaList();
    showToast('Media updated successfully!');
  };

  $('adm-img-cancel').onclick = () => {
    $('adm-img-modal').classList.remove('show');
    currentMediaTarget = null;
  };

  /* =========== LINK MODAL =========== */
  function openLinkModal(link) {
    currentLinkTarget = link;
    $('adm-lnk-text').value = link.innerHTML.trim();
    $('adm-lnk-href').value = link.getAttribute('href') || '';
    $('adm-lnk-target').value = link.getAttribute('target') || '';
    $('adm-link-modal').classList.add('show');
  }

  /* Live edit inside Link Modal */
  $('adm-lnk-text').addEventListener('input', () => {
    if(!currentLinkTarget) return;
    currentLinkTarget.innerHTML = $('adm-lnk-text').value.trim();
    saveSiteContent();
  });
  $('adm-lnk-href').addEventListener('input', () => {
    if(!currentLinkTarget) return;
    const href = $('adm-lnk-href').value.trim();
    if (href) currentLinkTarget.setAttribute('href', href);
    else currentLinkTarget.removeAttribute('href');
    saveSiteContent();
  });
  $('adm-lnk-target').addEventListener('change', () => {
    if(!currentLinkTarget) return;
    const target = $('adm-lnk-target').value;
    if (target) currentLinkTarget.setAttribute('target', target);
    else currentLinkTarget.removeAttribute('target');
    saveSiteContent();
  });

  $('adm-lnk-apply').onclick = () => {
    if(!currentLinkTarget) return;
    $('adm-link-modal').classList.remove('show');
    currentLinkTarget = null;
    showToast('Link modified!');
  };

  $('adm-lnk-cancel').onclick = () => {
    $('adm-link-modal').classList.remove('show');
    currentLinkTarget = null;
  };

  /* =========== TYPOGRAPHY AND SPEED PANEL =========== */
  function initTypography() {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    
    const fontH = computed.getPropertyValue('--font-headings').trim();
    const fontB = computed.getPropertyValue('--font-body').trim();
    const multH = computed.getPropertyValue('--font-size-headings-multiplier').trim() || '1';
    const multB = computed.getPropertyValue('--font-size-body-multiplier').trim() || '1';
    const duration = computed.getPropertyValue('--anim-duration-multiplier').trim() || '1';
    
    if($('adm-font-headings-sel')) $('adm-font-headings-sel').value = fontH;
    if($('adm-font-body-sel')) $('adm-font-body-sel').value = fontB;
    
    $('slide-font-headings').value = parseFloat(multH);
    $('val-font-headings').textContent = parseFloat(multH).toFixed(2) + 'x';
    
    $('slide-font-body').value = parseFloat(multB);
    $('val-font-body').textContent = parseFloat(multB).toFixed(2) + 'x';
    
    $('slide-anim-duration').value = parseFloat(duration);
    $('val-anim-duration').textContent = parseFloat(duration).toFixed(1) + 'x';

    $('slide-canvas-fps').value = window._admAnimFPS || 12;
    $('val-canvas-fps').textContent = window._admAnimFPS || 12;
  }

  $('adm-font-headings-sel').onchange = e => {
    const font = e.target.value;
    loadGoogleFont(font);
    document.documentElement.style.setProperty('--font-headings', font);
    saveSiteContent();
  };

  $('adm-font-body-sel').onchange = e => {
    const font = e.target.value;
    loadGoogleFont(font);
    document.documentElement.style.setProperty('--font-body', font);
    saveSiteContent();
  };

  $('slide-font-headings').oninput = e => {
    const val = parseFloat(e.target.value);
    $('val-font-headings').textContent = val.toFixed(2) + 'x';
    document.documentElement.style.setProperty('--font-size-headings-multiplier', val);
    saveSiteContent();
  };

  $('slide-font-body').oninput = e => {
    const val = parseFloat(e.target.value);
    $('val-font-body').textContent = val.toFixed(2) + 'x';
    document.documentElement.style.setProperty('--font-size-body-multiplier', val);
    saveSiteContent();
  };

  $('slide-anim-duration').oninput = e => {
    const val = parseFloat(e.target.value);
    $('val-anim-duration').textContent = val.toFixed(1) + 'x';
    document.documentElement.style.setProperty('--anim-duration-multiplier', val);
    saveSiteContent();
  };

  $('slide-canvas-fps').oninput = e => {
    const val = parseInt(e.target.value);
    $('val-canvas-fps').textContent = val;
    window._admAnimFPS = val;
    saveSiteContent();
    if(window._admReloadCanvas) window._admReloadCanvas();
  };

  /* =========== COLORS & THEME PANEL =========== */
  const colorMap = [
    {prop:'--bg', picker:'clr-bg', text:'clr-bg-txt'},
    {prop:'--bg-alt', picker:'clr-bgalt', text:'clr-bgalt-txt'},
    {prop:'--emerald', picker:'clr-em', text:'clr-em-txt'},
    {prop:'--emerald-deep', picker:'clr-em', text:''}, // mapped to same brand picker
    {prop:'--amber', picker:'clr-am', text:'clr-am-txt'},
    {prop:'--coral', picker:'clr-co', text:'clr-co-txt'},
    {prop:'--ink', picker:'clr-ink', text:'clr-ink-txt'},
    {prop:'--card', picker:'clr-card', text:'clr-card-txt'},
  ];

  function initColors() {
    const root = document.documentElement;
    colorMap.forEach(c => {
      if (!c.text) return; // skip secondary mappings
      const val = getComputedStyle(root).getPropertyValue(c.prop).trim();
      const hex = cssColorToHex(val) || val;
      const picker = $(c.picker);
      const textInput = $(c.text);
      if (picker) picker.value = hex;
      if (textInput) textInput.value = hex;

      picker.oninput = () => {
        textInput.value = picker.value;
        applyColor(c.prop, picker.value);
        if (c.prop === '--emerald') {
          // auto update deep emerald too
          applyColor('--emerald-deep', adjustColorBrightness(picker.value, -30));
        }
      };

      textInput.oninput = () => {
        try { picker.value = textInput.value; } catch(e){}
        applyColor(c.prop, textInput.value);
      };
    });
  }

  function applyColor(prop, val) {
    document.documentElement.style.setProperty(prop, val);
    saveSiteContent();
  }

  function cssColorToHex(color) {
    try {
      const canvas = document.createElement('canvas'); canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext('2d'); ctx.fillStyle = color; ctx.fillRect(0,0,1,1);
      const data = ctx.getImageData(0,0,1,1).data;
      return '#' + [data[0], data[1], data[2]].map(x => x.toString(16).padStart(2,'0')).join('');
    } catch(e){ return color; }
  }

  function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    R = (R < 255) ? R : 255; G = (G < 255) ? G : 255; B = (B < 255) ? B : 255;
    R = (R > 0) ? R : 0; G = (G > 0) ? G : 0; B = (B > 0) ? B : 0;
    return "#" + [R, G, B].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  $('adm-color-reset').onclick = () => {
    Object.entries(defaultColors).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
    initColors();
    saveSiteContent();
    showToast('Colors reverted to factory defaults');
  };

  /* =========== SECTION VISIBILITY PANEL =========== */
  const sectionMap = [
    {label:'Top Info Bar', sel:'.topbar'},
    {label:'Site Header / Nav', sel:'#site-header'},
    {label:'Hero Intro', sel:'.hero'},
    {label:'Kicker Strip', sel:'.intro'},
    {label:'Services Block', sel:'#services'},
    {label:'Discovery Phases', sel:'.section-alt'},
    {label:'Detailed Process', sel:'#process'},
    {label:'Portfolio Work', sel:'.section-alt:nth-of-type(3)'},
    {label:'Why Choose Us', sel:'#why'},
    {label:'Premium Add-ons', sel:'#addons'},
    {label:'CTA Band Banner', sel:'.cta-band'},
    {label:'Accordion FAQ', sel:'#faq'},
    {label:'Contact Form', sel:'#contact'},
    {label:'Footer Links/Info', sel:'footer'},
    {label:'Floating Call Widgets', sel:'.floaters'},
  ];

  function buildSectionList() {
    const list = $('adm-section-list');
    list.innerHTML = '';
    
    sectionMap.forEach(sec => {
      const el = document.querySelector(sec.sel);
      if(!el) return;
      const visible = el.style.display !== 'none';
      const row = document.createElement('div');
      row.className = 'adm-section-toggle';
      row.innerHTML = `
        <span>${sec.label}</span>
        <label class="adm-switch">
          <input type="checkbox" ${visible ? 'checked' : ''}>
          <span class="adm-slider"></span>
        </label>
      `;
      row.querySelector('input').onchange = e => {
        el.style.display = e.target.checked ? '' : 'none';
        saveSiteContent();
      };
      list.appendChild(row);
    });
  }

  /* =========== FAQ LIST AND EDITOR =========== */
  function buildFaqList() {
    const list = $('adm-faq-list');
    list.innerHTML = '';
    
    document.querySelectorAll('.faq-item').forEach((item, idx) => {
      const qText = item.querySelector('.faq-q').textContent.replace('+','').trim();
      const aText = item.querySelector('.faq-a p').textContent.trim();
      
      const row = document.createElement('div');
      row.className = 'adm-faq-item';
      row.innerHTML = `
        <div class="adm-faq-q">${idx+1}. ${qText}</div>
        <div class="adm-faq-actions">
          <button class="adm-mini-btn edit">Edit</button>
          <button class="adm-mini-btn del">Delete</button>
        </div>
      `;
      row.querySelector('.edit').onclick = () => {
        const newQ = prompt('Update FAQ Question:', qText);
        if(newQ === null) return;
        const newA = prompt('Update FAQ Answer:', aText);
        if(newA === null) return;
        item.querySelector('.faq-q').innerHTML = newQ + ' <span class="plus">+</span>';
        item.querySelector('.faq-a p').textContent = newA;
        buildFaqList();
        saveSiteContent();
      };
      row.querySelector('.del').onclick = () => {
        if (confirm('Are you sure you want to delete this FAQ item?')) {
          item.remove();
          buildFaqList();
          saveSiteContent();
        }
      };
      list.appendChild(row);
    });
  }

  $('adm-faq-add').onclick = () => {
    const q = $('adm-faq-new-q').value.trim();
    const a = $('adm-faq-new-a').value.trim();
    if (!q || !a) { showToast('Please enter both question and answer', 'warn'); return; }
    
    const faqList = $('faqList');
    if(!faqList) return;
    
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `<div class="faq-q">${q} <span class="plus">+</span></div><div class="faq-a"><p>${a}</p></div>`;
    
    // Wire accordion behavior
    const newQ = item.querySelector('.faq-q');
    const newA = item.querySelector('.faq-a');
    newQ.onclick = () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        newA.style.maxHeight = newA.scrollHeight + 'px';
      }
    };
    
    faqList.appendChild(item);
    $('adm-faq-new-q').value = '';
    $('adm-faq-new-a').value = '';
    buildFaqList();
    saveSiteContent();
    showToast('New FAQ added successfully!');
  };

  /* =========== LEDGER / PORTFOLIO EDITOR =========== */
  const ledgerItems = [
    { id: 'cafe',         vidId: 'vid-cafe',         nameId: 'pname-cafe',         descId: 'pdesc-cafe' },
    { id: 'travel',       vidId: 'vid-travel',       nameId: 'pname-travel',       descId: 'pdesc-travel' },
    { id: 'fashion',      vidId: 'vid-fashion',      nameId: 'pname-fashion',      descId: 'pdesc-fashion' },
    { id: 'interior',     vidId: 'vid-interior',     nameId: 'pname-interior',     descId: 'pdesc-interior' },
    { id: 'healthcare',   vidId: 'vid-healthcare',   nameId: 'pname-healthcare',   descId: 'pdesc-healthcare' },
    { id: 'manufacturing', vidId: 'vid-manufacturing', nameId: 'pname-manufacturing', descId: 'pdesc-manufacturing' }
  ];

  function getLedgerCard(id) {
    const vid = document.getElementById(id);
    return vid ? vid.closest('.p-item') : null;
  }

  function loadLedger() {
    const list = $('adm-ledger-list');
    list.innerHTML = '';
    ledgerItems.forEach(item => {
      const card = getLedgerCard(item.vidId);
      if (!card) return;
      const nameEl = card.querySelector('.p-name');
      const descEl = card.querySelector('.p-desc');
      const tagsEl = card.querySelector('.p-tags');
      const tags = tagsEl ? Array.from(tagsEl.querySelectorAll('.p-tag-pill')).map(s => s.textContent.trim()).join(', ') : '';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'background:#111815;border:1px solid #1e3028;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:8px;';
      wrap.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#c9d5cc;font-weight:600;font-size:0.85rem;">${item.id.charAt(0).toUpperCase() + item.id.slice(1)}</span>
        </div>
        <div class="adm-field"><div class="adm-label">Project Name</div><input class="adm-input" id="lg-name-${item.id}" value="${(nameEl ? nameEl.textContent.trim() : '').replace(/"/g, '&quot;')}"></div>
        <div class="adm-field"><div class="adm-label">Description</div><input class="adm-input" id="lg-desc-${item.id}" value="${(descEl ? descEl.textContent.trim() : '').replace(/"/g, '&quot;')}"></div>
        <div class="adm-field"><div class="adm-label">Tags (comma separated)</div><input class="adm-input" id="lg-tags-${item.id}" value="${tags.replace(/"/g, '&quot;')}"></div>
      `;
      const pid = item.id;
      wrap.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => applyLedgerItem(pid));
      });
      list.appendChild(wrap);
    });
  }

  function applyLedgerItem(itemId) {
    const item = ledgerItems.find(p => p.id === itemId);
    if (!item) return;
    const card = getLedgerCard(item.vidId);
    if (!card) return;
    const nameEl = card.querySelector('.p-name');
    const descEl = card.querySelector('.p-desc');
    const tagsEl = card.querySelector('.p-tags');
    const newName = $('lg-name-' + itemId)?.value?.trim();
    const newDesc = $('lg-desc-' + itemId)?.value?.trim();
    const newTags = $('lg-tags-' + itemId)?.value?.trim();
    if (nameEl && newName) nameEl.textContent = newName;
    if (descEl && newDesc) descEl.textContent = newDesc;
    if (tagsEl && newTags) {
      const arr = newTags.split(',').map(t => t.trim()).filter(t => t);
      tagsEl.innerHTML = arr.map(t => '<span class="p-tag-pill">' + t + '</span>').join('');
    }
    saveSiteContent();
  }

  function applyAllLedger() {
    ledgerItems.forEach(item => applyLedgerItem(item.id));
    showToast('Ledger changes applied!');
  }

  $('adm-ledger-apply').onclick = applyAllLedger;

  /* =========== SETTINGS & ACCESS CONFIG =========== */
  $('adm-settings-apply').onclick = () => {
    const newPwd = $('adm-set-pwd').value.trim();
    const newShortcut = $('adm-set-shortcut').value;
    
    if (newPwd) {
      localStorage.setItem(PASSWORD_KEY, newPwd);
      showToast('Password updated successfully!');
    }
    
    localStorage.setItem(SHORTCUT_KEY, newShortcut);
    updateShortcutHint();
    showToast('Admin access settings applied!');
    saveSiteContent();
  };

  $('adm-settings-reset').onclick = () => {
    if (confirm('WARNING: This will clear all custom edits, media, fonts, colors, and revert to default values. Continue?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PASSWORD_KEY);
      localStorage.removeItem(SHORTCUT_KEY);
      window.location.reload();
    }
  };

  /* =========== STORAGE AND PERSISTENCE ENGINE =========== */
  let _saveDebounceTimer = null;
  function saveSiteContent() {
    if (_saveDebounceTimer) return;
    _saveDebounceTimer = setTimeout(() => {
      _saveDebounceTimer = null;
      try {
        const data = {
          texts: {},
          images: {},
          links: {},
          videos: {},
          theme: {},
          visibility: {},
          animSettings: {
            fps: window._admAnimFPS || 12,
            frames: window._admAnimFrames || 110,
            folder: window._admAnimFolder || 'mac-jpg',
            prefix: window._admAnimPrefix || 'ezgif-frame-'
          }
        };

        // Gather texts (use textContent to prevent nested HTML duplication)
        document.querySelectorAll('[data-adm-id^="txt-"]').forEach(el => {
          data.texts[el.getAttribute('data-adm-id')] = el.textContent;
        });
        
        // Gather images
        document.querySelectorAll('[data-adm-id^="img-"]').forEach(img => {
          data.images[img.getAttribute('data-adm-id')] = {
            src: img.getAttribute('src'),
            alt: img.alt || ''
          };
        });

        // Gather links
        document.querySelectorAll('[data-adm-id^="lnk-"]').forEach(lnk => {
          data.links[lnk.getAttribute('data-adm-id')] = {
            text: lnk.innerHTML,
            href: lnk.getAttribute('href') || '',
            target: lnk.getAttribute('target') || ''
          };
        });

        // Gather videos
        document.querySelectorAll('[data-adm-id^="vid-"]').forEach(vid => {
          data.videos[vid.getAttribute('data-adm-id')] = {
            src: vid.getAttribute('src') || ''
          };
        });

        // Gather ledger tags
        data.ledger = {};
        ledgerItems.forEach(item => {
          const card = getLedgerCard(item.vidId);
          if (!card) return;
          const tagsEl = card.querySelector('.p-tags');
          if (tagsEl) {
            data.ledger[item.id] = {
              tags: Array.from(tagsEl.querySelectorAll('.p-tag-pill')).map(s => s.textContent.trim()).join(', ')
            };
          }
        });

        // Gather styles
        const rootStyle = document.documentElement.style;
        colorMap.forEach(c => {
          data.theme[c.prop] = rootStyle.getPropertyValue(c.prop) || defaultColors[c.prop];
        });
        data.theme['--emerald-deep'] = rootStyle.getPropertyValue('--emerald-deep') || defaultColors['--emerald-deep'];
        
        const themeVars = [
          '--font-headings', '--font-body',
          '--font-size-headings-multiplier', '--font-size-body-multiplier',
          '--anim-duration-multiplier'
        ];
        themeVars.forEach(v => {
          data.theme[v] = rootStyle.getPropertyValue(v) || '1';
        });

        // Gather visibility
        sectionMap.forEach(sec => {
          const el = document.querySelector(sec.sel);
          if(el) {
            data.visibility[sec.sel] = el.style.display !== 'none';
          }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch(e) {
        console.warn('LocalStorage save failed:', e);
      }
    }, 300);
  }

  function restoreSiteContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.texts) {
        Object.entries(data.texts).forEach(([id, html]) => {
          const el = document.querySelector(`[data-adm-id="${id}"]`);
          if (el) {
            // Strip any nested HTML tags (fixes duplicated h2 bug)
            const clean = html.replace(/<[^>]*>/g, '');
            el.innerHTML = clean;
          }
        });
      }
      
      if (data.images) {
        Object.entries(data.images).forEach(([id, imgInfo]) => {
          const el = document.querySelector(`[data-adm-id="${id}"]`);
          if (el) {
            if (imgInfo.src) el.setAttribute('src', imgInfo.src);
            if (imgInfo.alt !== undefined) el.setAttribute('alt', imgInfo.alt);
          }
        });
      }

      if (data.links) {
        Object.entries(data.links).forEach(([id, lnkInfo]) => {
          const el = document.querySelector(`[data-adm-id="${id}"]`);
          if (el) {
            if (lnkInfo.text) el.innerHTML = lnkInfo.text;
            if (lnkInfo.href !== undefined) el.setAttribute('href', lnkInfo.href);
            if (lnkInfo.target !== undefined) {
              if (lnkInfo.target) el.setAttribute('target', lnkInfo.target);
              else el.removeAttribute('target');
            }
          }
        });
      }

      if (data.videos) {
        Object.entries(data.videos).forEach(([id, vidInfo]) => {
          const el = document.querySelector(`[data-adm-id="${id}"]`);
          if (el) {
            if (vidInfo.src) el.setAttribute('src', vidInfo.src);
          }
        });
      }

      if (data.ledger) {
        Object.entries(data.ledger).forEach(([id, lgInfo]) => {
          if (!lgInfo.tags) return;
          const item = ledgerItems.find(p => p.id === id);
          if (!item) return;
          const card = getLedgerCard(item.vidId);
          if (!card) return;
          const tagsEl = card.querySelector('.p-tags');
          if (tagsEl) {
            const arr = lgInfo.tags.split(',').map(t => t.trim()).filter(t => t);
            tagsEl.innerHTML = arr.map(t => '<span class="p-tag-pill">' + t + '</span>').join('');
          }
        });
      }

      if (data.theme) {
        Object.entries(data.theme).forEach(([prop, val]) => {
          document.documentElement.style.setProperty(prop, val);
          if (prop === '--font-headings' || prop === '--font-body') {
            loadGoogleFont(val);
          }
        });
      }

      if (data.visibility) {
        Object.entries(data.visibility).forEach(([sel, visible]) => {
          const el = document.querySelector(sel);
          if (el) el.style.display = visible ? '' : 'none';
        });
      }

      if (data.animSettings) {
        // Upgrade legacy animation settings if they point to the old low-frame folder
        if (data.animSettings.folder === 'ezgif-3c4313116de238d9-jpg') {
          data.animSettings.folder = 'mac-jpg';
          data.animSettings.frames = 110;
          data.animSettings.fps = 12;
        }
        window._admAnimFPS = data.animSettings.fps;
        window._admAnimFrames = data.animSettings.frames;
        window._admAnimFolder = data.animSettings.folder;
        window._admAnimPrefix = data.animSettings.prefix;
        if(window._admReloadCanvas) window._admReloadCanvas();
      }
      updateWhatsAppLinks();
    } catch(e) {
      console.warn('LocalStorage restore failed:', e);
    }
  }

  $('adm-save-all').onclick = () => {
    saveSiteContent();
    showToast('💾 Saved all changes successfully!');
  };

  /* =========== BAKE & EXPORT HTML SYSTEM =========== */
  $('adm-export-btn').onclick = () => {
    // Clone page node
    const clone = document.documentElement.cloneNode(true);
    
    // Remove direct edit mode / active classes from body
    const bodyNode = clone.querySelector('body');
    if (bodyNode) {
      bodyNode.classList.remove('adm-active', 'adm-edit-mode');
      bodyNode.style.paddingTop = '';
    }

    // Clean up all edit-mode attributes from the clone's elements
    clone.querySelectorAll('[data-adm-id]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-editable');
      el.removeAttribute('spellcheck');
      if (!el.getAttribute('data-adm-id').startsWith('lnk-')) {
        el.onclick = null;
      }
    });

    // Reset admin elements to hidden state (they may have been open when user clicked export)
    const admBar = clone.querySelector('#adm-bar');
    if (admBar) admBar.classList.remove('adm-bar-show');
    const admPanel = clone.querySelector('#adm-panel-wrap');
    if (admPanel) admPanel.classList.remove('adm-panel-open');
    const admOverlay = clone.querySelector('#adm-overlay');
    if (admOverlay) admOverlay.classList.remove('adm-show');
    const admToast = clone.querySelector('#adm-toast');
    if (admToast) admToast.style.opacity = '0';
    const admEditBanner = clone.querySelector('.adm-edit-banner');
    if (admEditBanner) admEditBanner.style.display = 'none';

    // Inject currently applied CSS variables directly into style/root
    const styleEl = clone.querySelector('style');
    if (styleEl) {
      let css = styleEl.textContent;
      const rootStyle = document.documentElement.style;
      const themeColors = colorMap.map(c => c.prop).concat([
        '--emerald-deep', '--ink-soft', '--line', '--radius', '--max', '--shadow',
        '--font-headings', '--font-body', 
        '--font-size-headings-multiplier', '--font-size-body-multiplier', 
        '--anim-duration-multiplier'
      ]);

      let rootCssVars = '\n  :root {\n';
      themeColors.forEach(prop => {
        const val = rootStyle.getPropertyValue(prop).trim() || getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
        if(val) rootCssVars += `    ${prop}: ${val};\n`;
      });
      rootCssVars += '  }\n';

      // Replace old :root block with current values
      css = css.replace(/:root\s*\{[^}]*\}/g, rootCssVars);
      styleEl.textContent = css;
    }

    // Build the final HTML file (keeps admin panel with full functionality, but locked)
    const bakedHTML = '<!DOCTYPE html>\n' + clone.outerHTML;
    
    // Create download stream
    const blob = new Blob([bakedHTML], {type: 'text/html'});
    const dlLink = document.createElement('a');
    dlLink.href = URL.createObjectURL(blob);
    dlLink.download = 'rizq-it-baked.html';
    dlLink.click();
    URL.revokeObjectURL(dlLink.href);
    showToast('⬇️ Exported baked HTML with admin panel (password protected)!');
  };

  /* =========== TOAST NOTIFICATIONS =========== */
  function showToast(msg, type = 'success') {
    let toast = $('adm-toast');
    if(!toast) {
      toast = document.createElement('div');
      toast.id = 'adm-toast';
      toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);padding:11px 26px;border-radius:100px;font-size:0.84rem;font-weight:700;z-index:999999;transition:opacity .3s, transform .3s;font-family:Inter,sans-serif;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = type === 'warn' ? '#E0A63A' : '#0E6B4F';
    toast.style.color = type === 'warn' ? '#161A18' : '#fff';
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2800);
  }

  /* =========== DYNAMIC WHATSAPP CTA INTEGRATION =========== */
  function updateWhatsAppLinks() {
    const navPhoneEl = document.querySelector('.nav-phone');
    let rawPhone = '910000000000';
    if (navPhoneEl) {
      rawPhone = navPhoneEl.textContent.trim();
    }
    
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    if (!cleanPhone) {
      cleanPhone = '910000000000';
    }

    const ctaMessage = encodeURIComponent("Hi RIZQ.IT! I'd like to enquire about the price.");
    const waCtaUrl = `https://wa.me/${cleanPhone}?text=${ctaMessage}`;

    // Update bottom CTA button
    const bottomCta = document.querySelector('.cta-band .btn-amber');
    if (bottomCta) {
      bottomCta.setAttribute('href', waCtaUrl);
      bottomCta.setAttribute('target', '_blank');
    }

    // Update floating WhatsApp popup start-chat button
    const floatMessage = encodeURIComponent('Hi RIZQ.IT! I have an inquiry regarding website design and development.');
    const waStartBtn = document.getElementById('waStartChatBtn');
    if (waStartBtn) {
      waStartBtn.setAttribute('href', `https://wa.me/${cleanPhone}?text=${floatMessage}`);
    }
  }

  /* =========== INITIALIZATION =========== */
  initAdminIDs();
  restoreSiteContent();
  updateWhatsAppLinks();
})();
