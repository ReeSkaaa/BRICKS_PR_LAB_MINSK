document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('projectsGrid');

  if (!grid) return;

  // ---- DATA FROM YOUR PDF (SHORT VERSION FOR CARDS) ----
  // We'll take top 6 items for now. You can extend later.
  // avatar: path to the image you'll add for that project.
  // titleLines: first line is название, second line = кто / когда / где
  // desc: краткое описание

  const projectsData = [
    {
      bgClass: 'bg-main',
      avatar: '/PICS_LOGOs/project1.jpg',
      titleLines: "«Новое поколение»\nМосква, участники из разных стран",
      desc: "Краткосрочные поездки и стажировки для молодых лидеров (14–40 лет): образование, наука, бизнес, медиа, добровольчество.",
    },
    {
      bgClass: 'bg-dark',
      avatar: '/PICS_LOGOs/project2.jpg',
      titleLines: "Слёт Всемирный фестиваль молодёжи\nНижний Новгород, 17–21 сентября 2025",
      desc: "Две тысячи молодых лидеров из России и более 120 стран мира. Медиа, управление, бизнес, спорт, ИТ, творчество.",
    },
    {
      bgClass: 'bg-light',
      avatar: '/PICS_LOGOs/project3.jpg',
      titleLines: "Российско-белорусский молодёжный форум\nТула, 16–19 ноября",
      desc: "Обсуждение молодёжной политики Союзного государства, историческая память, совместные проекты и мастер-классы.",
    },
    {
      bgClass: 'bg-light',
      avatar: '/PICS_LOGOs/project4.jpg',
      titleLines: "Международная конференция СНГ по молодёжной политике\nМосква, 12–14 ноября 2025",
      desc: "Сохранение исторической памяти, противодействие угрозам в молодёжной среде, развитие кадрового потенциала.",
    },
    {
      bgClass: 'bg-main',
      avatar: '/PICS_LOGOs/project5.jpg',
      titleLines: "Кубинско-российский молодёжный форум\nГавана, 1–5 июля 2025",
      desc: "Тема: «Наследие, инновации и будущее». Совместные инициативы молодёжи Кубы и России, договорённости о дальнейших проектах.",
    },
    {
      bgClass: 'bg-dark',
      avatar: '/PICS_LOGOs/project6.jpg',
      titleLines: "«Здравствуй, Россия!»\nМосква + регионы РФ, июль–август",
      desc: "Культурно-образовательные поездки для соотечественников 14–19 лет: знакомство с Россией, историей, языком и культурой.",
    },
  ];

  // ---- RENDER FUNCTION ----
  projectsData.forEach(proj => {
    const card = document.createElement('div');
    card.className = `project-card ${proj.bgClass}`;

    card.innerHTML = `
      <div class="project-head">
        <img class="project-avatar" src="${proj.avatar}" alt="">
        <div class="project-headcopy">
          <div class="project-text-headline">${proj.titleLines}</div>
        </div>
      </div>

      <div class="project-desc">${proj.desc}</div>

      <div class="project-actions">
        <button class="btn-more">Подробнее</button>
        <button class="btn-join">Участвовать</button>
      </div>
    `;

    grid.appendChild(card);
  });
});
