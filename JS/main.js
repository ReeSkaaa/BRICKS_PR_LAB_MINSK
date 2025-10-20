document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded ✅");

  // 1) Inject partials first
  await includePartials();

  // 2) After injection, set date
  const dateSpan = document.querySelector(".header-date, .date-box span");
  if (dateSpan) dateSpan.textContent = new Date().toLocaleDateString("ru-RU");

  // 3) Init language switcher
  initLangSwitcher();

  // 4) Optional: footer underline fix
  document.querySelectorAll(".footer-icons a").forEach(a => a.style.textDecoration = "none");
});

// ---- helpers ----
async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");
  for (const node of nodes) {
    const url = node.getAttribute("data-include");
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      node.outerHTML = await res.text();
    } catch (err) {
      console.error("❌ Include failed:", url, err);
      node.innerHTML = `<div style="color:red">Failed to load ${url}</div>`;
    }
  }
}

function initLangSwitcher() {
  // idempotent guard
  if (window.__langInit) return;
  window.__langInit = true;

  const toggle = document.getElementById("langToggle");
  const menu   = document.getElementById("langMenu");
  const label  = document.querySelector(".lang-current");
  if (!toggle || !menu || !label) {
    console.warn("Lang switcher not found");
    return;
  }

  // helpers
  const isOpen = () => menu.classList.contains("open");
  const open   = () => { menu.classList.add("open");  toggle.setAttribute("aria-expanded","true"); };
  const close  = () => { menu.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); };

  // restore saved language
  applyLang(localStorage.getItem("siteLang") || "ru");

  // toggle dropdown (single source of truth)
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  // choose language
  menu.addEventListener("click", (e) => {
    const li = e.target.closest("[data-lang]");
    if (!li) return;
    applyLang(li.getAttribute("data-lang"));
    close();
  });

  // keep clicks inside the menu from bubbling (so outside-click close won’t trigger)
  menu.addEventListener("click", (e) => e.stopPropagation());

  // close on outside click
  document.addEventListener("click", () => { if (isOpen()) close(); });

  // close on Esc
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) close(); });

  function applyLang(lang) {
    localStorage.setItem("siteLang", lang);
    document.documentElement.setAttribute("lang", lang);
    label.textContent = lang.toUpperCase();

    // optional UI text swap for auth buttons (kept from your code)
    const login = document.querySelector(".login-btn");
    const reg   = document.querySelector(".register-btn");
    if (login && reg) {
      if (lang === "en") {
        login.innerHTML = '<i class="fas fa-user"></i> Log in';
        reg.textContent = "Sign up";
      } else {
        login.innerHTML = '<i class="fas fa-user"></i> Войти';
        reg.textContent = "Регистрация";
      }
    }
  }
}




// ===== Mega menu toggle =====
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Inject partials first
  await includePartials();            // <— your existing function

  // 2) Initialize header widgets AFTER injection
  initLangSwitcher();                 // if you use it
  initMegaMenu();                     // <— add this
});

/* ===== Mega menu ===== */
function initMegaMenu(){
  const btn     = document.getElementById('menuToggle');
  const menu    = document.getElementById('megaMenu');
  const overlay = document.getElementById('menuOverlay');

  if (!btn || !menu || !overlay) return;

  // place menu just below the button
  const placeMenu = () => {
    // ensure the menu has a size to measure
    const wasHidden = menu.hidden;
    if (wasHidden) {
      menu.hidden = false;
      menu.style.visibility = 'hidden';
    }

    const br   = btn.getBoundingClientRect();
    const mW   = menu.offsetWidth || 420;
    const gap  = 8;

    let left = br.left;              // align to the left edge of the button
    let top  = br.bottom + gap;      // directly under the button

    // keep it inside the viewport
    const maxLeft = window.innerWidth - mW - 16;
    if (left < 16)      left = 16;
    if (left > maxLeft) left = maxLeft;

    menu.style.left = `${left}px`;
    menu.style.top  = `${top}px`;

    if (wasHidden) {
      menu.style.visibility = '';
      menu.hidden = true;
    }
  };

  const openMenu = () => {
    placeMenu();
    menu.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => menu.classList.add('open'));
    btn.setAttribute('aria-expanded', 'true');

    // update position on window changes
    window.addEventListener('resize', placeMenu);
    window.addEventListener('scroll', placeMenu, { passive: true });
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { menu.hidden = true; overlay.hidden = true; }, 160);
    window.removeEventListener('resize', placeMenu);
    window.removeEventListener('scroll', placeMenu);
  };

  const isOpen = () => !menu.hidden;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closeMenu(); });
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (!menu.contains(e.target) && e.target !== btn) closeMenu();
  });
}






