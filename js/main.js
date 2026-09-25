/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'silia-pizza',
    whatsapp: {
      number: '3902100409296',
      message: 'Ciao Silia! Vorrei prenotare un tavolo per … persone, il … alle …',
      ids: ['prenotaTavolo'],
    },
    /* tutti i giorni 11:30–23:30 (Google e la pagina eatbu; il loro sito Lovable dice 12–23: in nota) */
    hours: {
      0: [['11:30', '23:30']], 1: [['11:30', '23:30']], 2: [['11:30', '23:30']], 3: [['11:30', '23:30']],
      4: [['11:30', '23:30']], 5: [['11:30', '23:30']], 6: [['11:30', '23:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1180,
    EN: {
      'm.salta': 'Skip to content',
      'm.top': 'Silia Pizza al Trancio, back to the top',
      'm.voci': 'The lines of the order',
      'm.lingua': 'Language',
      'm.menu': 'Open the menu',
      'm.lightbox': 'Enlarged photo',
      'm.chiudi': 'Close',
      't.cosa': 'pizza by the slice',
      't.chiama': 'Call',
      'v.forno': 'Oven', 'v.tranci': 'Slices', 'v.special': 'Specials', 'v.teglie': 'Trays', 'v.cucina': 'Kitchen', 'v.qui': 'Eat in', 'v.note': 'Reviews', 'v.dove': 'Hours',
      'h.cosa': 'pizza by the slice · wood-fired oven',
      'h.tel': 'Phone and WhatsApp',
      'h.comanda': 'Order',
      'h.asporto': 'to pick up',
      'h.titolo': 'Crunchy, quick, no fuss.',
      'h.sotto': 'Tall, light pizza by the slice from the wood-fired oven, at Via Giambellino 90. <span class="evidenzia">Drop by when you’re really hungry.</span>',
      'h.ordina': 'Order and pick up',
      'h.chiama': 'Call',
      'h.come': 'Pick your slices and press «+ regular» or «+ large»: your order prints at the bottom of the screen and goes out on WhatsApp.',
      'f.t': 'wood-fired oven',
      'f.p1': 'The oven burns wood and has a copper dome, right behind the counter: it’s on the sign too, «pizzeria con forno a legna». The pizza bakes in a round iron pan, comes out tall and is cut into six slices.',
      'f.q': '«The real strength here is the dough: tall, fragrant and incredibly light.»',
      'f.qsu': 'on Google',
      'f.p2': 'And soft on purpose. «Our slice is deliberately soft», the owner writes.',
      'f.k1': 'Baking', 'f.v1': 'wood-fired oven',
      'f.k2': 'Pan', 'f.v2': 'round, six slices',
      'f.k3': 'Dough', 'f.v3': 'tall and light',
      'f.k4': 'Base and top', 'f.v4': 'crunchy and soft',
      'f.k5': 'Sizes', 'f.v5': 'regular · large',
      'f.alt': 'The wood-fired oven with its copper dome; in front, seen from behind, the pizza maker in Silia’s yellow T-shirt, and the copper bell on the counter',
      'f.cap': 'The oven, from the counter.',
      't.t': 'slices',
      't.p': 'Thirty recipes, each in two sizes. Press <b>+ regular</b> or <b>+ large</b>: the line prints on your order, at the bottom of the screen.',
      't.nojs': 'To order: call or message on WhatsApp, 02 1004 09296.',
      't.silia2': '«our gourmet slice»',
      't.silia': 'tomato, mozzarella, mortadella, stracciatella, crushed pistachio',
      't.marinara': 'tomato and oregano',
      't.margherita': 'tomato, mozzarella',
      't.margheritadoppia.n': 'Margherita, double mozzarella',
      't.margheritadoppia': 'tomato, double mozzarella',
      't.mediterranea': 'tomato, olives, capers, anchovies',
      't.scamorza': 'tomato, mozzarella, scamorza',
      't.acciughe': 'tomato, mozzarella, anchovies',
      't.acciughecapperi.n': 'Anchovies and capers',
      't.acciughecapperi': 'tomato, mozzarella, anchovies, capers',
      't.cotto': 'tomato, mozzarella, cooked ham',
      't.cottofunghi.n': 'Ham and mushrooms',
      't.cottofunghi': 'tomato, mozzarella, cooked ham, mushrooms',
      't.cottocarciofi.n': 'Ham and artichokes',
      't.cottocarciofi': 'tomato, mozzarella, cooked ham, artichokes',
      't.sohaila': 'tomato, mozzarella, cherry tomatoes, grana shavings, rocket',
      't.gustosa': 'tomato, mozzarella, gorgonzola, bacon',
      't.salame.n': 'Spicy salami',
      't.salame': 'tomato, mozzarella, spicy salami',
      't.salamefunghi.n': 'Salami and mushrooms',
      't.salamefunghi': 'tomato, mozzarella, spicy salami, mushrooms',
      't.salamescamorza.n': 'Salami and scamorza',
      't.salamescamorza': 'tomato, mozzarella, spicy salami, scamorza',
      't.salamezola.n': 'Salami and gorgonzola',
      't.salamezola': 'tomato, mozzarella, spicy salami, gorgonzola',
      't.crudoburrata': 'tomato, mozzarella, prosciutto crudo, fresh burrata',
      't.crudorucola.n': 'Prosciutto crudo and rocket',
      't.crudorucola': 'tomato, mozzarella, prosciutto crudo, rocket',
      't.speck.n': 'Speck and scamorza',
      't.speck': 'tomato, mozzarella, speck and scamorza',
      't.montanara': 'tomato, mozzarella, mushrooms, speck, grana shavings',
      't.wurstel': 'tomato, mozzarella, frankfurters',
      't.patatine.n': 'Chips and frankfurters',
      't.patatine': 'tomato, mozzarella, chips, frankfurters',
      't.tonno.n': 'Tuna',
      't.tonno': 'tomato, mozzarella, tuna',
      't.tonnocipolla.n': 'Tuna and onion',
      't.tonnocipolla': 'tomato, mozzarella, tuna and red onion',
      't.salmone.n': 'Salmon and burrata',
      't.salmone': 'tomato, mozzarella, smoked salmon, burrata, a hint of lemon',
      't.salsiccia.n': 'Sausage and friarielli',
      't.salsiccia': 'tomato, mozzarella, sausage, friarielli (broccoli rabe)',
      't.stagioni.n': 'Four seasons',
      't.stagioni': 'tomato, mozzarella, cooked ham, mushrooms, olives, artichokes',
      't.formaggi.n': 'Four cheeses',
      't.formaggi': 'tomato, mozzarella, scamorza, gorgonzola, grana shavings',
      't.verdure.n': 'Grilled vegetables',
      't.verdure': 'tomato, mozzarella, aubergine, courgette, peppers',
      's.t': 'specials of the month',
      's.p': 'Every month there’s a special on the counter too, with its own sign. On the menu now:',
      's.crunchy': 'tomato, mozzarella, brie, honey, pancetta and almonds: creamy brie with crispy pancetta, toasted almonds and honey',
      's.dubai': 'pistachio ricotta, crunchy kataifi, pistachio cream and a dusting of bitter cocoa',
      's.vesuvio': 'stretchy mozzarella, sausage and sautéed friarielli: a Neapolitan classic',
      's.salmone': 'Scottish smoked salmon, fresh burrata and lemon zest',
      's.alt': 'The sign «Pizza del MESE: prosciutto crudo, stracciatella e fichi freschi» on the glass counter, and the fig slice on a dark plate',
      's.cap': 'The pizza-of-the-month sign: that time, prosciutto crudo, stracciatella and fresh figs.',
      'p.t': 'pizza maker for a day',
      'p.p': '«Pizzaiolo per un giorno!», pizza maker for a day, is what they call it. Pick the format, and write the toppings in the note of your order.',
      'p.f1': 'Your own slice', 'p.f1d': 'choose and build your slice to measure',
      'p.f2': 'Half tray', 'p.f2d': '3 slices of your choice',
      'p.f3': 'Whole tray', 'p.f3d': '6 slices of your choice',
      'p.pronte': 'Ready trays · 6 slices',
      'p.t1': 'tomato, mozzarella, basil',
      'p.t2': 'tomato, garlic, oregano, olive oil',
      'p.t3n': 'Four seasons', 'p.t3': 'tomato, mozzarella, ham, mushrooms, artichokes',
      'p.t4n': 'Grilled vegetables', 'p.t4': 'tomato, mozzarella, mixed grilled vegetables',
      'p.t5n': 'Tuna and onion', 'p.t5': 'tomato, mozzarella, tuna, onion',
      'p.t6n': 'Frankfurters and chips', 'p.t6': 'tomato, mozzarella, frankfurters, chips',
      'p.alt': 'A round black iron pan with a margherita fresh out of the oven; behind it, in the dining room, the «Silia» neon sign and a yellow chair',
      'p.cap': 'The round pan: six slices.',
      'c.t': 'from the kitchen',
      'c.p': 'Not only slices: the kitchen makes dishes too, and dessert comes last.',
      'c.1n': 'Lasagna alla bolognese', 'c.1': 'meat ragù, béchamel and Parmigiano, baked',
      'c.2n': 'Ricotta cannelloni', 'c.2': 'ricotta and spinach, melted butter and fresh sage',
      'c.3n': 'Aubergine parmigiana', 'c.3': 'baked, with tomato, mozzarella and Parmigiano',
      'c.4': 'beef, with olive oil, capers and lemon, and a baked potato',
      'c.5n': 'Cotoletta', 'c.5': 'golden and crunchy, with chips',
      'c.6n': 'Half chicken', 'c.6': 'roast, with baked potatoes',
      'c.7': 'beef, tomatoes, crispy bacon, lettuce, BBQ sauce',
      'c.8': 'beef, smoked scamorza, tomatoes, lettuce, mayonnaise',
      'c.9n': 'Mixed salad', 'c.9': 'iceberg, tomato, sweetcorn, tuna and mozzarella',
      'c.10n': 'Piadina delicata', 'c.10': 'cooked ham, tomato, lettuce, mayonnaise',
      'c.11n': 'Piadina classica', 'c.11': 'prosciutto crudo, tomato, lettuce, BBQ sauce',
      'c.12n': 'Baked potatoes or chips', 'c.12': 'the side',
      'c.dolci': 'Desserts',
      'c.d1n': 'Nougat semifreddo',
      'c.d2': 'ladyfingers and mascarpone cream',
      'c.d3n': 'Tartufo, dark or white',
      'c.d4': 'ice cream with chocolate chips',
      'c.d5n': 'Crème brûlée in a clay pot',
      'c.d6n': 'Filled coconut', 'c.d6': 'coconut ice cream in its shell',
      'c.alt1': 'The lasagna in its clay dish, on a black plate',
      'c.alt2': 'The golden cotoletta with chips, on a dark plate seen from above',
      'c.alt3': 'The piadina delicata with cooked ham, tomato and lettuce, on a dark plate',
      'c.cap3': 'The piadina delicata.',
      'q.t': 'eat in or take away',
      'q.k1': 'Eat in', 'q.v1': 'Two rooms: the first in the window, by the entrance; the second upstairs, quieter, with the «silia» letters on the wall. And tables outside, on the pavement.',
      'q.k2': 'Aperipizza', 'q.v2': 'The aperitivo comes with slices fresh from the oven. Spritz, draught beer, a glass of wine.',
      'q.k3': 'To pick up', 'q.v3': 'Build your order here, send it on WhatsApp and come and collect it. Or call.',
      'q.k4': 'Delivery', 'q.v4': 'They deliver too, through the delivery apps.',
      'q.prenota': 'Book a table',
      'q.prenotad': 'You can also book on WhatsApp, same number: 02 1004 09296.',
      'q.alt1': 'The upstairs room: the golden «silia» letters on the wall, wooden tables, yellow and grey chairs',
      'q.cap1': 'The room upstairs.',
      'q.alt2': 'The long table laid outside, on the pavement, along the stone wall of the building',
      'q.cap2': 'The tables outside.',
      'n.t': 'notes',
      'n.p': 'From the 280 reviews on Google, just as they were written.',
      'n.d1': '1 month ago', 'n.d2': '10 months ago', 'n.d3': '11 months ago', 'n.d4': '2 years ago', 'n.d5': '2 years ago',
      'n.lingua': 'The reviews are in Italian, as on Google.',
      'n.tutte': 'All the reviews on Google →',
      'd.t': 'open 11:30–23:30',
      'd.alt': 'Silia’s shop windows on Via Giambellino, with the black and yellow signs «BAR» and «SILIA · pizzeria con forno a legna», and the yellow tram going by',
      'd.cap': 'Via Giambellino 90, with the tram going by.',
      'd.cap2': 'Opening hours of Silia Pizza al Trancio',
      'd.lun': 'Monday', 'd.mar': 'Tuesday', 'd.mer': 'Wednesday', 'd.gio': 'Thursday', 'd.ven': 'Friday', 'd.sab': 'Saturday', 'd.dom': 'Sunday',
      'd.k1': 'Phone and WhatsApp',
      'd.k2': 'Payments', 'd.v2': 'credit and debit cards',
      'd.k3': 'Parking', 'd.v3': 'free, on the street',
      'd.mappa': 'Map: Silia Pizza al Trancio, Via Giambellino 90, Milan',
      'z.grazie': 'Thank you for choosing Silia Pizza al Trancio!',
      'z.cred': 'Demo website made by <a href="https://bespokestud.io" rel="noopener">Bespoke Studio</a> · texts from their website, their menu, their social pages and the Google listing (September 2026); public reviews on Google; the slice photos from their website, the others from the Google listing; the dripping slice redrawn from their logo.',
      'z.su': 'Back to the top ↑',
      'k.tua': 'Your order',
      'k.chiamaaria': 'Call Silia: 02 1004 09296',
      'k.chiama': 'Call',
      'k.titolo': 'Your order',
      'k.chiudi': 'Close the order',
      'k.vuota': 'Your order is empty. Pick slices from the menu: «+ regular» or «+ large».',
      'k.quando': 'Pick-up',
      'k.nome': 'Name',
      'k.nota': 'Note',
      'k.notaph': 'the tray toppings, well done…',
      'k.invia': 'Send on WhatsApp',
      'k.oppure': 'Or call',
      'k.info': 'No prices here: the order reaches Silia on WhatsApp, in Italian, and they confirm it.',
      'k.svuota': 'Clear the order',
      'k.normale': 'regular',
      'k.abbondante': 'large',
      'k.aggiungi': 'add',
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ SILIA PIZZA AL TRANCIO — la comanda ══════════
     La pagina è lo scontrino che esce dalla stampante del banco. Qui:
     1. la FIRMA: all'apertura la carta esce dalla fessura a scatti, riga per riga, poi suona il campanello di rame
        e il trancio Silia si appoggia sullo scontrino. Stato finale in HTML/CSS; lo stato iniziale lo mette lo script
        in testa (classe .stampa-attesa, solo con JS e senza reduced-motion), con la rete CSS di 4 s;
     2. la COMANDA del visitatore: «+ normale» / «+ abbondante» stampano un bigliettino dalla fessura, il contatore
        della stampante sale, il cassetto è lo scontrino del visitatore e parte su WhatsApp (sempre in italiano, per
        la cucina), al numero a cui già scrive il loro sistema d'ordine. */
  var stampante = document.getElementById('stampante');
  var scontrino = document.getElementById('scontrino');
  var campanello = document.getElementById('campanello');
  var biglietto = document.getElementById('biglietto');
  var bigliettoTesto = document.getElementById('bigliettoTesto');
  var annuncio = document.getElementById('annuncio');
  var posatoTesta = document.querySelector('.posato--testa');
  var WA = SITE.whatsapp.number;
  var EN = SITE.LANGS.en || {};
  var IT = { 'k.normale': 'normale', 'k.abbondante': 'abbondante', 'k.aggiungi': 'aggiungi' };
  function inglese() { return root.lang === 'en'; }
  function tr(key) { return inglese() && EN[key] !== undefined ? EN[key] : IT[key]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function voce(id) { return document.querySelector('.voce[data-id="' + id + '"]'); }
  function nomeOra(li) {
    var el = li && li.querySelector('.voce__nome'); if (!el) return '';
    var c = el.cloneNode(true); var loro = c.querySelector('.voce__loro'); if (loro) loro.remove();
    return c.textContent.replace(/\s+/g, ' ').trim();
  }
  /* il nome in italiano anche con la pagina in inglese: la comanda va in cucina */
  function nomeIT(li) {
    var el = li && li.querySelector('.voce__nome'); if (!el) return '';
    var key = el.getAttribute('data-i18n');
    if (key && root.lang !== 'it' && originals['data-i18n'] && originals['data-i18n'][key] !== undefined) {
      var t = document.createElement('div'); t.innerHTML = originals['data-i18n'][key]; return t.textContent.replace(/\s+/g, ' ').trim();
    }
    return nomeOra(li);
  }

  /* ---------- lo stato e l'ora stampati nella comanda ---------- */
  var stato1 = document.getElementById('orarioStato'), stato2 = document.getElementById('orarioStato2');
  function copiaStato() { if (stato1 && stato2 && stato2.textContent !== stato1.textContent) stato2.textContent = stato1.textContent; }
  copiaStato();
  if (stato1 && 'MutationObserver' in window) new MutationObserver(copiaStato).observe(stato1, { childList: true, characterData: true, subtree: true });
  var oraEl = document.getElementById('oraAdesso');
  function scriviOra() { if (oraEl) oraEl.textContent = (inglese() ? 'time ' : 'ore ') + fmt(romeNow().mins); }
  scriviOra();
  setInterval(scriviOra, 30000);

  /* ---------- i tasti del menu: generati qui, perché senza JS non servono ---------- */
  document.querySelectorAll('.voce[data-id]').forEach(function (li) {
    var box = li.querySelector('.voce__cmd'); if (!box) return;
    var misure = li.hasAttribute('data-una') ? ['1'] : ['normale', 'abbondante'];
    misure.forEach(function (m) {
      var k = m === '1' ? 'k.aggiungi' : 'k.' + m;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'cmd'; b.setAttribute('data-misura', m);
      b.innerHTML = '<span aria-hidden="true">+ </span><span data-i18n="' + k + '">' + IT[k] + '</span><span class="vh"> · ' + esc(nomeOra(li)) + '</span>';
      b.addEventListener('click', function () { aggiungi(li.getAttribute('data-id'), m, b); });
      box.appendChild(b);
    });
  });
  if (root.lang !== 'it') setLang(root.lang); // traduce anche i tasti appena creati

  /* ---------- la comanda ---------- */
  var CHIAVE = SITE.slug + '-comanda';
  var ordine = [];
  try {
    var salvato = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
    if (Array.isArray(salvato)) ordine = salvato.filter(function (r) { return r && voce(r.id) && r.q > 0 && r.q < 100; });
  } catch (e) { ordine = []; }
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(ordine)); } catch (e) {} }
  function totale() { return ordine.reduce(function (a, r) { return a + r.q; }, 0); }
  function trova(id, m) { for (var i = 0; i < ordine.length; i++) if (ordine[i].id === id && ordine[i].m === m) return ordine[i]; return null; }

  var contaVoci = document.getElementById('contaVoci'), contaParola = document.getElementById('contaParola');
  function aggiornaConta() {
    var n = totale();
    if (contaVoci) contaVoci.textContent = n;
    if (contaParola) contaParola.textContent = inglese() ? (n === 1 ? 'item' : 'items') : (n === 1 ? 'voce' : 'voci');
    if (stampante) stampante.classList.toggle('piena', n > 0);
  }

  var bigliettoTl = null;
  if (hasGsap && biglietto) gsap.set(biglietto, { y: 0, yPercent: 105 }); // il translateY(105%) del CSS passa a GSAP come yPercent, non come y in px
  function stampaBiglietto(testo) {
    if (!biglietto || !stampante) return;
    bigliettoTesto.textContent = testo;
    stampante.setAttribute('data-stato', 'stampa');
    clearTimeout(stampaBiglietto.t);
    stampaBiglietto.t = setTimeout(function () { stampante.setAttribute('data-stato', 'pronta'); }, reducedMotion ? 60 : 700);
    if (!hasGsap || reducedMotion) return;
    if (bigliettoTl) bigliettoTl.kill();
    bigliettoTl = gsap.timeline()
      .fromTo(biglietto, { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 0.5, ease: 'steps(6)' })
      .to(biglietto, { yPercent: 105, duration: 0.35, ease: 'power2.in' }, '+=1.3');
  }

  function aggiungi(id, m, btn) {
    var r = trova(id, m);
    if (r) r.q++; else ordine.push({ id: id, m: m, q: 1 });
    salva(); aggiornaConta(); renderCassetto();
    var li = voce(id), nome = nomeOra(li), mis = m === '1' ? '' : tr('k.' + m);
    stampaBiglietto('+1 ' + nome + (mis ? ' · ' + mis : ''));
    if (btn) { btn.classList.add('appena'); setTimeout(function () { btn.classList.remove('appena'); }, 700); }
    if (annuncio) annuncio.textContent = (inglese() ? 'Added: ' : 'Aggiunto: ') + nome + (mis ? ', ' + mis : '') + '. ' + (inglese() ? 'In your order: ' : 'Nella comanda: ') + totale() + '.';
  }

  /* ---------- il cassetto: lo scontrino del visitatore ---------- */
  var cassetto = document.getElementById('cassetto'), apri = document.getElementById('apriComanda'), chiudi = document.getElementById('chiudiComanda');
  var righeEl = document.getElementById('comandaRighe'), vuota = document.getElementById('comandaVuota');
  var quando = document.getElementById('comandaQuando'), nomeInp = document.getElementById('comandaNome'), notaInp = document.getElementById('comandaNota');
  var invia = document.getElementById('inviaComanda'), svuota = document.getElementById('svuotaComanda');
  var daCuiAperto = null;

  function renderCassetto(fuoco) {
    if (!righeEl) return;
    righeEl.innerHTML = '';
    ordine.forEach(function (r, i) {
      var nome = nomeOra(voce(r.id));
      var riga = document.createElement('li'); riga.className = 'riga';
      riga.innerHTML =
        '<span class="riga__qta"><button type="button" data-az="meno" aria-label="' + esc((inglese() ? 'One less: ' : 'Uno in meno: ') + nome) + '">−</button>' +
        '<output>' + r.q + '</output>' +
        '<button type="button" data-az="piu" aria-label="' + esc((inglese() ? 'One more: ' : 'Uno in più: ') + nome) + '">+</button></span>' +
        '<span class="riga__nome">' + esc(nome) + (r.m === '1' ? '' : '<span class="riga__misura">' + esc(tr('k.' + r.m)) + '</span>') + '</span>' +
        '<button type="button" class="riga__via" data-az="via" aria-label="' + esc((inglese() ? 'Remove: ' : 'Togli: ') + nome) + '">×</button>';
      riga.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var az = b.getAttribute('data-az');
        if (az === 'piu') r.q++; else if (az === 'meno') r.q--; else r.q = 0;
        var tolta = r.q <= 0;
        if (tolta) ordine.splice(ordine.indexOf(r), 1);
        salva(); aggiornaConta(); renderCassetto(tolta ? null : { i: i, az: az });
      });
      righeEl.appendChild(riga);
    });
    if (vuota) vuota.hidden = ordine.length > 0;
    aggiornaInvia();
    if (fuoco && righeEl.children[fuoco.i]) { var f = righeEl.children[fuoco.i].querySelector('[data-az="' + fuoco.az + '"]'); if (f) f.focus(); }
    else if (fuoco === null && cassetto && !cassetto.hidden && chiudi) chiudi.focus();
  }

  /* orari di ritiro a quarti d'ora, dentro l'orario (11:30–23:30) */
  function riempiQuando() {
    if (!quando) return;
    var adesso = romeNow().mins, apre = toMin('11:30'), chiude = toMin('23:30'), opts = [];
    var aperto = adesso >= apre && adesso < chiude, prima = adesso < apre;
    if (aperto) opts.push(['subito', inglese() ? 'as soon as it’s ready' : 'appena pronta']);
    var da = aperto ? Math.ceil((adesso + 20) / 15) * 15 : (prima ? apre + 15 : null);
    if (da !== null) for (var t = da; t <= chiude - 15; t += 15) opts.push(['oggi-' + fmt(t), (inglese() ? 'at ' : 'alle ') + fmt(t)]);
    if (!aperto && !prima) for (var u = apre + 15; u <= apre + 195; u += 15) opts.push(['domani-' + fmt(u), (inglese() ? 'tomorrow at ' : 'domani alle ') + fmt(u)]);
    var prec = quando.value;
    quando.innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('');
    if (prec && opts.some(function (o) { return o[0] === prec; })) quando.value = prec;
  }
  function testoComanda() {
    var q = (quando && quando.value) || 'subito';
    var quandoIT = q === 'subito' ? 'appena pronta' : (q.indexOf('oggi-') === 0 ? 'alle ' + q.slice(5) : 'domani alle ' + q.slice(7));
    var righe = ordine.map(function (r) { return r.q + ' × ' + nomeIT(voce(r.id)) + (r.m === '1' ? '' : ' (' + r.m + ')'); });
    var t = 'Ciao Silia! Vorrei ordinare da ritirare ' + quandoIT + ':\n\n' + righe.join('\n');
    var nome = nomeInp ? nomeInp.value.trim() : '', nota = notaInp ? notaInp.value.trim() : '';
    if (nome) t += '\n\nNome: ' + nome;
    if (nota) t += (nome ? '\n' : '\n\n') + 'Nota: ' + nota;
    return t + '\n\n(comanda dal sito)';
  }
  function aggiornaInvia() {
    if (!invia) return;
    var vuoto = ordine.length === 0;
    invia.setAttribute('aria-disabled', vuoto ? 'true' : 'false');
    invia.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(vuoto ? 'Ciao Silia!' : testoComanda());
  }
  [quando, nomeInp, notaInp].forEach(function (el) { if (el) { el.addEventListener('input', aggiornaInvia); el.addEventListener('change', aggiornaInvia); } });
  if (invia) invia.addEventListener('click', function (e) { if (!ordine.length) e.preventDefault(); });

  function apriCassetto() {
    if (!cassetto) return;
    daCuiAperto = document.activeElement;
    riempiQuando(); renderCassetto();
    cassetto.hidden = false; document.body.style.overflow = 'hidden';
    if (apri) apri.setAttribute('aria-expanded', 'true');
    if (chiudi) chiudi.focus();
  }
  function chiudiCassetto() {
    if (!cassetto || cassetto.hidden) return;
    cassetto.hidden = true; document.body.style.overflow = '';
    if (apri) apri.setAttribute('aria-expanded', 'false');
    if (daCuiAperto && daCuiAperto.focus) daCuiAperto.focus();
  }
  if (apri) apri.addEventListener('click', apriCassetto);
  if (chiudi) chiudi.addEventListener('click', chiudiCassetto);
  if (cassetto) {
    cassetto.addEventListener('click', function (e) { if (e.target === cassetto) chiudiCassetto(); });
    document.addEventListener('keydown', function (e) {
      if (cassetto.hidden) return;
      if (e.key === 'Escape') { chiudiCassetto(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(cassetto.querySelectorAll('button, a[href], select, input, textarea')).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  if (svuota) svuota.addEventListener('click', function () { ordine = []; salva(); aggiornaConta(); renderCassetto(); if (chiudi) chiudi.focus(); });

  /* ---------- la vetrina: il trancio accanto allo scontrino (desktop largo) ---------- */
  var vetrinaImg = document.getElementById('vetrinaImg'), vetrinaNomeEl = document.getElementById('vetrinaNome');
  var inVetrina = voce('silia');
  function vetrinaNome() { if (vetrinaNomeEl && inVetrina) vetrinaNomeEl.textContent = nomeOra(inVetrina); }
  function mostra(li) {
    var f = li && li.getAttribute('data-foto'); if (!f || !vetrinaImg) return;
    inVetrina = li;
    var src = f;
    if (vetrinaImg.getAttribute('src') !== src) {
      vetrinaImg.setAttribute('src', src);
      if (hasGsap && !reducedMotion) gsap.fromTo(vetrinaImg, { y: -16 }, { y: 0, duration: 0.3, ease: 'power2.out' });
    }
    vetrinaNome();
    document.querySelectorAll('.voce.attiva').forEach(function (x) { if (x !== li) x.classList.remove('attiva'); });
    li.classList.add('attiva');
  }
  document.querySelectorAll('#menuTranci .voce[data-foto]').forEach(function (li) {
    li.addEventListener('mouseenter', function () { mostra(li); });
    li.addEventListener('focusin', function () { mostra(li); });
  });

  /* ---------- cambio lingua: le parti scritte dallo script ---------- */
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      aggiornaConta(); scriviOra(); vetrinaNome(); copiaStato();
      if (cassetto && !cassetto.hidden) { riempiQuando(); renderCassetto(); }
    });
  });
  aggiornaConta(); renderCassetto();

  /* ---------- la FIRMA: la comanda esce dalla stampante ---------- */
  var stampaTl = null;
  function finaleStampa() {
    root.classList.remove('stampa-attesa');
    if (hasGsap) { gsap.set(scontrino, { clearProps: 'transform' }); if (posatoTesta) gsap.set(posatoTesta, { clearProps: 'transform,opacity' }); }
    if (stampante) stampante.setAttribute('data-stato', 'pronta');
    root.setAttribute('data-firma', 'fatta');
  }
  function suona() {
    var t = gsap.timeline();
    t.call(function () {
      root.setAttribute('data-campanello', 'suonato');
      if (stampante) { stampante.classList.add('suona'); setTimeout(function () { stampante.classList.remove('suona'); }, 900); }
    });
    if (campanello) {
      t.to(campanello, { rotation: 16, duration: 0.07, ease: 'power1.out', transformOrigin: '50% 88%' })
        .to(campanello, { rotation: -12, duration: 0.11, ease: 'sine.inOut' })
        .to(campanello, { rotation: 8, duration: 0.11, ease: 'sine.inOut' })
        .to(campanello, { rotation: -4, duration: 0.12, ease: 'sine.inOut' })
        .to(campanello, { rotation: 0, duration: 0.14, ease: 'sine.out' });
    }
    return t;
  }
  function avviaStampa() {
    if (!root.classList.contains('stampa-attesa') || !hasGsap || reducedMotion || !scontrino || !stampante) { finaleStampa(); return; }
    var cima = scontrino.offsetTop + (parseFloat(getComputedStyle(scontrino).paddingTop) || 0) - (window.scrollY || 0); // la cima della carta, senza transform
    var fessura = window.innerHeight - stampante.offsetHeight + 8;           // dove la carta entra nella stampante
    var da = Math.max(0, fessura - cima);
    gsap.set(scontrino, { y: da });
    if (posatoTesta) gsap.set(posatoTesta, { opacity: 0 });
    root.classList.remove('stampa-attesa');
    root.setAttribute('data-firma', 'stampa');
    stampante.setAttribute('data-stato', 'stampa');
    var righe = Math.max(8, Math.round(da / 40));                            // uno scatto per riga di carta
    stampaTl = gsap.timeline({ onComplete: function () { stampaTl = null; finaleStampa(); } });
    stampaTl.to(scontrino, { y: 0, duration: Math.min(2.2, righe * 0.095), ease: 'steps(' + righe + ')' })
      .call(function () { stampante.setAttribute('data-stato', 'pronta'); })
      .add(suona(), '+=0.08');
    if (posatoTesta) stampaTl.fromTo(posatoTesta, { opacity: 0, y: -70, rotation: -16 }, { opacity: 1, y: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');
    var salta = function () { if (stampaTl) stampaTl.progress(1); };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { window.addEventListener(ev, salta, { once: true, passive: true }); });
  }
  window.bespokeHeroEntrance = avviaStampa;
})();
