(() => {
  'use strict';
  const dialog = document.querySelector('#image-viewer');
  const triggers = Array.from(document.querySelectorAll('.gallery-trigger'));
  let current = 0;
  let previousFocus;
  let priorOverflow = '';
  let zoomed = false;
  const english = () => document.documentElement.lang === 'en';
  function renderImage() {
    if (!dialog || !triggers.length) return;
    const trigger = triggers[current];
    const source = trigger.querySelector('img');
    const title = english() ? trigger.dataset.titleEn : trigger.dataset.titleId;
    const image = dialog.querySelector('#viewer-image');
    image.src = source.getAttribute('src');
    image.alt = title;
    const stage = dialog.querySelector('.viewer-stage');
    stage.classList.toggle('is-zoomed', zoomed);
    image.style.setProperty('--zoom-width', `${Number(source.getAttribute('width')) * 2}px`);
    dialog.querySelector('.viewer-zoom').textContent = zoomed ? '2×' : '1×';
    dialog.querySelector('.viewer-zoom').setAttribute('aria-pressed', String(zoomed));
    dialog.querySelector('#viewer-title').textContent = title;
    dialog.querySelector('#viewer-counter').textContent = `${current + 1} / ${triggers.length}`;
    dialog.querySelector('.viewer-prev').disabled = current === 0;
    dialog.querySelector('.viewer-next').disabled = current === triggers.length - 1;
  }
  function translate() {
    document.querySelectorAll('[data-alt-id]').forEach(image => { image.alt = english() ? image.dataset.altEn : image.dataset.altId; });
    triggers.forEach(trigger => trigger.setAttribute('aria-label', `${english() ? 'Enlarge' : 'Perbesar'}: ${english() ? trigger.dataset.titleEn : trigger.dataset.titleId}`));
    if (!dialog) return;
    dialog.querySelector('.viewer-close').setAttribute('aria-label', english() ? 'Close image' : 'Tutup gambar');
    dialog.querySelector('.viewer-prev').setAttribute('aria-label', english() ? 'Previous image' : 'Gambar sebelumnya');
    dialog.querySelector('.viewer-next').setAttribute('aria-label', english() ? 'Next image' : 'Gambar berikutnya');
    dialog.querySelector('.viewer-zoom').setAttribute('aria-label', english() ? 'Toggle 2× zoom' : 'Aktifkan atau matikan zoom 2×');
    if (dialog.open) renderImage();
  }
  new MutationObserver(translate).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  translate();
  if (!dialog || !triggers.length) return;
  triggers.forEach((trigger,index) => trigger.addEventListener('click', () => {
    current = index;
    zoomed = false;
    previousFocus = document.activeElement;
    priorOverflow = document.body.style.overflow;
    renderImage();
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector('.viewer-close').focus();
  }));
  function move(direction) {
    zoomed = false;
    current = Math.min(triggers.length - 1, Math.max(0,current + direction));
    renderImage();
  }
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => move(-1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => move(1));
  dialog.querySelector('.viewer-zoom').addEventListener('click', () => { zoomed = !zoomed; renderImage(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click',event => {
    const rect=dialog.getBoundingClientRect();
    if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();
  });
  dialog.addEventListener('close', () => {document.body.style.overflow = priorOverflow;previousFocus?.focus();});
})();
