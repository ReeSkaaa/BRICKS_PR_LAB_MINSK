// /JS/profile.js
document.addEventListener('DOMContentLoaded', async () => {
  // wait until partials (header) are injected by main.js
  if (typeof includePartials === 'function') {
    await includePartials();
  }

  // ---- Switch header "Войти" -> "Выйти" if user is logged in ----
  const session = JSON.parse(localStorage.getItem('fc_session') || 'null');
  const loginBtn = document.querySelector('.login-btn');
  const registerBtn = document.querySelector('.register-btn');

  if (session && loginBtn) {
    loginBtn.textContent = 'Выйти';
    loginBtn.addEventListener('click', () => {
      localStorage.removeItem('fc_session');
      window.location.href = '/HTML/main.html';
    });
    // optional: hide register
    if (registerBtn) registerBtn.style.display = 'none';
  }

  // ---- Fill name if you have it in session ----
  const pName = document.getElementById('pName');
  if (session?.firstName && session?.lastName) {
    pName.textContent = `${session.lastName} ${session.firstName}`;
  }

  // ====== Portfolio arrows (simple scroll) ======
  const track = document.getElementById('portTrack');
  document.getElementById('portPrev').addEventListener('click', () => track.scrollBy({left: -280, behavior: 'smooth'}));
  document.getElementById('portNext').addEventListener('click', () => track.scrollBy({left:  280, behavior: 'smooth'}));

 // ===== Documents grid =====
const docsScroll = document.getElementById('docsScroll');

const DOCS = [
  { name: 'Паспорт',                type: 'PDF',  size: '540 Kb', href: '/docs/passport.pdf',          icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Сертификат участия в конференции', type: 'PDF',  size: '890 Kb', href: '/docs/diploma.pdf',          icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Аттестат о среднем образовании',   type: 'PDF',  size: '720 Kb', href: '/docs/attestat.pdf',         icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Справка с места учёбы',            type: 'PDF',  size: '210 Kb', href: '/docs/study_cert.pdf',       icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Резюме',                           type: 'DOCX', size: '180 Kb', href: '/docs/resume.docx',          icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Медицинская справка',              type: 'PDF',  size: '260 Kb', href: '/docs/med_cert.pdf',         icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Фотография 3x4',                   type: 'JPG',  size: '95 Kb',  href: '/docs/photo.jpg',            icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Сертификат о стажировке',          type: 'PDF',  size: '480 Kb', href: '/docs/intern_cert.pdf',      icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Пропуск в кампус',                 type: 'PNG',  size: '120 Kb', href: '/docs/campus_pass.png',      icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Заявление на участие в проекте',   type: 'DOCX', size: '230 Kb', href: '/docs/application.docx',     icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Портфолио',                        type: 'PDF',  size: '1.2 Mb', href: '/docs/portfolio.pdf',        icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Письмо-рекомендация',              type: 'PDF',  size: '310 Kb', href: '/docs/reference_letter.pdf', icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Договор подряда',                  type: 'DOCX', size: '290 Kb', href: '/docs/service_contract.docx',icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Индивидуальный план обучения',     type: 'PDF',  size: '440 Kb', href: '/docs/study_plan.pdf',       icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Заявление на отпуск',              type: 'DOCX', size: '170 Kb', href: '/docs/leave_request.docx',   icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Пропуск в лабораторию',            type: 'PNG',  size: '115 Kb', href: '/docs/lab_pass.png',         icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Сертификат участия в конференции', type: 'PDF',  size: '520 Kb', href: '/docs/conference_cert.pdf',  icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Благодарственное письмо',          type: 'PDF',  size: '350 Kb', href: '/docs/thanks_letter.pdf',    icon: '/PICS_LOGOs/doc_logo.png' },
  { name: 'Копия ИНН',                        type: 'PDF',  size: '140 Kb', href: '/docs/inn.pdf',              icon: '/PICS_LOGOs/doc_logo.png' }
];


// render all docs
docsScroll.innerHTML = `
  <div class="docs-grid">
    ${DOCS.map(d => `
      <div class="doc-tile">
        <div class="doc-ico">
          <img src="${d.icon}" alt="icon" style="width:29px;height:23.54px;object-fit:contain;">
        </div>
        <div>
          <div class="doc-title">${d.name}</div>
          <div class="doc-meta">${d.type} • ${d.size}</div>
        </div>
        <a class="doc-link" href="${d.href}" target="_blank"></a>
        <button class="doc-del" title="Удалить документ">×</button>
      </div>
    `).join('')}
  </div>
`;


// delete handler (event delegation)
docsScroll.addEventListener('click', (e) => {
  const del = e.target.closest('.doc-del');
  if (!del) return;

  const tile = del.closest('.doc-tile');
  const idx  = Number(tile?.dataset.i);
  if (Number.isInteger(idx)) {
    DOCS.splice(idx, 1);
    renderDocs();                 // re-render after deletion
  }
});


  // ====== Upcoming events (filter + status dots) ======
  const eventsList = document.getElementById('eventsList');
  const swButtons  = document.querySelectorAll('.sw-btn');

  const EVENTS = [
    { id:1, title:'BRICS PROJECT LAB - MINSK', sub:'Лаборатория посвящена…', date:'2025-10-30', status:'new',  logo:'/PICS_LOGOs/brics_event1.png' },
    { id:2, title:'BRICS PROJECT LAB - MINSK', sub:'Лаборатория посвящена…', date:'2025-10-28', status:'going',logo:'/PICS_LOGOs/brics_event2.png' },
    { id:3, title:'BRICS PROJECT LAB - MINSK', sub:'Лаборатория посвящена…', date:'2025-10-28', status:'seen', logo:'/PICS_LOGOs/brics_event3.png' },
    { id:4, title:'BRICS PROJECT LAB - MINSK', sub:'Лаборатория посвящена…', date:'2025-10-28', status:'seen', logo:'/PICS_LOGOs/brics_event3.png' },
    { id:5, title:'BRICS PROJECT LAB - MINSK', sub:'Лаборатория посвящена…', date:'2025-10-28', status:'going',logo:'/PICS_LOGOs/brics_event3.png' },
  ];

  function inThisMonth(iso){
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  function renderEvents(range='month'){
    const sorted = [...EVENTS].sort((a,b)=> new Date(b.date) - new Date(a.date));
    const list = sorted.filter(ev => range === 'all' ? true : inThisMonth(ev.date));
    eventsList.innerHTML = list.map(ev => `
      <li class="event-li">
        <img class="e-logo" src="${ev.logo}" alt="">
        <div>
          <div class="e-title">${ev.title}</div>
          <div class="e-sub">${ev.sub}</div>
        </div>
        <div class="e-date">${new Date(ev.date).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</div>
        <span class="e-dot ${ev.status}" title="${ev.status}"></span>
      </li>
    `).join('');
  }
  swButtons.forEach(b=>{
    b.addEventListener('click', ()=>{
      swButtons.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderEvents(b.dataset.range);
    });
  });
  renderEvents('month');

  // ====== Visited grid (Посещённые мероприятия) ======
const visitedGrid = document.getElementById('visitedGrid');

// Example list — you can expand with different titles or logos
const VISITED = [
  { id: 1, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 2, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 3, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 4, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 5, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 6, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 7, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 8, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 9, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' },
  { id: 10, logo: '/PICS_LOGOs/wyf.png', title: 'ВФМ' }
];

// Render each tile with logo + caption underneath
visitedGrid.innerHTML = VISITED.map(v => `
  <div class="visit-item">
    <img src="${v.logo}" alt="${v.title}">
    <span class="visit-cap">${v.title}</span>
  </div>
`).join('');

});


// Function to update progress
function updateProgress(progress, maxProgress) {
  const valueEl = document.getElementById('prValue');
  const progressBar = document.getElementById('prBar');
  const starsEl = document.getElementById('prStars');

  // Calculate progress percentage
  const percentage = (progress / maxProgress) * 100;

  // Update progress bar width
  progressBar.style.width = `${percentage}%`;

  // Update stars
  starsEl.querySelectorAll('i').forEach((star, index) => {
    if (index < Math.floor(percentage / 25)) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });

  valueEl.textContent = `${progress} из ${maxProgress}`;
}

// Example: setting progress to 50
updateProgress(50, 100);




