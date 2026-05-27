/* ============================================================
   KRUISWERK — script.js
   Chatbot, scroll-reveal, multi-step form, activiteiten filter, a11y
   ============================================================ */

(function() {
  'use strict';

  /* ============ CHATBOT ============ */
  const knowledgeBase = [
    { keywords: ['lid', 'word', 'aanmelden', 'inschrijven'], answer: 'Lid worden kan in een paar minuten via <a href="lid-worden.html">de aanmeldpagina</a>. Voor €2,06 per maand profiteert je hele huishouden van 40+ diensten.' },
    { keywords: ['kost', 'prijs', 'tarief', 'euro'], answer: 'Het lidmaatschap kost €2,06 per maand. Je kunt kiezen voor maand, kwartaal of jaarbetaling. <a href="lid-worden.html">Direct lid worden →</a>' },
    { keywords: ['mantelzorg', 'zorgen voor', 'verzorgen'], answer: 'Onze mantelzorgmakelaar helpt jou als je voor iemand zorgt. Met advies, regelzaken, en respijtzorg. Bel 0314 - 357 430 of vraag een gratis Hulp & Adviesgesprek aan.' },
    { keywords: ['acuut', 'noodgeval', '088', 'spoed'], answer: 'Voor leden is er een 24/7 acute hulplijn: <strong>088 - 17 17 345</strong>. Bij levensgevaar bel altijd eerst 112.' },
    { keywords: ['rollator', 'krukken', 'hulpmiddel', 'lenen'], answer: 'Loophulpmiddelen lenen is gratis voor leden. Op te halen bij ons uitleenpunt in Wehl of via Medipoint. <a href="diensten.html#hulpmiddelen">Bekijk alle hulpmiddelen →</a>' },
    { keywords: ['medipoint', 'korting', 'winkel'], answer: 'Als lid krijg je 10% korting op het hele assortiment van Medipoint. Plus gratis loophulpmiddelen lenen. <a href="diensten.html#winkel">Lees meer →</a>' },
    { keywords: ['contact', 'bel', 'mail', 'adres'], answer: 'Bel ons op 0314 - 357 430 (ma-vr 9-13u), mail info@kruiswerk.nl, of kom langs op Beatrixplein 1, Wehl. <a href="contact.html">Volledige contactgegevens →</a>' },
    { keywords: ['advies', 'gesprek', 'expert'], answer: 'Een Hulp & Adviesgesprek is gratis voor leden. Onze expert komt thuis langs en kijkt mee waar je hulp bij nodig hebt. Bel 0314 - 357 430 om er een aan te vragen.' },
    { keywords: ['opzeggen', 'beeindig', 'stoppen'], answer: 'Je kunt maandelijks opzeggen, geen contract. Stuur een mail naar info@kruiswerk.nl met je naam en lidnummer.' },
    { keywords: ['activiteit', 'agenda', 'evenement'], answer: 'Bekijk onze <a href="activiteiten.html">agenda</a> voor Fittest, KUNSTwandeling, Mobiliteitsdagen en dagtochten.' },
    { keywords: ['hallo', 'hoi', 'hey', 'goedemiddag', 'goedemorgen'], answer: 'Hoi! 👋 Waar kan ik je mee helpen? Bijvoorbeeld over lid worden, een specifieke dienst, of mantelzorg.' }
  ];

  function findChatAnswer(query) {
    const q = query.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.answer;
      }
    }
    return 'Goede vraag — daar weet ik zo geen antwoord op. Bel 0314 - 357 430 (ma-vr 9-13u) of stuur een bericht via <a href="contact.html">de contactpagina</a>. We reageren binnen één werkdag.';
  }

  window.openChat = function() {
    const chat = document.getElementById('chatbot');
    const fab = document.getElementById('chatFab');
    if (!chat) return;
    chat.classList.add('open');
    chat.setAttribute('aria-hidden', 'false');
    if (fab) fab.classList.add('hidden');
    setTimeout(() => {
      const input = document.getElementById('chatInput');
      if (input) input.focus();
    }, 320);
  };

  window.closeChat = function() {
    const chat = document.getElementById('chatbot');
    const fab = document.getElementById('chatFab');
    if (!chat) return;
    chat.classList.remove('open');
    chat.setAttribute('aria-hidden', 'true');
    if (fab) fab.classList.remove('hidden');
  };

  function appendMsg(text, type) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    const messages = document.getElementById('chatMessages');
    if (!messages) return null;
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingIndicator';
    div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    div.style.padding = '4px';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  window.askChat = function(question) {
    appendMsg(question, 'user');
    const typing = showTyping();
    setTimeout(() => {
      if (typing) typing.remove();
      appendMsg(findChatAnswer(question), 'bot');
    }, 700 + Math.random() * 500);
  };

  window.sendChatMessage = function(event) {
    event.preventDefault();
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    const value = input.value.trim();
    input.value = '';
    askChat(value);
  };

  window.heroLaunchChat = function() { openChat(); };

  window.relyScroll = function(direction) {
    const track = document.querySelector('.rely-track');
    if (!track) return;
    const firstCard = track.querySelector('li');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 340;
    track.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });
  };

  window.heroAskBente = function(event, presetQuestion) {
    if (event && event.preventDefault) event.preventDefault();
    let question = presetQuestion;
    if (!question) {
      const input = document.getElementById('bente-input');
      if (!input || !input.value.trim()) return;
      question = input.value.trim();
      input.value = '';
    }
    openChat();
    setTimeout(() => askChat(question), 280);
  };

  /* ============ COOKIE BANNER ============ */
  function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    if (localStorage.getItem('kw_cookies')) return;
    setTimeout(() => banner.classList.add('show'), 1200);
    banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('kw_cookies', btn.dataset.cookieAction);
        banner.classList.remove('show');
      });
    });
  }

  /* ============ SCROLL REVEAL ============ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('in-view'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger, .join-underline').forEach(el => obs.observe(el));
  }

  /* ============ HEADER SCROLL ============ */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 100) header.style.boxShadow = '0 2px 16px rgba(24,22,18,0.06)';
      else header.style.boxShadow = 'none';
      lastY = y;
    }, { passive: true });
  }

  /* ============ MOBILE MENU ============ */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-main');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        nav.style.cssText = 'display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:var(--kw-cream); padding:16px 24px; border-bottom:1px solid var(--kw-line); gap:0;';
        nav.querySelectorAll('a').forEach(a => a.style.cssText = 'padding:14px 16px; border-radius:8px; display:block;');
      } else {
        nav.style.cssText = '';
        nav.querySelectorAll('a').forEach(a => a.style.cssText = '');
      }
    });
  }

  /* ============ TEXT SIZE TOGGLE ============ */
  function initTextSize() {
    const btn = document.getElementById('textSizeBtn');
    if (!btn) return;
    const sizes = [
      { label: 'Aa Tekst groter', size: '17px' },
      { label: 'Aa+ Groter',     size: '19px' },
      { label: 'Aa++ Grootst',   size: '21px' }
    ];
    let idx = parseInt(localStorage.getItem('kw_textSize') || '0');
    apply();
    btn.addEventListener('click', () => {
      idx = (idx + 1) % sizes.length;
      localStorage.setItem('kw_textSize', idx);
      apply();
    });
    function apply() {
      document.body.style.fontSize = sizes[idx].size;
      btn.textContent = sizes[idx].label;
    }
  }

  /* ============ CONTRAST TOGGLE ============ */
  function initContrast() {
    const btn = document.getElementById('contrastBtn');
    if (!btn) return;
    const on = localStorage.getItem('kw_contrast') === '1';
    if (on) document.documentElement.classList.add('high-contrast');
    btn.addEventListener('click', () => {
      const isOn = document.documentElement.classList.toggle('high-contrast');
      localStorage.setItem('kw_contrast', isOn ? '1' : '0');
    });
  }

  /* ============ MULTI-STEP FORM (lid-worden) ============ */
  function initMultiStepForm() {
    const form = document.getElementById('lidForm');
    if (!form) return;
    const steps = form.querySelectorAll('.form-step');
    const progressBar = form.querySelector('.form-progress-bar');
    const progressLabel = form.querySelector('.form-progress-label');
    const success = document.getElementById('formSuccess');
    let current = 0;

    function showStep(idx) {
      steps.forEach((step, i) => {
        step.hidden = i !== idx;
      });
      const pct = ((idx + 1) / steps.length) * 100;
      if (progressBar) progressBar.style.width = pct + '%';
      if (progressLabel) progressLabel.textContent = `Stap ${idx + 1} van ${steps.length}`;
      window.scrollTo({ top: form.offsetTop - 80, behavior: 'smooth' });
    }

    function validateStep(idx) {
      const step = steps[idx];
      const required = step.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          field.removeAttribute('aria-invalid');
        }
      });
      if (!valid) {
        const firstInvalid = step.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
      return valid;
    }

    form.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!validateStep(current)) return;
        current = Math.min(current + 1, steps.length - 1);
        showStep(current);
      });
    });

    form.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        current = Math.max(current - 1, 0);
        showStep(current);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;
      form.style.display = 'none';
      if (success) {
        success.hidden = false;
        window.scrollTo({ top: success.offsetTop - 80, behavior: 'smooth' });
      }
    });
  }

  /* ============ ACTIVITEITEN FILTER ============ */
  function initActFilters() {
    const filters = document.querySelectorAll('.act-filter');
    const cards = document.querySelectorAll('.act-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        const type = filter.dataset.filter;
        cards.forEach(card => {
          const cardType = card.dataset.type;
          if (type === 'all' || cardType === type) {
            card.style.display = '';
            card.style.animation = 'msgIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============ ACTIVITEITEN AANMELDEN ============ */
  window.toggleAanmelden = function(btn) {
    const card = btn.closest('.act-card');
    if (!card) return;
    const isExpanded = card.classList.toggle('expanded');
    if (isExpanded) {
      // Focus op eerste input bij openen
      setTimeout(() => {
        const firstInput = card.querySelector('.act-aanmelden-form input');
        if (firstInput) firstInput.focus();
      }, 200);
      // Scroll de card in beeld
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  window.submitAanmelden = function(event, formEl) {
    event.preventDefault();
    const card = formEl.closest('.act-card');
    if (!card) return;
    const inputs = formEl.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(field => {
      if (!field.value.trim()) {
        field.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        field.removeAttribute('aria-invalid');
      }
    });
    if (!valid) {
      formEl.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    // Lees naam
    const naam = formEl.querySelector('[name="naam"]').value.trim();
    const titel = card.querySelector('h3').textContent.trim();

    // Verwijder formulier, plaats success-bericht
    const wachtlijst = card.querySelector('.act-spots-vol') !== null;
    const successHTML = `
      <div class="act-success">
        <div style="display:flex; align-items:flex-start;">
          <span class="act-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
          </span>
          <div>
            <strong>Bedankt ${naam}!</strong>
            <p>${wachtlijst
              ? `Je staat op de wachtlijst voor "${titel}". We laten je weten zodra er een plek vrijkomt.`
              : `Je bent ingeschreven voor "${titel}". Je ontvangt binnen één werkdag een bevestiging per e-mail.`
            }</p>
          </div>
        </div>
      </div>
    `;
    const formContainer = card.querySelector('.act-aanmelden-form');
    formContainer.insertAdjacentHTML('afterend', successHTML);
    card.classList.add('confirmed');

    // Plekken counter aanpassen
    if (!wachtlijst) {
      const spots = parseInt(card.dataset.spots) - 1;
      card.dataset.spots = spots;
      const spotsDisplay = card.querySelector('[data-spots-display]');
      if (spotsDisplay) {
        if (spots <= 0) {
          spotsDisplay.textContent = 'Vol — wachtlijst';
          spotsDisplay.classList.add('act-spots-vol');
        } else if (spots <= 5) {
          spotsDisplay.textContent = `Nog ${spots} plekken — wees er snel bij`;
          spotsDisplay.classList.add('act-spots-bijna');
        } else {
          spotsDisplay.textContent = `${spots} plekken beschikbaar`;
        }
      }
    }
  };

  /* ============ SCROLL PROGRESS — "Direct waar je op kunt rekenen" ============ */
  function initRelyScroll() {
    const track = document.querySelector('.rely-track');
    const thumb = document.querySelector('.rely-progress-thumb');
    const progress = document.querySelector('.rely-progress');
    if (!track || !thumb || !progress) return;

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) {
        progress.style.display = 'none';
        return;
      }
      progress.style.display = '';
      const visibleRatio = track.clientWidth / track.scrollWidth;
      const thumbWidthPct = Math.max(15, visibleRatio * 100);
      const progressPct = (track.scrollLeft / max) * (100 - thumbWidthPct);
      thumb.style.width = thumbWidthPct + '%';
      thumb.style.transform = `translateX(${(progressPct / thumbWidthPct) * 100}%)`;
    }

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ============ INIT ============ */
  function init() {
    initCookieBanner();
    initScrollReveal();
    initHeaderScroll();
    initMobileMenu();
    initTextSize();
    initContrast();
    initMultiStepForm();
    initActFilters();
    initRelyScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
