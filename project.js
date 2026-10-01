'use strict';
const translations = window.projectTranslations;
function setLanguage(language, announce = true) {
  if (language !== 'id' && language !== 'en') return;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerHTML = translations[language][element.dataset.i18n];
  });
  document.querySelector('[data-language-label]').setAttribute('aria-label', language === 'id' ? 'Pilih bahasa' : 'Choose language');
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  try { localStorage.setItem('portfolio-language',language); } catch { /* Translation remains usable without storage. */ }
  if (announce) document.querySelector('#language-announcement').textContent = language === 'id' ? 'Bahasa diubah ke Bahasa Indonesia.' : 'Language changed to English.';
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
let language = 'id';
try { if (localStorage.getItem('portfolio-language') === 'en') language = 'en'; } catch { /* Indonesian is the default. */ }
setLanguage(language, false);
document.querySelector('#year').textContent = new Date().getFullYear();
