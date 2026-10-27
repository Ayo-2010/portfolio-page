var root = document.documentElement;
var themeBtn = document.getElementById('themeBtn');
var navLinks = document.getElementById('navLinks');
var form = document.getElementById('contactForm');
var nameEl = document.getElementById('name');
var emailEl = document.getElementById('email');
var messageEl = document.getElementById('message');
var formStatus = document.getElementById('formStatus');

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function readTheme() {
  try {
    return localStorage.getItem('portfolio:theme');
  } catch (e) {
    return null;
  }
}

function saveTheme(value) {
  try {
    localStorage.setItem('portfolio:theme', value);
  } catch (e) {
    return;
  }
}

function applyTheme(mode) {
  root.setAttribute('data-theme', mode);
  themeBtn.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
}

themeBtn.addEventListener('click', function () {
  var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
});

var savedTheme = readTheme();
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

function setupReveal() {
  var items = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  for (var j = 0; j < items.length; j++) io.observe(items[j]);
}

function setupSkills() {
  var skills = document.querySelectorAll('.skill');
  function fill() {
    for (var i = 0; i < skills.length; i++) {
      var value = skills[i].dataset.value;
      if (value === undefined) continue;
      var bar = skills[i].querySelector('.skill-fill');
      bar.style.width = value + '%';
    }
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    fill();
    return;
  }
  var written = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !written) {
        written = true;
        fill();
        io.disconnect();
      }
    });
  }, { threshold: 0 });
  io.observe(document.getElementById('skills'));
}

function setupNavHighlight() {
  var links = navLinks.querySelectorAll('a');
  var sections = [];
  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ link: links[i], section: section });
  }
  if (!('IntersectionObserver' in window) || !sections.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      for (var k = 0; k < sections.length; k++) {
        sections[k].link.classList.toggle('is-active', sections[k].section === entry.target);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  for (var j = 0; j < sections.length; j++) io.observe(sections[j].section);
}

function setError(input, text) {
  var field = input.closest('.field');
  var slot = field.querySelector('.err');
  if (text) {
    field.classList.add('has-error');
    slot.textContent = text;
    input.setAttribute('aria-invalid', 'true');
  } else {
    field.classList.remove('has-error');
    slot.textContent = '';
    input.removeAttribute('aria-invalid');
  }
}

function validateName() {
  var value = nameEl.value.trim();
  if (!value) {
    setError(nameEl, 'Please tell me your name.');
    return false;
  }
  if (value.length < 2) {
    setError(nameEl, 'That looks a little short.');
    return false;
  }
  setError(nameEl, '');
  return true;
}

function validateEmail() {
  var value = emailEl.value.trim();
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!value) {
    setError(emailEl, 'An email address is required.');
    return false;
  }
  if (!pattern.test(value)) {
    setError(emailEl, 'Check the address format.');
    return false;
  }
  setError(emailEl, '');
  return true;
}

function validateMessage() {
  var value = messageEl.value.trim();
  if (!value) {
    setError(messageEl, 'Add a short message.');
    return false;
  }
  if (value.length < 10) {
    setError(messageEl, 'Give me at least ten characters.');
    return false;
  }
  setError(messageEl, '');
  return true;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var okName = validateName();
  var okEmail = validateEmail();
  var okMessage = validateMessage();

  if (!okName) {
    nameEl.focus();
  } else if (!okEmail) {
    emailEl.focus();
  } else if (!okMessage) {
    messageEl.focus();
  }

  if (!okName || !okEmail || !okMessage) {
    formStatus.hidden = true;
    return;
  }

  formStatus.hidden = false;
  formStatus.textContent = 'Thanks ' + nameEl.value.trim() + '. Your message is queued and I will reply within two working days.';
  form.reset();
  setError(nameEl, '');
  setError(emailEl, '');
  setError(messageEl, '');
});

nameEl.addEventListener('input', function () {
  if (nameEl.closest('.field').classList.contains('has-error')) validateName();
});

emailEl.addEventListener('input', function () {
  if (emailEl.closest('.field').classList.contains('has-error')) validateEmail();
});

messageEl.addEventListener('input', function () {
  if (messageEl.closest('.field').classList.contains('has-error')) validateMessage();
});

var showMoreBtn = document.getElementById('showMore');
var githubGrid = document.getElementById('githubGrid');

if (showMoreBtn && githubGrid) {
  var extraCount = githubGrid.querySelectorAll('.card.is-extra').length;
  var collapsedLabel = 'Show ' + extraCount + ' more';

  showMoreBtn.addEventListener('click', function () {
    var open = githubGrid.classList.toggle('show-all');
    showMoreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    showMoreBtn.textContent = open ? 'Show less' : collapsedLabel;

    if (!open) {
      var top = showMoreBtn.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight) {
        showMoreBtn.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'center'
        });
      }
    }
  });
}

setupReveal();
setupSkills();
setupNavHighlight();