// ===== NAVIGATION PAGE ONLY =====
document.addEventListener('DOMContentLoaded', () => {
  const rfMap = document.getElementById('rfMap');
  if (!rfMap) return; // run only on navigation page

  const pinsLayer  = document.getElementById('map-pins');
  const placeList  = document.getElementById('place-list');
  const placeCard  = document.getElementById('place-card');
  const cardClose  = placeCard.querySelector('.card-close');
  const catList    = document.getElementById('category-list');

  const searchInput = document.getElementById('nav-search');
  const searchBtn   = document.getElementById('nav-search-btn');
  const filterOpen  = document.getElementById('filter-open');
  const sortBySel   = document.getElementById('sort-by');

  // Demo data
  const PLACES = [
    { id:'p-ryba', title:'Ресторан Рыба моя', cat:'restaurant', region:'RU-MOW',
      city:'Москва', address:'1-я Тверская-Ямская ул., 21', rating:4.9, distance:'0.5 км', time:'Открыто до 18:00',
      desc:'Самый лучший рыбный ресторан Москвы. Свежая рыба и морепродукты со всего света.',
      img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:57.2, y:63.0 } },
    { id:'p-rest2', title:'Ресторан Морской Бриз', cat:'restaurant', region:'RU-MOW',
      city:'Москва', address:'Новая площадь, 10', rating:4.7, distance:'1.2 км', time:'Открыто до 23:00',
      desc:'Рыба на гриле, устрицы и авторские соусы.',
      img:'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:58.5, y:62.0 } },
    { id:'p-rest3', title:'Рыбный Базар', cat:'restaurant', region:'RU-MOW',
      city:'Москва', address:'Петровка, 26', rating:4.8, distance:'1.8 км', time:'Открыто до 22:00',
      desc:'Большой выбор рыбы и вина.',
      img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:56.2, y:61.4 } },
    { id:'p-museum1', title:'Политехнический музей', cat:'museum', region:'RU-MOW',
      city:'Москва', address:'Новая пл., 3/4', rating:4.6, distance:'2.1 км', time:'Открыто до 20:00',
      desc:'Один из старейших научно-технических музеев мира.',
      img:'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:59.9, y:64.0 } },
    { id:'p-park1', title:'Парк Зарядье', cat:'park', region:'RU-MOW',
      city:'Москва', address:'ул. Варварка, 6', rating:4.8, distance:'2.4 км', time:'Открыто до 22:00',
      desc:'Современный парк с парящим мостом.',
      img:'https://images.unsplash.com/photo-1543342386-1b814f235b61?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:60.8, y:64.6 } },
    { id:'p-cafe1', title:'Coffee Lab', cat:'cafe', region:'RU-MOW',
      city:'Москва', address:'Столешников пер., 8', rating:4.5, distance:'1.1 км', time:'Открыто до 21:00',
      desc:'Спешиалти-кофе и десерты.',
      img:'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400&auto=format&fit=crop',
      url:'#', reserveUrl:'#', coords:{ x:57.9, y:61.0 } },
  ];

  const fmt = { rating: r => `${r.toFixed(1)}★` };
  let state = { cat:'restaurant', search:'', open:'all', sort:'near', selectedId:null };

  // Render helpers
  function renderList(items){
    placeList.innerHTML = '';
    items.forEach(p=>{
      const el = document.createElement('div');
      el.className = 'place-item';
      el.dataset.id = p.id;
      el.innerHTML = `
        <img src="${p.img}" alt="">
        <div>
          <div class="ptitle">${p.title}</div>
          <div class="pmeta">${p.distance} • ${p.time}</div>
        </div>
        <div class="pmeta">${fmt.rating(p.rating)}</div>`;
      el.addEventListener('click', ()=> selectPlace(p.id, true));
      placeList.appendChild(el);
    });
  }

  function renderPins(items){
    pinsLayer.innerHTML = '';
    items.forEach(p=>{
      const btn = document.createElement('button');
      btn.className = `poi-pin ${p.cat}`;
      btn.style.left = p.coords.x + '%';
      btn.style.top  = p.coords.y + '%';
      btn.title = p.title;
      btn.dataset.id = p.id;
      btn.addEventListener('click', (e)=>{ e.stopPropagation(); selectPlace(p.id, false); });
      pinsLayer.appendChild(btn);
    });
  }

  function applyFilters(){
    const q = state.search.trim().toLowerCase();
    let items = PLACES.filter(p =>
      (state.cat==='all' || p.cat===state.cat) &&
      (q==='' || p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q))
    );
    if (state.open==='open')   items = items.filter(p=>!/закрыто/i.test(p.time));
    if (state.open==='closed') items = items.filter(p=>/закрыто/i.test(p.time));
    if (state.sort==='rating') items.sort((a,b)=>b.rating-a.rating);
    if (state.sort==='az')     items.sort((a,b)=>a.title.localeCompare(b.title));

    renderList(items);
    renderPins(items);
    if (!items.some(p=>p.id===state.selectedId)) hideCard();
  }

  function selectPlace(id){
    state.selectedId = id;
    document.querySelectorAll('.place-item').forEach(n=>n.classList.toggle('active', n.dataset.id===id));
    document.querySelectorAll('.poi-pin').forEach(n=>n.classList.toggle('active', n.dataset.id===id));

    const p = PLACES.find(x=>x.id===id);
    if (!p) return;

    // fill popup
    placeCard.querySelector('.card-img').src = p.img;
    placeCard.querySelector('.card-title').textContent = p.title;
    placeCard.querySelector('.card-distance').textContent = p.distance;
    placeCard.querySelector('.card-time').textContent = p.time;
    placeCard.querySelector('.card-rating').textContent = fmt.rating(p.rating);
    placeCard.querySelector('.addr-btn').textContent = p.address;
    placeCard.querySelector('.card-desc').textContent = p.desc;
    placeCard.querySelector('.more-btn').href = p.url || '#';
    placeCard.querySelector('.reserve-btn').href = p.reserveUrl || '#';

    positionCard(p.coords);
    placeCard.hidden = false;
  }

  function positionCard(coords){
    const wrap   = document.getElementById('mapWrap');
    const mapBox = document.getElementById('rfMap');
    const wrapRect = wrap.getBoundingClientRect();
    const mapRect  = mapBox.getBoundingClientRect();

    let left = (coords.x/100) * mapRect.width  + (mapRect.left - wrapRect.left) + 16;
    let top  = (coords.y/100) * mapRect.height + (mapRect.top  - wrapRect.top)  - 16;

    const w = placeCard.offsetWidth  || 400;
    const h = placeCard.offsetHeight || 230;

    const maxL = wrap.clientWidth  - w - 24;
    const maxT = wrap.clientHeight - h - 24;
    if (left > maxL) left = (coords.x/100) * mapRect.width + (mapRect.left - wrapRect.left) - w - 16;
    left = Math.max(24, Math.min(left, maxL));
    top  = Math.max(24, Math.min(top,  maxT));

    placeCard.style.left = left + 'px';
    placeCard.style.top  = top  + 'px';
  }

  function hideCard(){
    placeCard.hidden = true;
    state.selectedId = null;
    document.querySelectorAll('.poi-pin.active').forEach(n=>n.classList.remove('active'));
    document.querySelectorAll('.place-item.active').forEach(n=>n.classList.remove('active'));
  }

  // Sidebar interactions
  document.getElementById('panelToggle')?.addEventListener('click', () => {
    const panel = document.getElementById('navPanel');
    const collapsed = panel.getAttribute('data-state') === 'collapsed';
    panel.setAttribute('data-state', collapsed ? 'expanded' : 'collapsed');
  });

  // UI wiring
  catList.addEventListener('click',(e)=>{
    const li = e.target.closest('li[data-cat]'); if (!li) return;
    catList.querySelectorAll('li').forEach(n=>n.classList.remove('active'));
    li.classList.add('active');
    state.cat = li.dataset.cat;
    applyFilters();
  });
  searchBtn.addEventListener('click',()=>{ state.search = searchInput.value; applyFilters(); });
  searchInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ state.search = searchInput.value; applyFilters(); }});
  filterOpen.addEventListener('change',()=>{ state.open = filterOpen.value; applyFilters(); });
  sortBySel.addEventListener('change',()=>{ state.sort = sortBySel.value; applyFilters(); });

  // Map interactions
  rfMap.addEventListener('click', e => { if (!e.target.closest('.poi-pin')) hideCard(); });
  cardClose.addEventListener('click', hideCard);

  // jQuery hover/region text (works when SVG paths contain data-code/title)
  if (window.$) {
    $('[data-code]').on('mouseenter', function(){
      $('.district span').text($(this).attr('data-title'));
      $('.district').show();
    }).on('mouseleave', function(){
      if (!$('.rf-map').hasClass('open')) $('.district').hide();
    });
  }

  // Initial render
  applyFilters();
  // select default scenario as per design
  setTimeout(()=> selectPlace('p-ryba'), 500);
});

document.addEventListener('DOMContentLoaded', () => {
  const navPanel  = document.getElementById('navPanel');
  if (!navPanel) return;

  const backBtn   = document.getElementById('panelBack');
  const closeBtn  = document.getElementById('panelClose');

  const setCollapsed = (v) => {
    navPanel.setAttribute('data-collapsed', v ? 'true' : 'false');
  };

  backBtn?.addEventListener('click', () => {
    const now = navPanel.getAttribute('data-collapsed') === 'true';
    setCollapsed(!now);
  });

  // optional hard hide (mobile)
  closeBtn?.addEventListener('click', () => setCollapsed(true));
});



