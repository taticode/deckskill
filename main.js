const iconPaths = {
  'burger-menu': 'assets/icons/burger-menu.svg',
  'arrow-down': 'assets/icons/arrow-down.svg',
  users: 'assets/icons/users.svg',
  'chevron-down': 'assets/icons/chevron-down.svg',
  heart: 'assets/icons/heart.svg',
  price: 'assets/icons/price.svg',
  pens: 'assets/icons/pens.svg',
  'world-active': 'assets/icons/world-active.svg',
  'chevron-left': 'assets/icons/chevron-left.svg',
  'chevron-right': 'assets/icons/chevron-right.svg',
  print: 'assets/icons/print.svg',
  calendar: 'assets/icons/calendar.svg',
  close: 'assets/icons/close.svg',
  world: 'assets/icons/world.svg',
  mountains: 'assets/icons/mountains.svg',
  tent: 'assets/icons/tent.svg',
  filter: 'assets/icons/filter.svg',
};

const cards = [
  {
    image: 'assets/images/bangkok.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.bangkok.location',
    days: 'cards.bangkok.days',
    title: 'cards.bangkok.title',
    price: 'cards.bangkok.price'
  },
  {
    image: 'assets/images/bukchon-hanok.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.bukchon.location',
    days: 'cards.bukchon.days',
    title: 'cards.bukchon.title',
    price: 'cards.bukchon.price'
  },
  {
    image: 'assets/images/seul.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.seul.location',
    days: 'cards.seul.days',
    title: 'cards.seul.title',
    price: 'cards.seul.price'
  },
  {
    image: 'assets/images/kioto.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.kioto.location',
    days: 'cards.kioto.days',
    title: 'cards.kioto.title',
    price: 'cards.kioto.price'
  },
  {
    image: 'assets/images/singapour.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.singapour.location',
    days: 'cards.singapour.days',
    title: 'cards.singapour.title',
    price: 'cards.singapour.price'
  },
  {
    image: 'assets/images/tokio.png',
    fallback: '',
    activity: 'activities.quads',
    location: 'cards.tokio.location',
    days: 'cards.tokio.days',
    title: 'cards.tokio.title',
    price: 'cards.tokio.price'
  }
];

const navbarItems = [
  { label: 'nav.adventure', href: '#aventuras', icon: 'mountains', active: true },
  { label: 'nav.destinations', href: '#aventuras', icon: 'world' },
  { label: 'nav.accommodation', href: '#aventuras', icon: 'tent' },
  { label: 'nav.about', href: '#' }
];

const filterSections = [
  {
    label: 'nav.destinations',
    icon: 'world',
    open: false
  },
  {
    label: 'nav.adventure',
    icon: 'mountains',
    open: true,
    type: 'activities',
    more: 'filters.more',
    items: [
      { label: 'activities.quads', checked: false },
      { label: 'activities.paragliding', checked: true },
      { label: 'activities.rafting', checked: false },
      { label: 'activities.explore', checked: true },
      { label: 'activities.diving', checked: false },
      { label: 'activities.skydiving', checked: false },
      { label: 'activities.snowboard', checked: false },
      { label: 'activities.surf', checked: false }
    ]
  },
  {
    label: 'nav.accommodation',
    icon: 'tent',
    open: false
  },
  {
    label: 'filters.price',
    icon: 'price',
    open: true,
    type: 'price',
    inputs: [
      { key: 'filters.minimum' },
      { key: 'filters.maximum' }
    ]
  }
];

const createIcon = (name) => {
  const element = document.createElement('span');
  element.dataset.icon = name;
  element.setAttribute('aria-hidden', 'true');
  return element;
};

const loadedIcons = new Map();

const inlineExternalSvg = (svgMarkup, name) => {
  const parsed = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
  const svg = parsed.documentElement;
  const idSuffix = `icon-${name}-${Math.random().toString(36).slice(2, 8)}`;
  const idMap = new Map();

  svg.querySelectorAll('[id]').forEach((node) => {
    const newId = `${idSuffix}-${node.id}`;
    idMap.set(node.id, newId);
    node.id = newId;
  });

  svg.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      let value = attribute.value;
      idMap.forEach((newId, oldId) => {
        value = value.replaceAll(`url(#${oldId})`, `url(#${newId})`);
        value = value.replaceAll(`#${oldId}`, `#${newId}`);
      });
      if (value !== attribute.value) node.setAttribute(attribute.name, value);
    });
  });

  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('fill', 'none');
  return svg;
};

