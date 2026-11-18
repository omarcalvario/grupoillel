const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

document.querySelectorAll('.filter').forEach((filter) => filter.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
  filter.classList.add('active');
  document.querySelectorAll('.company-card').forEach((card) => {
    card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter;
  });
}));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Gracias. Hemos recibido tus datos y te contactaremos pronto.';
  event.currentTarget.reset();
});

const solutionsCarousel = document.querySelector('[data-solutions-carousel]');

if (solutionsCarousel) {
  const viewport = solutionsCarousel.querySelector('.carousel-viewport');
  const track = solutionsCarousel.querySelector('.carousel-track');
  const cards = [...solutionsCarousel.querySelectorAll('.carousel-card')];
  const dial = document.querySelector('.carousel-dots');
  const dots = [...dial.querySelectorAll('button')];
  const previous = solutionsCarousel.querySelector('.carousel-prev');
  const next = solutionsCarousel.querySelector('.carousel-next');
  const details = document.querySelector('#soluciones .solution-copy');
  const brand = details.querySelector('.solution-brand');
  const title = details.querySelector('h3');
  const description = details.querySelector('p');
  const solutions = [
    {
      brand: 'Winky Coffee',
      logo: 'assets/logos%20galeri%CC%81a/logo-winky.svg',
      title: 'Súper rápido, Súper rico, Super Cool.',
      description: 'Más que una cafetería, una experiencia moderna\ndiseñada para conectar personas.',
    },
    {
      brand: 'El Fortincito',
      logo: 'assets/logos%20galeri%CC%81a/Logo-elfortincito.svg',
      title: 'Cultivamos naturaleza,\ncosechamos bienestar.',
      description: 'Tradición, calidad y productos agroindustriales\ncon identidad regional.',
    },
    {
      brand: 'Univatour',
      logo: 'assets/logos%20galeri%CC%81a/Logo-univatour.svg',
      title: 'Tu próxima aventura está aquí',
      description: 'Experiencias turísticas diseñadas para conectar personas\ncon nuevos destinos.',
    },
    {
      brand: 'Icosur',
      logo: 'assets/logos%20galeri%CC%81a/Logo-icosur.svg',
      title: 'Marcas que transforman espacios',
      description: 'Soluciones comerciales y empresariales enfocadas en eficiencia\ny crecimiento estratégico.',
    },
    {
      brand: 'Mitokali',
      logo: 'assets/logos%20galeri%CC%81a/Logo-mitokali.svg',
      title: 'Creando Momentos Memorables',
      description: 'Creamos experiencias memorables a través de eventos\ny catering premium.',
    },
    {
      brand: 'Triturados',
      logo: 'assets/logos%20galeri%CC%81a/Logo-triturados.svg',
      title: 'La base sólida de cada proyecto.',
      description: 'Soluciones en materiales y agregados para proyectos de\nconstrucción e infraestructura.',
    },
    {
      brand: 'Vicelo',
      logo: 'assets/logos%20galeri%CC%81a/Logo-vicelo.svg',
      title: 'Cuidamos tus espacios, impulsamos tu negocio.',
      description: 'Construcción y mantenimiento integral\ncon enfoque operativo y empresarial.',
    },
  ];
  const videoSources = [
    'assets/conocenos-background.mp4',
    'assets/videos-galeria/fortincito.mp4',
    'assets/videos-galeria/univatour.mp4',
    'assets/videopuebla.mp4',
    'assets/videos-galeria/Mitokali.mp4',
    'assets/videopuebla.mp4',
    'assets/conocenos-background.mp4',
  ];

  cards.forEach((card, index) => {
    const solution = solutions[index];
    card.dataset.brand = solution.brand;
    card.dataset.logo = solution.logo;
    card.dataset.title = solution.title;
    card.dataset.description = solution.description;
    const video = card.querySelector('video');
    video.src = videoSources[index];
    video.load();
  });

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.append(previous, next);
  details.append(controls);
  details.insertAdjacentElement('afterend', dial);
  let active = 0;
  let startX = 0;
  let startY = 0;
  let dragOffset = 0;
  let isDragging = false;

  const setTextWithBreaks = (element, text) => {
    element.replaceChildren();
    text.split('\n').forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  };

  const update = () => {
    const radiusX = viewport.clientWidth * 1.12;
    const radiusY = viewport.clientWidth * 0.74;

    cards.forEach((card, index) => {
      let distance = index - active;
      if (distance > 3) distance -= cards.length;
      if (distance < -3) distance += cards.length;
      const magnitude = Math.abs(distance);
      const direction = Math.sign(distance);
      const angle = magnitude * 16;
      const radians = (angle * Math.PI) / 180;
      const x = direction * (Math.sin(radians) * radiusX + magnitude * 50) + dragOffset;
      const y = (1 - Math.cos(radians)) * radiusY;
      card.classList.toggle('is-active', index === active);
      card.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${direction * angle}deg)`;
      card.style.zIndex = String(cards.length - magnitude);
      card.style.opacity = String([1, 0.68, 0.36, 0.16][magnitude]);
      card.style.pointerEvents = index === active ? 'auto' : 'none';
    });

    const solution = solutions[active];
    let logo = brand.querySelector('img');
    if (!logo) {
      logo = document.createElement('img');
      brand.replaceChildren(logo);
    }
    logo.src = solution.logo;
    logo.alt = solution.brand;
    setTextWithBreaks(title, solution.title);
    setTextWithBreaks(description, solution.description);
    description.hidden = !solution.description;

    dots.forEach((dot, index) => {
      const selected = index === active;
      let relative = index - active;
      if (relative > 3) relative -= cards.length;
      if (relative < -3) relative += cards.length;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-current', selected ? 'true' : 'false');
      dot.style.setProperty('--dial-angle', `${relative * 27.5}deg`);
      dot.style.opacity = String(1 - Math.abs(relative) * 0.27);
    });
  };

  const setActive = (index) => {
    active = (index + cards.length) % cards.length;
    dragOffset = 0;
    update();
  };

  const move = (direction) => {
    setActive(active + direction);
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => setActive(index)));

  viewport.addEventListener('pointerdown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    dragOffset = 0;
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    if (Math.abs(event.clientY - startY) > Math.abs(event.clientX - startX) + 12) {
      isDragging = false;
      viewport.classList.remove('is-dragging');
      dragOffset = 0;
      update();
      return;
    }
    dragOffset = event.clientX - startX;
    update();
  });

  const finishDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('is-dragging');
    const direction = dragOffset > 70 ? -1 : dragOffset < -70 ? 1 : 0;
    dragOffset = 0;
    if (direction) move(direction);
    else update();
  };

  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
  cards.forEach((card) => card.querySelector('video').play().catch(() => {}));
  window.addEventListener('resize', update);
  update();
}

const valueGallery = document.querySelector('.winky-value');

if (valueGallery) {
  const entries = [
    {
      name: 'Winky Coffee',
      logo: 'assets/logos%20galeri%CC%81a/logo-winky.svg',
      width: 158,
      description: 'Winky Coffee promueve una cultura empresarial basada en la responsabilidad social, la sostenibilidad y el fortalecimiento de la comunidad. A través del apoyo a proveedores locales, el consumo responsable y la implementación de prácticas amigables con el medio ambiente, contribuye al desarrollo sostenible de su entorno. Además, fomenta espacios de convivencia, inclusión y colaboración que impulsan el bienestar social, la educación y la cultura.',
    },
    {
      name: 'El Fortincito',
      logo: 'assets/logos%20galeri%CC%81a/Logo-elfortincito.svg',
      width: 52,
      description: 'Triturados Lozano es una empresa comprometida con la responsabilidad social empresarial y el desarrollo sostenible dentro de la industria de materiales pétreos. A través de prácticas responsables en la extracción, procesamiento y comercialización de agregados, impulsa la protección ambiental, el uso eficiente de los recursos naturales y el cumplimiento de las normativas vigentes. Su compromiso incluye la seguridad y bienestar de sus colaboradores, así como la participación activa en proyectos que fortalecen el desarrollo económico y social de las comunidades donde opera.',
    },
    {
      name: 'Univatour',
      logo: 'assets/logos%20galeri%CC%81a/Logo-univatour.svg',
      width: 138,
      description: 'Univatour impulsa un modelo de turismo responsable y sostenible que contribuye al desarrollo económico, cultural y social de los destinos que atiende. La empresa promueve experiencias de viaje que respetan el patrimonio natural y cultural, apoyan el consumo local y fomentan prácticas éticas e inclusivas. A través de sus servicios, genera beneficios para las comunidades receptoras y fortalece la conciencia social y ambiental entre viajeros y colaboradores.',
    },
    {
      name: 'Icosur',
      logo: 'assets/logos%20galeri%CC%81a/Logo-icosur.svg',
      width: 172,
      description: 'Icosur orienta sus operaciones hacia la generación de valor sostenible mediante altos estándares de calidad, ética empresarial y responsabilidad social. La empresa impulsa el desarrollo profesional de sus colaboradores, promueve ambientes laborales seguros e inclusivos y participa en iniciativas que contribuyen al bienestar social y ambiental. Su enfoque de mejora continua busca generar un impacto positivo en clientes, colaboradores, comunidades y demás grupos de interés.',
    },
    {
      name: 'Mitokali',
      logo: 'assets/logos%20galeri%CC%81a/Logo-mitokali.svg',
      width: 160,
      description: 'Mitokali Eventos integra la responsabilidad social en la organización y producción de eventos, promoviendo experiencias sostenibles que favorecen la inclusión, el respeto al medio ambiente y el desarrollo económico local. La empresa trabaja con proveedores comprometidos con prácticas éticas y responsables, generando eventos que fortalecen las relaciones comunitarias y aportan valor social a cada proyecto.',
    },
    {
      name: 'Triturados Lozano',
      logo: 'assets/logos%20galeri%CC%81a/Logo-triturados.svg',
      width: 174,
      description: 'Triturados Lozano es una empresa comprometida con la responsabilidad social empresarial y el desarrollo sostenible dentro de la industria de materiales pétreos. A través de prácticas responsables en la extracción, procesamiento y comercialización de agregados, impulsa la protección ambiental, el uso eficiente de los recursos naturales y el cumplimiento de las normativas vigentes. Su compromiso incluye la seguridad y bienestar de sus colaboradores, así como la participación activa en proyectos que fortalecen el desarrollo económico y social de las comunidades donde opera.',
    },
    {
      name: 'Vicelo',
      logo: 'assets/logos%20galeri%CC%81a/Logo-vicelo.svg',
      width: 174,
      description: 'Grupo Inmobiliario Vicelo desarrolla proyectos inmobiliarios con un enfoque de responsabilidad social y sostenibilidad, creando espacios que generan valor económico, social y ambiental. La empresa promueve desarrollos habitacionales que mejoran la calidad de vida de las familias, integrando prácticas de construcción responsable, respeto al entorno y transparencia empresarial. Su compromiso fortalece relaciones de confianza con clientes, inversionistas, proveedores y comunidades.',
    },
  ];
  const logo = valueGallery.querySelector('.winky-value-logo');
  const description = valueGallery.querySelector('.winky-value-text p');
  const next = valueGallery.querySelector('.winky-value-text img');
  const dots = [...valueGallery.querySelectorAll('.value-dots i')].map((dot, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver ${entries[index].name}`);
    dot.replaceWith(button);
    return button;
  });
  let active = 0;

  const updateValueGallery = () => {
    const entry = entries[active];
    logo.src = entry.logo;
    logo.alt = entry.name;
    logo.style.width = `${entry.width}px`;
    description.textContent = entry.description;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const setValueGallery = (index) => {
    active = (index + entries.length) % entries.length;
    valueGallery.classList.add('is-changing');
    window.setTimeout(() => {
      updateValueGallery();
      valueGallery.classList.remove('is-changing');
    }, 140);
  };

  next.setAttribute('role', 'button');
  next.setAttribute('tabindex', '0');
  next.setAttribute('aria-label', 'Siguiente empresa');
  next.addEventListener('click', () => setValueGallery(active + 1));
  next.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') setValueGallery(active + 1);
  });
  dots.forEach((dot, index) => dot.addEventListener('click', () => setValueGallery(index)));
  updateValueGallery();
}

const projectsGallery = document.querySelector('[data-projects-gallery]');

if (projectsGallery) {
  const cards = [...projectsGallery.querySelectorAll('.project-card')];
  const dots = [...projectsGallery.querySelectorAll('.project-dots button')];
  const previous = projectsGallery.querySelector('.project-prev');
  const next = projectsGallery.querySelector('.project-next');
  let active = 0;

  const showProject = (index) => {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      const selected = cardIndex === active;
      card.hidden = !selected;
      card.classList.toggle('is-active', selected);
    });
    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === active;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-current', selected ? 'true' : 'false');
    });
  };

  previous.addEventListener('click', () => showProject(active - 1));
  next.addEventListener('click', () => showProject(active + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showProject(index)));
  showProject(0);
}
