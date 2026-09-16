import { dishes } from './menu.js';

const deliveryUrl = 'https://eda.yandex.ru/r/mcxeta?placeSlug=mcxeta_kerchenskaya_1b_eiqsz';
const grid = document.querySelector('#menu-grid');
const dishDialog = document.querySelector('#dish-dialog');
const bookingDialog = document.querySelector('#booking-dialog');
const desktopMotion = window.matchMedia('(min-width: 1101px) and (hover: hover)');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const categoryDescriptions = {
  khinkali: 'Берите за хвостик и начинайте с маленького укуса. У каждого хинкали свой характер — выбирайте любимую начинку.',
  bakery: 'Тот самый момент, когда за столом становится тихо: горячая выпечка уже здесь. Отломите кусочек и поделитесь с близкими.',
  starters: 'Начните грузинское застолье с любимых закусок. Поставьте в центр стола — всё самое вкусное хочется разделить.',
  grill: 'Аромат мангала, щедрый вкус и хороший аппетит. Прекрасный повод собраться за одним столом.',
  hot: 'Для неспешного обеда и тёплого вечера. Грузинская классика, к которой хочется возвращаться.',
  drinks: 'Освежающий аккомпанемент к щедрому грузинскому столу.'
};

function createIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
}

function setupNavigation() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#main-nav');
  const compact = window.matchMedia('(max-width: 1100px)');
  function setOpen(open, restoreFocus = false) {
    header.classList.toggle('nav-is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !compact.matches) return;
    setOpen(false);
    const section = document.querySelector(link.hash);
    if (section) {
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  compact.addEventListener('change', () => {
    const focusWasInNav = nav.contains(document.activeElement);
    setOpen(false, compact.matches && focusWasInNav);
  });
  header.classList.add('nav-ready');
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function createDishCard(dish, index) {
  const card = document.createElement('button');
  card.className = 'dish-card';
  card.type = 'button';
  card.style.setProperty('--card-delay', `${Math.min(index, 5) * 55}ms`);
  card.setAttribute('aria-label', `${dish.name}, ${formatPrice(dish.price)}, подробнее`);
  const photo = document.createElement('div');
  photo.className = 'dish-photo';
  const img = document.createElement('img');
  img.src = dish.file;
  img.alt = dish.name;
  img.width = 900;
  img.height = 675;
  img.loading = 'lazy';
  photo.append(img);
  const arrow = document.createElement('span');
  arrow.className = 'dish-arrow';
  arrow.append(createIcon('arrow-up-right'));
  arrow.setAttribute('aria-hidden', 'true');
  photo.append(arrow);
  if (dish.id === 2) {
    const badge = document.createElement('span');
    badge.className = 'dish-badge';
    badge.textContent = 'НАЧНИТЕ С НЕГО';
    photo.append(badge);
  }
  const info = document.createElement('div');
  info.className = 'dish-info';
  const title = document.createElement('h3');
  title.textContent = dish.name;
  const price = document.createElement('span');
  price.className = 'dish-price';
  price.textContent = formatPrice(dish.price);
  const weight = document.createElement('span');
  weight.className = 'dish-weight';
  weight.textContent = dish.weight;
  info.append(title, price, weight);
  card.append(photo, info);
  card.addEventListener('click', () => openDish(dish));
  return card;
}

function renderMenu(category = 'favorites') {
  const selected = dishes.filter(dish => category === 'favorites' ? dish.favorite : dish.category === category);
  grid.replaceChildren(...selected.map(createDishCard));
  document.querySelectorAll('[data-category]').forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#menu-status').textContent = `Показано блюд: ${selected.length}`;
}

function openDish(dish) {
  const content = document.querySelector('#dish-content');
  content.replaceChildren();
  const img = document.createElement('img');
  img.src = dish.file;
  img.alt = dish.name;
  const info = document.createElement('div');
  info.className = 'dish-dialog-info';
  const weight = document.createElement('span');
  weight.className = 'eyebrow';
  weight.textContent = `ИЗ МЕНЮ МЦХЕТЫ · ${dish.weight}`;
  const title = document.createElement('h2');
  title.id = 'dish-title';
  title.textContent = dish.name;
  const description = document.createElement('p');
  description.textContent = categoryDescriptions[dish.category];
  const price = document.createElement('strong');
  price.textContent = formatPrice(dish.price);
  const link = document.createElement('a');
  link.href = deliveryUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'button button-solid';
  link.append('Заказать в Яндекс Еде', createIcon('arrow-up-right'));
  const note = document.createElement('small');
  note.textContent = 'Цена доставки. Состав, аллергены и актуальную стоимость уточняйте при заказе.';
  info.append(weight, title, description, price, link, note);
  content.append(img, info);
  dishDialog.setAttribute('aria-labelledby', 'dish-title');
  dishDialog.showModal();
  dishDialog.scrollTop = 0;
}

function setupDialogs() {
  bookingDialog.setAttribute('aria-label', 'Бронирование стола по телефону');
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => { bookingDialog.showModal(); bookingDialog.scrollTop = 0; }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
}

function setupScrollEffects() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-ready');
  const header = document.querySelector('.header');
  const photo = document.querySelector('.hero-photo');
  let scheduled = false;
  function updateScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);
    if (!motionPreference.matches && desktopMotion.matches && window.scrollY < 950) photo.style.transform = `translateY(${Math.min(window.scrollY * 0.05, 18)}px) scale(1.08)`;
    else photo.style.transform = '';
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  motionPreference.addEventListener('change', updateScroll);
  desktopMotion.addEventListener('change', updateScroll);
  updateScroll();
}

document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => renderMenu(button.dataset.category)));
document.querySelector('#year').textContent = new Date().getFullYear();
renderMenu();
setupNavigation();
setupDialogs();
setupScrollEffects();