const loadIcon = async (element) => {
  const name = element.dataset.icon;
  const iconPath = iconPaths[name];
  if (!iconPath || element.querySelector('svg, img')) return;

  const fallback = document.createElement('img');
  fallback.src = iconPath;
  fallback.alt = '';
  fallback.setAttribute('aria-hidden', 'true');
  fallback.className = 'icon icon--fallback';
  element.replaceChildren(fallback);

  try {
    if (!loadedIcons.has(iconPath)) {
      loadedIcons.set(iconPath, fetch(iconPath).then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar el icono: ${iconPath}`);
        return response.text();
      }));
    }

    const svgMarkup = await loadedIcons.get(iconPath);
    element.replaceChildren(inlineExternalSvg(svgMarkup, name));
  } catch (error) {
    console.error(error);
  }
};

const renderIcons = async (scope = document) => {
  await Promise.all([...scope.querySelectorAll('[data-icon]')].map(loadIcon));
};

const getTranslation = (language, key) => {
  return key.split('.').reduce((value, part) => value?.[part], window.translations?.[language]);
};

const createTranslatedElement = (tagName, key, className = '') => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.dataset.i18n = key;
  return element;
};

const renderNavbar = () => {
  const nav = document.querySelector('[data-navbar-nav]');
  if (!nav) return;

  const fragment = document.createDocumentFragment();
  navbarItems.forEach((item) => {
    const link = document.createElement('a');
    link.className = `navbar__link${item.active ? ' navbar__link--active' : ''}`;
    link.href = item.href;

    if (item.icon) {
      link.appendChild(createIcon(item.icon));
    }

    link.appendChild(createTranslatedElement('span', item.label));
    fragment.appendChild(link);
  });

  nav.replaceChildren(fragment);
};

const renderSliderIndicator = () => {
  const indicator = document.querySelector('[data-slider-indicator]');
  if (!indicator) return;

  const fragment = document.createDocumentFragment();
  ['slider.slide1', 'slider.slide2', 'slider.slide3'].forEach((key, index) => {
    const button = document.createElement('button');
    button.className = `slider-indicator__dot${index === 0 ? ' slider-indicator__dot--active' : ''}`;
    button.type = 'button';
    button.dataset.i18n = key;
    button.dataset.i18nAttr = 'aria-label';
    fragment.appendChild(button);
  });

  indicator.replaceChildren(fragment);
};

const createFilterTrigger = (section) => {
  const trigger = document.createElement('button');
  trigger.className = 'filter-section__trigger';
  if (section.open) trigger.classList.add('filter-section__trigger--accent');
  trigger.type = 'button';

  const label = document.createElement('span');
  const icon = createIcon(section.icon);
  icon.classList.add('filter-type');
  label.append(icon, createTranslatedElement('span', section.label));

  trigger.append(label, createIcon(section.open ? 'chevron-down' : 'chevron-right'));
  return trigger;
};

const createCheckbox = (item) => {
  const label = document.createElement('label');
  label.className = 'checkbox';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = item.checked;

  const box = document.createElement('span');
  box.className = 'checkbox__box';

  const text = createTranslatedElement('span', item.label, 'checkbox__label');

  const info = document.createElement('span');
  info.className = 'filter-info';
  info.setAttribute('tabindex', '0');
  info.setAttribute('aria-describedby', `filter-info-${item.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`);

  const infoIcon = createTranslatedElement('span', 'filters.info');
  infoIcon.setAttribute('aria-hidden', 'true');

  const tooltip = createTranslatedElement('span', 'filters.infoTooltip', 'filter-info__tooltip');
  tooltip.id = `filter-info-${item.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  tooltip.setAttribute('role', 'tooltip');

  info.append(infoIcon, tooltip);

  label.append(input, box, text, info);
  return label;
};

const createPriceInput = (inputConfig) => {
  const label = document.createElement('label');
  label.className = 'text-input';
  label.appendChild(createIcon('price'));

  const input = document.createElement('input');
  input.type = 'number';
  input.dataset.i18n = inputConfig.key;
  input.dataset.i18nAttr = 'placeholder';
  label.appendChild(input);

  return label;
};

const renderFilters = () => {
  const filters = document.querySelector('[data-filters]');
  if (!filters) return;

  const header = document.createElement('div');
  header.className = 'filters__header';
  header.appendChild(createTranslatedElement('h3', 'filters.title'));

  const close = document.createElement('button');
  close.type = 'button';
  close.dataset.filterClose = '';
  close.dataset.i18n = 'filters.close';
  close.dataset.i18nAttr = 'aria-label';

  const closeSymbol = document.createElement('span');
  closeSymbol.dataset.i18n = 'filters.closeSymbol';
  close.appendChild(closeSymbol);
  header.appendChild(close);

  const body = document.createElement('div');
  body.className = 'filters__body';

  filterSections.forEach((section) => {
    body.appendChild(createFilterTrigger(section));

    if (!section.type) return;

    const content = document.createElement('div');
    content.className = `filter-section${section.open ? ' filter-section--open' : ''}`;

    if (section.type === 'activities') {
      section.items.forEach((item) => content.appendChild(createCheckbox(item)));

      const more = createTranslatedElement('a', section.more, 'filters__more');
      more.href = '#';
      content.appendChild(more);
    }

    if (section.type === 'price') {
      section.inputs.forEach((inputConfig) => content.appendChild(createPriceInput(inputConfig)));
    }

    body.appendChild(content);
  });

  filters.replaceChildren(header, body);
};

const renderCards = () => {
  const results = document.querySelector('[data-results]');
  if (!results) return;

  const section = document.createElement('section');
  section.className = 'destination';
  section.setAttribute('aria-labelledby', 'asia-title');
  section.innerHTML = '<h3 id="asia-title" data-i18n="destination.asia"></h3><div class="cards-grid"></div>';

  const grid = section.querySelector('.cards-grid');
  cards.forEach((card) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <div class="card__media ${card.fallback}">
        <img class="card__image" src="${card.image}" alt="" loading="lazy" onerror="this.remove()">
        <span class="tag" data-i18n="${card.activity}"></span>
      </div>
      <div class="card__content">
        <p class="card__meta"><strong data-i18n="${card.location}"></strong> <span data-i18n="${card.days}"></span></p>
        <h4 data-i18n="${card.title}"></h4>
      </div>
      <div class="card__bottom">
        <div class="card__price">
          <span data-i18n="cards.from"></span>
          <strong data-i18n="${card.price}"></strong>
          <button class="card__breakdown" type="button" data-modal-open>
            <span data-i18n="cards.breakdown"></span>
            <span data-icon="chevron-down" aria-hidden="true"></span>
          </button>
        </div>
        <button class="button button--secondary" type="button" data-i18n="actions.reserve"></button>
      </div>`;
    grid.appendChild(article);
  });

  results.appendChild(section);
};

const applyTranslations = (language = 'es') => {
  const dictionary = window.translations?.[language] ?? window.translations.es;
  const activeLanguage = window.translations?.[language] ? language : 'es';

  document.documentElement.lang = activeLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = getTranslation(activeLanguage, element.dataset.i18n);
    if (value == null) return;

    if (element.dataset.i18nAttr) {
      element.setAttribute(element.dataset.i18nAttr, value);
    } else {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-meta]').forEach((element) => {
    const [attribute, key] = element.dataset.i18nMeta.split(':');
    const value = getTranslation(activeLanguage, key);
    if (value != null) element.setAttribute(attribute, value);
  });

  document.title = dictionary.meta.title;
};

window.setLanguage = (language) => {
  applyTranslations(language);
};

renderNavbar();
renderSliderIndicator();
renderFilters();
renderCards();

const filterPanel = document.querySelector('[data-filter-open]');
const filters = document.querySelector('#filters');
const modal = document.querySelector('[data-modal]');
let modalOpeners;
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('.navbar__nav');

applyTranslations('es');
renderIcons();
modalOpeners = document.querySelectorAll('[data-modal-open]');

modalOpeners.forEach((opener) => {
  opener.addEventListener('click', () => modal?.showModal());
});

filterPanel?.addEventListener('click', () => {
  const isOpen = filters.classList.toggle('is-open');
  filterPanel.setAttribute('aria-expanded', String(isOpen));
});

filters?.addEventListener('click', (event) => {
  const closeButton = event.target.closest('[data-filter-close]');
  if (!closeButton) return;
  filters.classList.remove('is-open');
  filterPanel?.setAttribute('aria-expanded', 'false');
});

const modalClose = document.querySelector('[data-modal-close]');
modalClose?.addEventListener('click', () => modal?.close());

modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? getTranslation(document.documentElement.lang, 'nav.openMenu') : getTranslation(document.documentElement.lang, 'actions.close'));
  nav?.classList.toggle('is-open', !isOpen);
});
